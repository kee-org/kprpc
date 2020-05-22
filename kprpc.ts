
import JRPC from "jrpc";
import ModelMasher from "./model";
import kdbxweb, { Kdbx, KdbxEntry } from "kdbxweb";
import {KdbxPlaceholders} from "kdbx-placeholders";
import { KeeEntry, MatchAccuracyEnum } from "./kfDataModel";

let remote;
let pinger;
let stopReceiving;
let stopWaitingForStartup;
let requestedInstanceCount = 0;

/*

Create a new instance of this class, passing through an implementation object
that contains implementations for each KPRPC function.

This allows different applications to utilise this same framework without us
making any assumptions about how one can implement each feature. An initial
implementation is created for Kee Vault.

*/

type FileModel = {db: Kdbx, getEntry: (a: any) => any, subId: (a: any) => any, reload: () => void, id: string};

let getEntry: Function;
let ping: Function;
let getDomain: Function;
let editEntry: Function;
let getFiles: Function;
let getFileInfos: Function;
let messageToKeeAddonProxy: Function;
let generatePassword: Function;
let getPasswordProfiles: Function;
let openOrUnlockOrFocusFile: Function;
let addEntry: Function;
let syncFile: (file: FileModel, opts: any) => void;
let getSetting: (name: string) => string;
let onKeeAddonEnabled: Function;
let onKeeAddonActivated: Function;
let modelMasher: ModelMasher;
let readAddonSettings: Function;
let updateAddonSettings: (settings: object, version: number) => void;
let delayUntilIntegrationReady: () => Promise<void>;
let launchBuiltInPasswordGenerator: () => void;

