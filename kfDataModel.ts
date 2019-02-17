export enum SessionType {
    Event = "event",
    Websocket = "websocket"
}

export class PasswordProfile {
    name: string;
    sessionType: SessionType;
}

export class Database {
    name: string;
    fileName?: string;
    iconImageData: string;
    root: any;
    active?: boolean;
    sessionType?: SessionType;
}

export enum PlaceholderHandling { Default = "Default", Enabled = "Enabled", Disabled = "Disabled" }

export enum MatchAccuracyEnum {
    // Best = Non-URL match (i.e. we matched by UUID instead)
    // Best = Regex match (it is impossible for us to infer how
    // accurate a regex match is in comparison with other classes
    // of match so we always treat it as the best possible match
    // even if the regex itself is very loose)
    // Best = Same URL including query string

    // Close = Same URL excluding query string

    // HostnameAndPort = Same hostname and port

    // Hostname = Same hostname (domain + subdomains)

    // Domain = Same domain

    // None = No match (e.g. when we are being asked to return all entries)

    Best = 50,
    Close = 40,
    HostnameAndPort = 30,
    Hostname = 20,
    Domain = 10,
    None = 0
}

export class KeeEntry {
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

export class KeeEntrySummary {
    iconImageData: string;
    uRLs: string[];
    uniqueID: string;
    title: string;
    usernameValue: string;
    usernameName: string;
}

// tslint:disable-next-line:class-name
export class keeLoginField {

    // "name" attribute on the HTML form element
    name: string;

    // "value" attribute on the HTML form element
    value: string;

    // "id" attribute on the HTML form element
    fieldId: string;

    // The HTML form element DOM objects - transient (not sent to KeePass)
    DOMInputElement: HTMLInputElement;
    DOMSelectElement: HTMLSelectElement;

    // "type" attribute on the HTML form element
    type: "password" | "text" | "radio" | "select-one" | "checkbox";

    formFieldPage: number;

    placeholderHandling: PlaceholderHandling;
}

// This is a bit of a hack - based off of the old DTO above but used as a bit of a
// transient type definition that won't be complete until we have a much more
// complete implementation of the protocol and clearer interaction with calling code.
export class KeeLoginFieldInternal {

    // "name" attribute on the HTML form element
    name: string;

    // "value" attribute on the HTML form element
    value: string;

    // "id" attribute on the HTML form element
    id: string;

    // The HTML form element DOM objects - transient (not sent to KeePass)
    DOMInputElement: HTMLInputElement;
    DOMSelectElement: HTMLSelectElement;

    // "type" attribute on the HTML form element
    type: keeFormFieldType;

    page: number;

    placeholderHandling: PlaceholderHandling;
}

export enum keeFormFieldType {
    radio = "FFTradio",
    username = "FFTusername",
    text = "FFTtext",
    password = "FFTpassword",
    select = "FFTselect",
    checkbox = "FFTcheckbox"
}
