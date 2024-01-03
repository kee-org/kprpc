import { KeeEntry } from "./kfDataModel";
export default class KPRPC {
    static SIGNAL_OPENED: number;
    static SIGNAL_CLOSED: number;
    static SIGNAL_SAVED: number;
    init(dependencies: any, loggerIn: any, appVersionString: any): void;
    deferIfNeeded(func: any, next: any): Promise<void>;
    executeNow(func: any, next: any): void;
    shutdown(): void;
    LaunchGroupEditor(uuid: any, dbFileName: any): void;
    LaunchLoginEditor(uuid: any, dbFileName: any): void;
    GetCurrentKFConfig(): {
        knownDatabases: any;
    };
    GetApplicationMetadata(): any;
    ChangeDatabase(fileName: any, closeCurrent: any): void;
    GetPasswordProfiles(): any;
    GeneratePassword(profileDisplayName: any, url: any): any;
    AddLogin(login: any, parentUUID: any, dbFileName: any): KeeEntry | import("./kfDataModel").KeeEntrySummary | null;
    UpdateLogin(login: any, oldLoginUUID: any, urlMergeMode: any, dbFileName: any): KeeEntry | import("./kfDataModel").KeeEntrySummary | null;
    GetAllDatabases(fullDetails: any): {
        dbs: any;
        config: any;
    };
    FindLogins(URLs: any, actionURL: any, httpRealm: any, lst: any, requireFullURLMatches: any, uniqueID: any, dbFileName: any, freeTextSearch: any, username: any): any[] | null;
    updateAddonSettings(settings: object, version: number): void;
    notify(signal: any): void;
}