const impl = {
    openEntryForEditing: function (uuid, dbFileId) {
        logger.debug("Opening entry for editing. UUID: " + uuid + " in DB: " + dbFileId);

        const items = getEntry(uuid, dbFileId);

        if (items.length === 1) {
            const item = items[0];
            editEntry(item);
        } else if (items.length > 1) {
            logger.warn("Duplicate entry UUIDs found in open databases. KPRPC cannot proceed.");
        } else {
            logger.warn("Entry UUID not found.");
        }
    },
    getCurrentKFConfig: function () {
        return { knownDatabases: getFileInfos().first(16).map(fi => ({id: fi.id, name: fi.get("name")})) };
    },
    changeDatabase: function (dbFileId, closeCurrent) {
        openOrUnlockOrFocusFile(dbFileId);
    },
    changeLocation: function (locationId) {
        throw new Error("Not implemented yet. This feature may be removed.");
    },
    addLogin: function (login, parentUUID, dbFileId) {
        logger.debug("adding login");
        const files: any[] = [];

        if (!dbFileId) {
            // find the database
            getFiles().forEach(file => {
                if (file.open && modelMasher.isConfigCorrectVersion(file.db)) files.push(file);
            });
        } else {
            const file = getFiles()._byId[dbFileId];
            if (file.open && modelMasher.isConfigCorrectVersion(file.db)) files.push(file);
        }

        // Make sure there is a single (or specified) open database
        if (!files || files.length !== 1) { return null; }

        const chosenFile = files[0];

        let parentGroup;

        if (parentUUID && parentUUID.length > 0) {
            const matchedGroup = chosenFile.getGroup(chosenFile.subId(parentUUID));

            if (matchedGroup != null) { parentGroup = matchedGroup; }
        }

        if (!parentGroup) { parentGroup = modelMasher.getRootPwGroup(chosenFile.db); }

        const newLogin = addEntry(parentGroup, chosenFile, login, modelMasher.fromKeeEntry.bind(modelMasher));

        const newEntry = modelMasher.toKeeEntry(chosenFile.db,
            newLogin,
            {fileName: chosenFile.id, active: true},
            {fullDetail: true, matchAccuracy: MatchAccuracyEnum.Best});

        return newEntry;
    },
    updateLogin: function (login: KeeEntry, oldLoginUUID, urlMergeMode: number, dbFileId, save: boolean) {
        logger.debug("updating login");
        const files: FileModel[] = [];

        if (!login) { throw new Error("(new) login was not passed to the updateLogin function"); }
        if (!oldLoginUUID) { throw new Error("oldLoginUUID was not passed to the updateLogin function"); }
        if (!dbFileId) { throw new Error("dbFileName was not passed to the updateLogin function"); }

        const file = getFiles()._byId[dbFileId];
        // file = app file model
        // file.db = Kdbx
        if (file.open && modelMasher.isConfigCorrectVersion(file.db)) files.push(file);

        // Make sure there is a single (or specified) open database
        if (!files || files.length !== 1) { return null; }

        const chosenFile = files[0];

        let tempEntry = chosenFile.db.createEntry(chosenFile.db.getDefaultGroup());
        tempEntry = modelMasher.fromKeeEntry(chosenFile.db, login, tempEntry, getDomain);

        const existingLogin = chosenFile.getEntry(chosenFile.subId(oldLoginUUID));
        mergeEntries(existingLogin.entry, tempEntry, urlMergeMode, chosenFile.db);
        existingLogin.setEntry(existingLogin.entry, existingLogin.group, chosenFile);

        // Remove the temporary entry
        chosenFile.db.move(tempEntry, null);

        chosenFile.reload();

        if (save) syncFile(chosenFile, { skipValidation: true, startedByUser: false });

        const newEntry = modelMasher.toKeeEntry(chosenFile.db,
            existingLogin.entry,
            {fileName: chosenFile.id, active: true},
            {fullDetail: true, matchAccuracy: MatchAccuracyEnum.Best});

        return newEntry;
    },
    getAllDatabases: function (fullDetail: boolean) {
        const dbs = getFiles().map(val => {
            // More than one DB can be active at once.
            const db = modelMasher.toKeeDatabase(val.db, {fileName: val.id, active: true}, { fullDetail });
            return db;
        });
        const config = readAddonSettings();
        return {
            dbs,
            config
        };
    },
    findLogins: function (unsanitisedURLs: string[], actionURL, httpRealm, lst, requireFullURLMatches, uniqueID, dbFileId, freeTextSearch, unusedUsername) {
        logger.debug("Finding logins");
        const files: any[] = [];
        const allEntries: any[] = [];

        if (!dbFileId) {
            // find the database
            getFiles().forEach(file => {
                if (file.open && modelMasher.isConfigCorrectVersion(file.db)) files.push(file);
            });
        } else {
            const file = getFiles()._byId[dbFileId];
            if (file.open && modelMasher.isConfigCorrectVersion(file.db)) files.push(file);
        }

        // Make sure there is an open database
        if (!files || files.length === 0) { return null; }

        // if uniqueID is supplied, match just that one login. if not found, move on to search the content of the logins...
        if (uniqueID != null && uniqueID.length > 0) {
            files.forEach(file => {
                const e = file.getEntry(file.subId(uniqueID));
                //const dbModel = model.toKee.database(file.db, false, true);
                if (e) {
                    const entry = modelMasher.toKeeEntry(file.db,
                        e.entry,
                        {fileName: file.id, active: true},
                        {fullDetail: true, matchAccuracy: MatchAccuracyEnum.Best}
                    ) as KeeEntry;
                    allEntries.push(entry);
                }
            });
        }

        if (allEntries.length > 0) { return allEntries; }

        if (freeTextSearch) {
            files.forEach(file => {
                file.forEachEntry({textLower: freeTextSearch}, e => {
                    const entry = modelMasher.toKeeEntry(file.db,
                        e.entry,
                        {fileName: file.id, active: true},
                        {fullDetail: true, matchAccuracy: MatchAccuracyEnum.None});
                    allEntries.push(entry);
                });
            });
        }

        // else we search for the URLs

        // First, we remove any data URIs from the list - there aren't any practical use cases
        // for this which can trump the security risks introduced by attempting to support their use.
        const URLs: string[] = unsanitisedURLs.filter(u => u.indexOf("data:") !== 0);

        if (allEntries.length === 0 && URLs.length > 0 && URLs[0]) {
            const URLHostnameAndPorts: any[] = [];

            // make sure that hostname and actionURL always represent only the hostname portion
            // of the URL
            // It's tempting to demand that the protocol must match too (e.g. http forms won't
            // match a stored https login) but best not to define such a restriction in KeePassRPC
            // - the RPC client (e.g. KeeFox) can decide to penalise protocol mismatches,
            // potentially dependant on user configuration options in the client.
            for (let i = 0; i < URLs.length; i++) {
                URLHostnameAndPorts[URLs[i]] = modelMasher.getURLSummary(URLs[i], getDomain);
            }

            // foreach DB...
            files.forEach(file => {
                const dbConfig = modelMasher.getDatabaseKPRPCConfig(file.db);

                const homeGroup = modelMasher.getRootPwGroup(file.db);
                homeGroup.forEach((entry, group) => {
                    // not interested in groups
                    if (group || !entry) return;

                    // ignore if it's in the recycle bin
                    if (entry.parentGroup.uuid.equals(file.db.meta.recycleBinUuid)) return;

                    const conf = modelMasher.getEntryConfig(entry, dbConfig);

                    if (conf == null || conf.hide) { return; }

                    let entryIsAMatch = false;
                    let bestMatchAccuracy = 0;

                    if (conf.regExURLs) {
                        URLs.forEach(URL => {
                            for (let i = 0; i < conf.regExURLs!.length; i++) {
                                const regexPattern = conf.regExURLs![i];

                                try {
                                    if (regexPattern && new RegExp(regexPattern).test(URL)) {
                                        entryIsAMatch = true;
                                        bestMatchAccuracy = 50;
                                        break;
                                    }
                                } catch (ex) {
                                    logger.warn("'" + regexPattern + "' is not a valid regular expression. This error was found in an entry in your database called '" +
                                    entry.fields["Title"] + "'. You need to fix or delete this regular expression to prevent this warning message appearing.");
                                    break;
                                }
                            }
                        });
                    }

                    // Check for matching URLs for the page or HTTPAuth containing the form
                    if (!entryIsAMatch && (lst !== "LSTnoForms" || lst !== "LSTnoRealms")) {
                        URLs.forEach(URL => {
                            const mam = modelMasher.getMatchAccuracyMethod(entry, URLHostnameAndPorts[URL], dbConfig);
                            const accuracy = modelMasher.bestMatchAccuracyForAnyURL(entry, conf, URL, URLHostnameAndPorts[URL], mam, file.db);
                            if (accuracy > bestMatchAccuracy) { bestMatchAccuracy = accuracy; }
                        });
                    }

                    if (bestMatchAccuracy === 50 ||
                        (!requireFullURLMatches && bestMatchAccuracy > 0)) {
                        entryIsAMatch = true;
                    }

                    // If we think we found a match, check it's not on a block list
                    if (entryIsAMatch) {
                        for (let i = 0; i < URLs.length; i++) {
                            const URL = URLs[i];
                            if (modelMasher.matchesAnyBlockedURL(conf, URL)) {
                                entryIsAMatch = false;
                                break;
                            }
                            if (conf.regExBlockedURLs) {
                                for (let j = 0; j < conf.regExBlockedURLs.length; j++) {
                                    const pattern = conf.regExBlockedURLs[j];
                                    try {
                                        if (pattern && new RegExp(pattern).test(URL)) {
                                            entryIsAMatch = false;
                                            break;
                                        }
                                    } catch (ex) {
                                        logger.warn("'" + pattern + "' is not a valid regular expression. This error was found in an entry in your database called '" +
                                        entry.fields["Title"] + "'. You need to fix or delete this regular expression to prevent this warning message appearing.");
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (entryIsAMatch) {
                        allEntries.push(modelMasher.toKeeEntry(file.db,
                            entry,
                            {fileName: file.id, active: true},
                            {fullDetail: true, matchAccuracy: bestMatchAccuracy}));
                    }
                });
            });

            allEntries.sort((a, b) => {
                const titleA = a.title ? a.title.toUpperCase() : "";
                const titleB = b.title ? b.title.toUpperCase() : "";
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
            });
        }
        return allEntries;
    }
};


const mergeEntries = function (destination: KdbxEntry, source: KdbxEntry, urlMergeMode: number, db: Kdbx) {
    const dbConfig = modelMasher.getDatabaseKPRPCConfig(db);
    const destConfig = modelMasher.getEntryConfig(destination, dbConfig);
    if (!destConfig) { return; }

    const sourceConfig = modelMasher.getEntryConfig(source, dbConfig);
    if (!sourceConfig) { return; }

    destination.pushHistory();

    destConfig.hTTPRealm = sourceConfig.hTTPRealm;

    destination.icon = source.icon;
    destination.customIcon = source.customIcon;

    destination.fields["Title"] = source.fields["Title"];
    destination.fields["UserName"] = source.fields["UserName"];
    destination.fields["Password"] = kdbxweb.ProtectedValue.fromString(source.fields["Password"].getText());
    destConfig.formFieldList = sourceConfig.formFieldList;

    // This algorithm could probably be made more efficient (lots of O(n) operations
    // but we're dealing with pretty small n so I've gone with the conceptually
    // easiest approach for now).

    let destURLs: string[] = [];
    destURLs.push(destination.fields["URL"]);
    if (destConfig.altURLs) { destURLs = destURLs.concat(destConfig.altURLs); }

    let sourceURLs: string[] = [];
    sourceURLs.push(source.fields["URL"]);
    if (sourceConfig.altURLs) { sourceURLs = sourceURLs.concat(sourceConfig.altURLs); }

    /// <param name="urlMergeMode">1= Replace the entry's URL (but still fill forms if you visit the old URL)
    /// 2= Replace the entry's URL (delete the old URL completely)
    /// 3= Keep the old entry's URL (but still fill forms if you visit the new URL)
    /// 4= Keep the old entry's URL (don't add the new URL to the entry)
    /// 5= No merge. Delete all URLs and replace with those supplied in the new entry data</param>
    switch (urlMergeMode) {
    case 1:
        mergeInNewURLs(destURLs, sourceURLs);
        break;
    case 2:
        destURLs.shift();
        mergeInNewURLs(destURLs, sourceURLs);
        break;
    case 3:
        if (sourceURLs.length > 0) {
            sourceURLs.forEach(sourceUrl => {
                if (!destURLs.includes(sourceUrl)) { destURLs.push(sourceUrl); }
            });
        }
        break;
    case 4:
        // No changes to URLs
        break;
    case 5:
        destURLs = sourceURLs;
        break;
    default:
        // No changes to URLs
        break;
    }

    // These might not have changed but meh
    destination.fields["URL"] = destURLs[0];
    destConfig["altURLs"] = [];
    if (destURLs.length > 1) { destConfig["altURLs"] = destURLs.slice(1, destURLs.length); }

    modelMasher.setEntryConfig(destination, destConfig);
    destination.times.update();
};

const mergeInNewURLs = function (destURLs: string[], sourceURLs: string[]) {
    if (sourceURLs.length > 0) {
        for (let i = sourceURLs.length - 1; i >= 0; i--) {
            const sourceUrl = sourceURLs[i];

            if (!destURLs.includes(sourceUrl)) {
                destURLs.unshift(sourceUrl);
            } else if (i === 0) {
                // Promote the URL from alternative URL list to primary URL
                destURLs.splice(destURLs.indexOf(sourceUrl), 1);
                destURLs.unshift(sourceUrl);
            }
        }
    }
};

let logger;
let appMetadata;

export default class KPRPC {

    public static SIGNAL_OPENED = 4;
    public static SIGNAL_CLOSED = 6;
    public static SIGNAL_SAVED = 8;

    init (dependencies, loggerIn, appVersionString) {
        logger = loggerIn;

        requestedInstanceCount++;
        if (requestedInstanceCount <= 0) {
            logger.debug("Ignoring init request because we've seen enough shutdown requests to indicate we should not be running in this environment.");
            return;
        }
        if (requestedInstanceCount > 1) {
            logger.error("Unexpected init request. Call shutdown first if you want to reinit.");
            return;
        }

        getEntry = dependencies.getEntry;
        ping = dependencies.ping;
        getDomain = dependencies.getDomain;
        editEntry = dependencies.editEntry;
        getFiles = dependencies.getFiles;
        getFileInfos = dependencies.getFileInfos;
        messageToKeeAddonProxy = dependencies.messageToKeeAddonProxy;
        generatePassword = dependencies.generatePassword;
        getPasswordProfiles = dependencies.getPasswordProfiles;
        openOrUnlockOrFocusFile = dependencies.openOrUnlockOrFocusFile;
        addEntry = dependencies.addEntry;
        syncFile = dependencies.syncFile;
        getSetting = dependencies.getSetting;
        onKeeAddonEnabled = dependencies.onKeeAddonEnabled;
        onKeeAddonActivated = dependencies.onKeeAddonActivated;
        readAddonSettings = dependencies.readAddonSettings;
        updateAddonSettings = dependencies.updateAddonSettings;
        delayUntilIntegrationReady = dependencies.delayUntilIntegrationReady;
        launchBuiltInPasswordGenerator = dependencies.launchBuiltInPasswordGenerator;

        modelMasher = new ModelMasher(new KdbxPlaceholders(), getDomain, logger);

        appMetadata = {
            KeePassVersion: appVersionString,
            IsMono: "unknown",
            NETCLR: "0",
            NETversion: "unknown",
            MonoVersion: "unknown"
        };

        remote = new JRPC();

        remote.expose({
            LaunchGroupEditor: (params, next) => this.executeNow(() => this.LaunchGroupEditor(params[0], params[1]), next),
            LaunchLoginEditor: (params, next) => this.executeNow(() => this.LaunchLoginEditor(params[0], params[1]), next),
            GetCurrentKFConfig: (params, next) => this.deferIfNeeded(() => this.GetCurrentKFConfig(), next),
            GetApplicationMetadata: (params, next) => this.executeNow(() => this.GetApplicationMetadata(), next),
            ChangeDatabase: (params, next) => this.deferIfNeeded(() => this.ChangeDatabase(params[0], params[1]), next),
            GetPasswordProfiles: (params, next) => this.executeNow(() => this.GetPasswordProfiles(), next),
            GeneratePassword: (params, next) => this.executeNow(() => this.GeneratePassword(params[0], params[1]), next),
            AddLogin: (params, next) => this.deferIfNeeded(() => this.AddLogin(params[0], params[1], params[2]), next),
            UpdateLogin: (params, next) => this.deferIfNeeded(() => this.UpdateLogin(params[0], params[1], params[2], params[3]), next),
            GetAllDatabases: (params, next) => this.executeNow(() => this.GetAllDatabases(params ? params[0] : false), next),
            FindLogins: (params, next) => this.executeNow(() => this.FindLogins(params[0], params[1], params[2], params[3],
                 params[4], params[5], params[6], params[7], params[8]), next),
            UpdateAddonSettings: (params, next) => this.deferIfNeeded(() => this.updateAddonSettings(params[0], params[1]), next)
        });

        // Let JRPC send requests and responses continuously
        remote.setTransmitter((msg, next) => {
            try {
                if (messageToKeeAddonProxy) messageToKeeAddonProxy({ message: msg });
                return next(false);
            } catch (e) {
                return next(true);
            }
        });

        stopWaitingForStartup = listen(document, "KeeAddonEnabled", (event: CustomEvent) => {
            if (!window["KeeAddonSupportedFeatures"]
            || !window["KeeAddonSupportedFeatures"].length
            || !["KPRPC_FEATURE_BROWSER_HOSTED", "KPRPC_FEATURE_VERSION_1_6", "BROWSER_SETTINGS_SYNC"]
                .every(function (feature) {
                    return window["KeeAddonSupportedFeatures"].indexOf(feature) !== -1;
                })
            ) {
                logger.warn("Browser extension does not support features we require");
                return;
            }

            onKeeAddonEnabled();
            // now that the API is loaded we can invoke the connection startup code and
            // modify the page app as needed to say we are connecting to the browser (if we want)
            if (stopReceiving) {
                stopReceiving();
            }
            stopReceiving = listen(document, event.detail, (e: CustomEvent) => {
                if (e.detail === JSON.stringify({protocol: "ackinit"})) {
                    logger.debug("Setting up regular ping to browser");
                    if (pinger) {
                        clearInterval(pinger);
                    }
                    pinger = setInterval(ping, 1000 * 5);
                    onKeeAddonActivated();
                } else if (e.detail === JSON.stringify({protocol: "showgenerator"})) {
                    // Maybe could/should/will one day be a new KPRPC feature but seems to be
                    // little benefit beyond the specific use case of Kee being unable/willing
                    // to create its usual profile selection iframe inside Kee Vault.
                    launchBuiltInPasswordGenerator();
                } else {
                    remote.receive(e.detail);
                }
            });
            logger.debug("Sending capabilities to browser");
            messageToKeeAddonProxy({ features: [
                "KPRPC_FEATURE_VERSION_1_6",
                "KPRPC_GENERAL_CLIENTS",
                "KPRPC_FEATURE_BROWSER_HOSTED",
                "KPRPC_FEATURE_KEE_BRAND",
                "KPRPC_FIELD_DEFAULT_NAME_AND_ID_EMPTY",
                "BROWSER_SETTINGS_SYNC",
                "KPRPC_FEATURE_ENTRY_URL_REPLACEMENT"
            ]});
        });
    }

    async deferIfNeeded (func, next) {
        try {
            await delayUntilIntegrationReady();
            const result = await func();
            next(false, result);
        } catch (e) {
            next(true, e);
        }
    }

    executeNow (func, next) {
        try {
            const result = func();
            next(false, result);
        } catch (e) {
            next(true, e);
        }
    }

    shutdown () {
        logger.debug("Shutting down KPRPC. Call init() again to restart.");
        requestedInstanceCount--;
        if (pinger) clearInterval(pinger);
        if (stopWaitingForStartup) stopWaitingForStartup();
        if (stopReceiving) stopReceiving();
        if (remote) remote.shutdown();
        remote = null;
    }


    LaunchGroupEditor (uuid, dbFileName) {
        throw new Error("Not implemented");
    }

    LaunchLoginEditor (uuid, dbFileName) {
        impl.openEntryForEditing(uuid, dbFileName);
    }

    GetCurrentKFConfig () {
        return impl.getCurrentKFConfig();
    }

    GetApplicationMetadata () {
        return appMetadata;
    }

    ChangeDatabase (fileName, closeCurrent) {
        impl.changeDatabase(fileName, closeCurrent);
    }

    GetPasswordProfiles () {
        return getPasswordProfiles();
    }

    GeneratePassword (profileDisplayName, url) {
        return generatePassword(profileDisplayName, url);
    }

    AddLogin (login, parentUUID, dbFileName) {
        return impl.addLogin(login, parentUUID, dbFileName);
    }

    UpdateLogin (login, oldLoginUUID, urlMergeMode, dbFileName) {
        return impl.updateLogin(login, oldLoginUUID, urlMergeMode, dbFileName, getSetting("autosave") === "true");
    }

    GetAllDatabases (fullDetails) {
        return impl.getAllDatabases(fullDetails);
    }

    FindLogins (URLs, actionURL, httpRealm, lst, requireFullURLMatches, uniqueID, dbFileName, freeTextSearch, username) {
        return impl.findLogins(URLs, actionURL, httpRealm, lst, requireFullURLMatches, uniqueID, dbFileName, freeTextSearch, username);
    }

    updateAddonSettings (settings: object, version: number) {
        updateAddonSettings(settings, version);
    }

    notify (signal) {
        remote.notify("KPRPCListener", [signal]);
    }
}

function listen (element, type: string, handler) {
    element.addEventListener(type, handler);
    return function () {
        element.removeEventListener(type, handler);
    };
}
