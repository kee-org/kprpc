export declare enum SessionType {
    Event = "event",
    Websocket = "websocket"
}
export declare class PasswordProfile {
    name: string;
    sessionType: SessionType;
}
export declare class Database {
    name: string;
    fileName?: string;
    iconImageData: string;
    root: any;
    active?: boolean;
    sessionType?: SessionType;
}
export declare enum PlaceholderHandling {
    Default = "Default",
    Enabled = "Enabled",
    Disabled = "Disabled"
}
export declare enum MatchAccuracyEnum {
    Best = 50,
    Close = 40,
    HostnameAndPort = 30,
    Hostname = 20,
    Domain = 10,
    None = 0
}
export declare class KeeEntry {
    db: Database;
    parent: any;
    iconImageData: string;
    alwaysAutoFill: boolean;
    alwaysAutoSubmit: boolean;
    neverAutoFill: boolean;
    neverAutoSubmit: boolean;
    priority: number;
    uRLs: string[];
    matchAccuracy: number;
    hTTPRealm: string;
    uniqueID: string;
    title: string;
    formFieldList: KeeLoginFieldInternal[];
}
export declare class KeeEntrySummary {
    iconImageData: string;
    uRLs: string[];
    uniqueID: string;
    title: string;
    usernameValue: string;
    usernameName: string;
}
export declare class keeLoginField {
    displayName: string;
    name: string;
    value: string;
    fieldId: string;
    DOMInputElement: HTMLInputElement;
    DOMSelectElement: HTMLSelectElement;
    type: "password" | "text" | "radio" | "select-one" | "checkbox";
    formFieldPage: number;
    placeholderHandling: PlaceholderHandling;
}
export declare class KeeLoginFieldInternal {
    displayName: string;
    name: string;
    value: string;
    id: string;
    DOMInputElement: HTMLInputElement;
    DOMSelectElement: HTMLSelectElement;
    type: keeFormFieldType;
    page: number;
    placeholderHandling: PlaceholderHandling;
}
export declare enum keeFormFieldType {
    radio = "FFTradio",
    username = "FFTusername",
    text = "FFTtext",
    password = "FFTpassword",
    select = "FFTselect",
    checkbox = "FFTcheckbox"
}
