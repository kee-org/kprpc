"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utilities = void 0;
const kdbxweb_1 = require("kdbxweb");
const icons_1 = require("./icons");
const EntryConfig_1 = require("./EntryConfig");
const DatabaseConfig_1 = require("./DatabaseConfig");
const MatchAccuracyMethod_1 = require("./MatchAccuracyMethod");
const kfDataModel_1 = require("./kfDataModel");
const Hex_1 = require("./Hex");
const GuidService_1 = require("./GuidService");
// Ideally we would extend the various kdbxweb classes but they are hidden from public access so we
// have to take this messy approach of mashing extensions on the side. We have a variety of
// regularly required instance objects and functions to help us achieve this so we require
// instantiation rather than passing dozens of parameters to every (frequent) use of functions in this file.
class DBContext {
}
class ModelMasherConfig {
}
class ModelMasher {
    constructor(Placeholders, getDomain, logger) {
        this.Placeholders = Placeholders;
        this.getDomain = getDomain;
        this.logger = logger;
    }
    toKeeDatabase(dbIn, dbContext, config) {
        var _a;
        // debugger;
        if (config.fullDetail && config.noDetail) {
            throw new Error("Don't be silly");
        }
        const rgModel = this.getRootPwGroup(dbIn);
        let rg;
        if (config.noDetail) {
            rg = this.toKeeGroup(dbIn, rgModel);
        }
        else {
            rg = this._getSubGroups(dbIn, rgModel, dbContext, { complete: true, fullDetail: config.fullDetail, matchAccuracy: kfDataModel_1.MatchAccuracyEnum.None, urlRequired: true });
        }
        return {
            name: (_a = dbIn.meta.name) !== null && _a !== void 0 ? _a : "",
            fileName: dbContext.fileName,
            active: dbContext.active,
            root: rg,
            iconImageData: rg.iconImageData
        };
    }
    toKeeEntry(db, kdbxEntry, dbContext, config) {
        var _a;
        const formFieldList = [];
        const URLs = [];
        let usernameFound = false;
        let passwordFound = false;
        let alwaysAutoFill = false;
        let neverAutoFill = false;
        let alwaysAutoSubmit = false;
        let neverAutoSubmit = false;
        let priority = 0;
        let usernameName = "";
        let usernameValue = "";
        const url = this.getField(kdbxEntry, "URL", db);
        if (url)
            URLs.push(url);
        const dbConf = this.getDatabaseKPRPCConfig(db);
        const conf = ModelMasher.getEntryConfig(kdbxEntry, dbConf);
        const dbDefaultPlaceholderHandlingEnabled = dbConf.defaultPlaceholderHandling === kfDataModel_1.PlaceholderHandling.Enabled;
        if (conf.formFieldList) {
            conf.formFieldList.forEach(ff => {
                let enablePlaceholders = false;
                let displayName = ff.displayName || ff.name;
                let ffValue = ff.value;
                if (!config.fullDetail && ff.type !== "FFTusername")
                    return;
                if (ff.placeholderHandling === kfDataModel_1.PlaceholderHandling.Enabled ||
                    (ff.placeholderHandling === kfDataModel_1.PlaceholderHandling.Default && dbDefaultPlaceholderHandlingEnabled)) {
                    enablePlaceholders = true;
                }
                if (ff.type === "FFTpassword" && ff.value === "{PASSWORD}") {
                    ffValue = this.getField(kdbxEntry, "Password", db, false);
                    if (ffValue) {
                        displayName = "KeePass password";
                        passwordFound = true;
                    }
                }
                else if (ff.type === "FFTusername" && ff.value === "{USERNAME}") {
                    ffValue = this.getField(kdbxEntry, "UserName", db, false);
                    if (ffValue) {
                        displayName = "KeePass username";
                        usernameFound = true;
                    }
                }
                const derefValue = enablePlaceholders ? this.derefValue(ffValue, kdbxEntry, db) : ffValue;
                if (config.fullDetail) {
                    formFieldList.push({
                        name: ff.name,
                        displayName,
                        value: derefValue,
                        type: ff.type,
                        id: ff.id,
                        page: ff.page,
                        placeholderHandling: ff.placeholderHandling
                    });
                }
                else {
                    usernameName = "username";
                    usernameValue = derefValue;
                }
            });
        }
        if (conf.altURLs) {
            URLs.push(...conf.altURLs);
        }
        // If we didn't find an explicit username field, we assume any value
        // in the KeePass "username" box is what we are looking for
        if (!usernameFound) {
            const derefValue = this.getField(kdbxEntry, "UserName", db, dbDefaultPlaceholderHandlingEnabled);
            if (derefValue) {
                if (config.fullDetail) {
                    formFieldList.push({
                        name: "",
                        displayName: "KeePass username",
                        value: derefValue,
                        type: "FFTusername",
                        id: "",
                        page: 1
                    });
                }
                else {
                    usernameName = "username";
                    usernameValue = derefValue;
                }
            }
        }
        // If we didn't find an explicit password field, we assume any value
        // in the KeePass "password" box is what we are looking for
        if (config.fullDetail && !passwordFound) {
            const derefValue = this.getField(kdbxEntry, "Password", db, dbDefaultPlaceholderHandlingEnabled);
            if (derefValue) {
                formFieldList.push({
                    name: "",
                    displayName: "KeePass password",
                    value: derefValue,
                    type: "FFTpassword",
                    id: "",
                    page: 1
                });
            }
        }
        let icon = null;
        if (kdbxEntry.customIcon) {
            icon = (0, icons_1.toBase64PNG)((_a = db.meta.customIcons.get(kdbxEntry.customIcon.id)) === null || _a === void 0 ? void 0 : _a.data);
        }
        if (config.fullDetail) {
            alwaysAutoFill = conf.alwaysAutoFill;
            alwaysAutoSubmit = conf.alwaysAutoSubmit;
            neverAutoFill = conf.neverAutoFill;
            neverAutoSubmit = conf.neverAutoSubmit;
            priority = conf.priority;
            let realm = "";
            if (conf.hTTPRealm) {
                realm = conf.hTTPRealm;
            }
            return {
                uRLs: URLs,
                title: this.getField(kdbxEntry, "Title", db),
                uniqueID: kdbxEntry.uuid.id,
                iconImageData: icon || (0, icons_1.mapStandardToBase64PNG)(kdbxEntry.icon),
                hTTPRealm: realm,
                formFieldList,
                alwaysAutoFill,
                neverAutoFill,
                alwaysAutoSubmit,
                neverAutoSubmit,
                priority,
                parent: this.toKeeGroup(db, kdbxEntry.parentGroup),
                db: this.toKeeDatabase(db, dbContext, { fullDetail: false, noDetail: true }),
                matchAccuracy: config.matchAccuracy || kfDataModel_1.MatchAccuracyEnum.None
            };
        }
        else {
            return {
                uRLs: URLs,
                title: this.getField(kdbxEntry, "Title", db),
                uniqueID: kdbxEntry.uuid.id,
                usernameValue: usernameValue,
                usernameName: usernameName,
                iconImageData: icon || (0, icons_1.mapStandardToBase64PNG)(kdbxEntry.icon)
            };
        }
    }
    toKeeGroup(db, groupIn) {
        var _a;
        if (!groupIn)
            return undefined;
        let icon = null;
        if (groupIn.customIcon) {
            icon = (0, icons_1.toBase64PNG)((_a = db.meta.customIcons.get(groupIn.customIcon.id)) === null || _a === void 0 ? void 0 : _a.data);
        }
        return {
            title: groupIn.name,
            iconImageData: icon || (0, icons_1.mapStandardToBase64PNG)(groupIn.icon),
            uniqueID: groupIn.uuid.id,
            path: this.getGroupPath(groupIn)
        };
    }
    fromKeeEntry(db, keeEntry, kdbxEntry, getDomain) {
        let firstPasswordFound = false;
        const conf = new EntryConfig_1.EntryConfig({
            version: 1,
            alwaysAutoFill: false,
            neverAutoFill: false,
            alwaysAutoSubmit: false,
            neverAutoSubmit: false,
            priority: 0,
            hide: false,
            blockHostnameOnlyMatch: false,
            blockDomainOnlyMatch: false
        }, this.getDatabaseKPRPCConfig(db).defaultMatchAccuracy);
        const ffl = [];
        // Go through each form field, mostly just making a copy but with occasional tweaks such as default username and password selection
        // by convention, we'll always have the first text field as the username when both reading and writing from the EntryConfig
        keeEntry["formFieldList"].forEach(ff => {
            if (ff.type === "FFTpassword" && !firstPasswordFound) {
                ffl.push({
                    name: ff.name,
                    displayName: "KeePass password",
                    value: "{PASSWORD}",
                    type: ff.type,
                    id: ff.id,
                    page: ff.page
                });
                this.setField(kdbxEntry, "Password", ff.value);
                firstPasswordFound = true;
            }
            else if (ff.type === "FFTusername") {
                ffl.push({
                    name: ff.name,
                    displayName: "KeePass username",
                    value: "{USERNAME}",
                    type: ff.type,
                    id: ff.id,
                    page: ff.page
                });
                this.setField(kdbxEntry, "UserName", ff.value);
            }
            else {
                ffl.push({
                    name: ff.name,
                    displayName: ff.displayName || ff.name,
                    value: ff.value, // No need to protect this value since it'll be stored in a string field that is always protected anyway
                    type: ff.type,
                    id: ff.id,
                    page: ff.page
                });
            }
        });
        if (ffl.length > 0) {
            conf["formFieldList"] = ffl;
        }
        const altURLs = [];
        for (let i = 0; i < keeEntry["uRLs"].length; i++) {
            const url = keeEntry["uRLs"][i];
            if (i === 0) {
                const urlsum = this.getURLSummary(url, getDomain);
                // Require more strict default matching for entries that come
                // with a port configured (user can override in the rare case
                // that they want the loose domain-level matching)
                if (urlsum.port) {
                    conf.setMatchAccuracyMethod(MatchAccuracyMethod_1.MatchAccuracyMethod.Hostname);
                }
                this.setField(kdbxEntry, "URL", url);
            }
            else {
                altURLs.push(url);
            }
        }
        conf.altURLs = altURLs;
        conf.hTTPRealm = keeEntry["hTTPRealm"];
        this.setField(kdbxEntry, "Title", keeEntry["title"]);
        if (keeEntry["iconImageData"]) {
            const iconId = (0, icons_1.searchBase64PNGToStandard)(keeEntry["iconImageData"]);
            if (iconId === null) {
                const customIconData = (0, icons_1.fromBase64PNG)(keeEntry["iconImageData"]);
                if (customIconData) {
                    let iconKeyName;
                    for (const [key, value] of db.meta.customIcons) {
                        if (value.data === customIconData) {
                            iconKeyName = key;
                            break;
                        }
                    }
                    if (!iconKeyName) {
                        const uuid = kdbxweb_1.KdbxUuid.random();
                        db.meta.customIcons.set(uuid.toString(), { data: kdbxweb_1.ByteUtils.arrayToBuffer(customIconData), lastModified: new Date() });
                        iconKeyName = uuid.toString();
                    }
                    kdbxEntry.customIcon = new kdbxweb_1.KdbxUuid(iconKeyName);
                }
            }
            else {
                kdbxEntry.icon = iconId;
            }
        }
        ModelMasher.setEntryConfig(kdbxEntry, conf);
        return kdbxEntry;
    }
    getRootPwGroup(dbIn, location) {
        if (!dbIn) {
            throw new Error("You must specify the database you want to find the root group for");
        }
        if (location) {
            throw new Error("Not implemented");
        }
        const homeGroupUUID = this.getDatabaseKPRPCConfig(dbIn).rootUUID;
        if (homeGroupUUID) {
            const homeGroup = dbIn.getGroup(new kdbxweb_1.KdbxUuid(homeGroupUUID));
            if (!homeGroup) {
                this.logger.error("Home group not found. Database misconfigured. Working around by using default group.");
                return dbIn.getDefaultGroup();
            }
            return homeGroup;
        }
        else {
            return dbIn.getDefaultGroup();
        }
    }
    _getSubGroups(db, groupModel, dbContext, config) {
        const grp = this.toKeeGroup(db, groupModel);
        grp.childEntries = [];
        grp.childLightEntries = [];
        grp.childGroups = [];
        if (config.complete) {
            if (config.fullDetail) {
                groupModel.entries.forEach(entry => {
                    if (entry.fields.get("URL")) {
                        grp.childEntries.push(this.toKeeEntry(db, entry, dbContext, { fullDetail: true, matchAccuracy: config.matchAccuracy }));
                    }
                });
                grp.childEntries.sort((a, b) => {
                    const titleA = a.title ? a.title.toUpperCase() : "";
                    const titleB = b.title ? b.title.toUpperCase() : "";
                    if (titleA < titleB)
                        return -1;
                    if (titleA > titleB)
                        return 1;
                    return 0;
                });
            }
            else {
                groupModel.entries.forEach(entry => {
                    if (entry.fields.get("URL")) {
                        grp.childLightEntries.push(this.toKeeEntry(db, entry, dbContext, { matchAccuracy: config.matchAccuracy }));
                    }
                });
                grp.childLightEntries.sort((a, b) => {
                    const titleA = a.title ? a.title.toUpperCase() : "";
                    const titleB = b.title ? b.title.toUpperCase() : "";
                    if (titleA < titleB)
                        return -1;
                    if (titleA > titleB)
                        return 1;
                    return 0;
                });
            }
            groupModel.groups.forEach(g => {
                if (g.uuid.equals(db.meta.recycleBinUuid))
                    return;
                grp.childGroups.push(this._getSubGroups(db, g, dbContext, config));
            });
            grp.childGroups.sort((a, b) => {
                const titleA = a.title ? a.title.toUpperCase() : "";
                const titleB = b.title ? b.title.toUpperCase() : "";
                if (titleA < titleB)
                    return -1;
                if (titleA > titleB)
                    return 1;
                return 0;
            });
        }
        return grp;
    }
    getMatchAccuracyMethod(entry, urlsum, dbConfig) {
        var _a;
        const conf = ModelMasher.getEntryConfig(entry, dbConfig);
        if (urlsum && urlsum.domain && dbConfig.matchedURLAccuracyOverrides[urlsum.domain]) {
            return dbConfig.matchedURLAccuracyOverrides[urlsum.domain];
        }
        else {
            return (_a = conf.getMatchAccuracyMethod()) !== null && _a !== void 0 ? _a : MatchAccuracyMethod_1.MatchAccuracyMethod.Domain;
        }
    }
    getDatabaseKPRPCConfig(db) {
        var _a, _b;
        const kprpcConfig = (_a = db.meta.customData.get("KeePassRPC.Config")) === null || _a === void 0 ? void 0 : _a.value;
        if (!kprpcConfig) {
            // Set custom data and migrate the old config custom data to this
            // version (but don't save the DB - we can do this again and again until
            // user decides to save a change for another reason)
            const newConfig = new DatabaseConfig_1.DatabaseConfig();
            const keefoxRootUuid = (_b = db.meta.customData.get("KeePassRPC.KeeFox.rootUUID")) === null || _b === void 0 ? void 0 : _b.value;
            if (keefoxRootUuid) {
                newConfig.rootUUID = (0, Hex_1.hex2base64)(keefoxRootUuid);
            }
            this.setDatabaseKPRPCConfig(db, newConfig);
            return newConfig;
        }
        else {
            try {
                return DatabaseConfig_1.DatabaseConfig.fromJSON(kprpcConfig);
            }
            catch (Exception) {
                // Reset to default config because the current stored config is corrupt
                const newConfig = new DatabaseConfig_1.DatabaseConfig();
                this.setDatabaseKPRPCConfig(db, newConfig);
                return newConfig;
            }
        }
    }
    setDatabaseKPRPCConfig(db, newConfig) {
        db.meta.customData.set("KeePassRPC.Config", { value: newConfig.toJSON(), lastModified: new Date() });
    }
    getGroupPath(group) {
        var _a;
        const groupPath = [];
        while (group) {
            groupPath.unshift((_a = group.name) !== null && _a !== void 0 ? _a : "");
            group = group.parentGroup;
        }
        return groupPath.join("/");
    }
    isConfigCorrectVersion(db) {
        // In all rejection cases, ideally we'd at least notify the user and maybe one day even assist with
        //  auto-migration but realistically, they'll just have to open and re-save the DB in KeePass
        var _a;
        // Both version 2 and 3 are correct since their differences
        // do not extend to the public API exposed by KPRPC
        if (((_a = db.meta.customData.get("KeePassRPC.KeeFox.configVersion")) === null || _a === void 0 ? void 0 : _a.value) === "2" ||
            this.getDatabaseKPRPCConfig(db).version === 3) {
            return true;
        }
        else {
            this.logger.warn("The KeeFox data stored in this database is very old so it needs to be upgraded before it will work in Kee."
                + " Please open and save it in an instance of KeePass Password Safe 2 that has the appropriate version of the KeePassRPC.plgx plugin installed.");
            return false;
        }
    }
    getURLSummary(url, getDomain) {
        if (url.indexOf("data:") === 0) {
            return {
                hostAndPort: "",
                port: "",
                domain: null,
                hostname: ""
            };
        }
        let isFile = false;
        const protocolIndex = url.indexOf("://");
        let hostAndPort = "";
        if (url.indexOf("file://") === 0) {
            isFile = true;
            // the "host and port" of a file is the actual file name
            // (i.e. everything except the query string)
            const qsIndex = url.indexOf("?");
            if (qsIndex > -1) {
                hostAndPort = url.substr(7, qsIndex - 7);
            }
            else if (url.length > 7) {
                hostAndPort = url.substr(7);
            }
        }
        else if (protocolIndex > -1) {
            const URLExcludingProt = url.substr(protocolIndex + 3);
            const pathStart = URLExcludingProt.indexOf("/", 0);
            if (pathStart > -1 && URLExcludingProt.length > pathStart) {
                hostAndPort = url.substr(protocolIndex + 3, pathStart);
            }
            else if (pathStart === -1) {
                // it's already just a hostname and optional port
                hostAndPort = URLExcludingProt;
            }
        }
        else {
            // we haven't received a protocol
            const URLExcludingProt = url;
            const pathStart = URLExcludingProt.indexOf("/", 0);
            if (pathStart > -1 && URLExcludingProt.length > pathStart) {
                hostAndPort = url.substr(0, pathStart);
            }
            else if (pathStart === -1) {
                // it's already just a hostname and optional port
                hostAndPort = URLExcludingProt;
            }
        }
        let portIndex = -1;
        let domain = null;
        let hostname = null;
        if (!isFile) {
            const ipv6Bracket = hostAndPort.lastIndexOf("]");
            if (ipv6Bracket === hostAndPort.length - 1 && ipv6Bracket > 0) {
                portIndex = -1;
            }
            else {
                portIndex = hostAndPort.lastIndexOf(":");
            }
            // Protect against common malformed URL (Windows file path without file protocol)
            if (portIndex <= 1) {
                portIndex = -1;
            }
            hostname = hostAndPort.substr(0, portIndex > 0 ? portIndex : hostAndPort.length);
            domain = getDomain(hostname); // tld library does its thing here
        }
        return {
            hostAndPort: hostAndPort,
            port: portIndex > 0 && portIndex + 1 < hostAndPort.length ? hostAndPort.substr(portIndex + 1) : "",
            domain: domain,
            hostname: hostname
        };
    }
    // We can't just use the MatchAccuracyMethod found for the entry (in the conf parameter)
    // because the actual MAM to apply may have been modified based upon the specific URL(s) that
    // we're being asked to match against (the URLs shown in the browser rather than those
    // contained within the entry)
    bestMatchAccuracyForAnyURL(e, conf, url, urlSummary, mam, db) {
        let bestMatchSoFar = 0;
        const URLs = [];
        const eURL = this.getField(e, "URL", db);
        if (eURL)
            URLs.push(eURL);
        if (conf.altURLs) {
            URLs.push(...conf.altURLs);
        }
        for (let i = 0; i < URLs.length; i++) {
            const entryURL = URLs[i];
            if (entryURL === url) {
                return 50;
            }
            // If we require very accurate matches, we can skip the more complex assessment below
            if (mam === MatchAccuracyMethod_1.MatchAccuracyMethod.Exact) {
                continue;
            }
            const entryUrlQSStartIndex = entryURL.indexOf("?");
            const urlQSStartIndex = url.indexOf("?");
            const entryUrlExcludingQS = entryURL.substring(0, entryUrlQSStartIndex > 0 ? entryUrlQSStartIndex : entryURL.length);
            const urlExcludingQS = url.substring(0, urlQSStartIndex > 0 ? urlQSStartIndex : url.Length);
            if (entryUrlExcludingQS === urlExcludingQS) {
                return 40;
            }
            // If we've already found a reasonable match, we can skip the rest of the assessment for subsequent URLs
            // apart from the check for matches against a hostname excluding query string
            if (bestMatchSoFar >= 30) {
                continue;
            }
            const entryUrlSummary = this.getURLSummary(entryURL, this.getDomain);
            if (entryUrlSummary.hostAndPort === urlSummary.hostAndPort) {
                bestMatchSoFar = 30;
            }
            // If we need at least a matching hostname and port (equivalent to
            // KeeFox <1.5) we have to skip these last tests
            if (mam === MatchAccuracyMethod_1.MatchAccuracyMethod.Hostname) {
                continue;
            }
            if (bestMatchSoFar < 20 &&
                entryUrlSummary.hostname === urlSummary.hostname) {
                bestMatchSoFar = 20;
            }
            if (bestMatchSoFar < 10 &&
                entryUrlSummary.domain &&
                entryUrlSummary.domain === urlSummary.domain) {
                bestMatchSoFar = 10;
            }
        }
        return bestMatchSoFar;
    }
    matchesAnyBlockedURL(conf, url) {
        // hostname-wide blocks are not natively supported but can be emulated using an appropriate regex
        if (conf.blockedURLs) {
            for (let j = 0; j < conf.blockedURLs.length; j++) {
                const blockedUrl = conf.blockedURLs[j];
                if (blockedUrl.indexOf(url) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
    setField(entry, field, value, allowEmpty) {
        let newValue;
        const currentValue = entry.fields.get(field);
        let different = false;
        if (currentValue instanceof kdbxweb_1.ProtectedValue) {
            newValue = kdbxweb_1.ProtectedValue.fromString(value);
            different = currentValue.getText() !== value;
        }
        else {
            newValue = value;
            different = currentValue !== value;
        }
        if (different) {
            const hasValue = !!value;
            if (hasValue || allowEmpty) {
                entry.fields.set(field, newValue);
            }
            else {
                entry.fields.delete(field);
            }
        }
    }
    getField(entry, field, db, dereference = false) {
        const val = entry.fields.get(field);
        if (!val) {
            return "";
        }
        if (val instanceof kdbxweb_1.ProtectedValue) {
            return dereference ? this.derefValue(val.getText(), entry, db) : val.getText();
        }
        return dereference ? this.derefValue(val.toString(), entry, db) : val.toString();
    }
    derefValue(value, entry, db) {
        return this.Placeholders.processAllReferences(3, value, entry, () => entryGenerator(db.getDefaultGroup()));
    }
    static getEntryConfigV1Only(entryIn) {
        let obj;
        try {
            obj = JSON.parse(entryIn.fields.get("KPRPC JSON").getText());
            return new EntryConfig_1.EntryConfig(obj);
        }
        catch (e) {
            // do nothing
        }
        return null;
    }
    static getEntryConfigV2Only(entryIn) {
        var _a, _b, _c;
        let obj;
        try {
            obj = JSON.parse((_c = (_b = (_a = entryIn.customData) === null || _a === void 0 ? void 0 : _a.get("KPRPC JSON")) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : '');
            return new EntryConfig_1.EntryConfigV2(obj);
        }
        catch (e) {
            // do nothing
        }
        return null;
    }
    static getEntryConfig(entryIn, dbConfig) {
        var _a;
        const configV2 = ModelMasher.getEntryConfigV2Only(entryIn);
        const configV1Converted = configV2 === null || configV2 === void 0 ? void 0 : configV2.convertToV1();
        if (configV1Converted) {
            return configV1Converted;
        }
        return (_a = ModelMasher.getEntryConfigV1Only(entryIn)) !== null && _a !== void 0 ? _a : new EntryConfig_1.EntryConfig({
            version: 1,
            alwaysAutoFill: false,
            neverAutoFill: false,
            alwaysAutoSubmit: false,
            neverAutoSubmit: false,
            priority: 0,
            hide: false,
            blockHostnameOnlyMatch: false,
            blockDomainOnlyMatch: false
        }, dbConfig.defaultMatchAccuracy);
    }
    static setEntryConfig(entry, config) {
        entry.fields.set("KPRPC JSON", kdbxweb_1.ProtectedValue.fromString(JSON.stringify(config)));
        if (config instanceof EntryConfig_1.EntryConfigConverted) {
            entry.setCustomData("KPRPC JSON", JSON.stringify(config.convertToV2(new GuidService_1.GuidService())));
        }
    }
}
exports.default = ModelMasher;
function* entryGenerator(group) {
    for (let i = 0; i < group.entries.length; i++) {
        yield group.entries[i];
    }
    for (let i = 0; i < group.groups.length; i++) {
        yield* entryGenerator(group.groups[i]);
    }
}
class Utilities {
    static FormFieldTypeToHtmlType(fft) {
        if (fft === kfDataModel_1.keeFormFieldType.password)
            return "password";
        if (fft === kfDataModel_1.keeFormFieldType.select)
            return "select-one";
        if (fft === kfDataModel_1.keeFormFieldType.radio)
            return "radio";
        if (fft === kfDataModel_1.keeFormFieldType.checkbox)
            return "checkbox";
        return "text";
    }
    static FormFieldTypeToFieldType(fft) {
        let type = EntryConfig_1.FieldType.Text;
        if (fft === kfDataModel_1.keeFormFieldType.password)
            type = EntryConfig_1.FieldType.Password;
        else if (fft === kfDataModel_1.keeFormFieldType.select)
            type = EntryConfig_1.FieldType.Existing;
        else if (fft === kfDataModel_1.keeFormFieldType.radio)
            type = EntryConfig_1.FieldType.Existing;
        else if (fft === kfDataModel_1.keeFormFieldType.username)
            type = EntryConfig_1.FieldType.Text;
        else if (fft === kfDataModel_1.keeFormFieldType.checkbox)
            type = EntryConfig_1.FieldType.Toggle;
        return type;
    }
    static FieldTypeToDisplay(type, titleCase) {
        let typeD = "Text";
        if (type === EntryConfig_1.FieldType.Password)
            typeD = "Password";
        else if (type === EntryConfig_1.FieldType.Existing)
            typeD = "Existing";
        else if (type === EntryConfig_1.FieldType.Text)
            typeD = "Text";
        else if (type === EntryConfig_1.FieldType.Toggle)
            typeD = "Toggle";
        if (!titleCase)
            return typeD.toLowerCase();
        return typeD;
    }
    static FieldTypeToHtmlType(ft) {
        switch (ft) {
            case EntryConfig_1.FieldType.Password:
                return "password";
            case EntryConfig_1.FieldType.Existing:
                return "radio";
            case EntryConfig_1.FieldType.Toggle:
                return "checkbox";
            default:
                return "text";
        }
    }
    static FieldTypeToFormFieldType(ft) {
        switch (ft) {
            case EntryConfig_1.FieldType.Password:
                return kfDataModel_1.keeFormFieldType.password;
            case EntryConfig_1.FieldType.Existing:
                return kfDataModel_1.keeFormFieldType.radio;
            case EntryConfig_1.FieldType.Toggle:
                return kfDataModel_1.keeFormFieldType.checkbox;
            default:
                return kfDataModel_1.keeFormFieldType.text;
        }
    }
    // Assumes funky Username type has already been determined so all textual stuff is type text by now
    static FormFieldTypeFromHtmlTypeOrFieldType(t, ft) {
        switch (t) {
            case "password":
                return kfDataModel_1.keeFormFieldType.password;
            case "radio":
                return kfDataModel_1.keeFormFieldType.radio;
            case "checkbox":
                return kfDataModel_1.keeFormFieldType.checkbox;
            case "select-one":
                return kfDataModel_1.keeFormFieldType.select;
            default:
                return Utilities.FieldTypeToFormFieldType(ft);
        }
    }
}
exports.Utilities = Utilities;
//# sourceMappingURL=model.js.map