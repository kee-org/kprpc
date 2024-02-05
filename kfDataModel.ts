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

// This is an indication of the class that Kee Vault expects to be working with
// but is otherwise unused, may get out of sync with reality and will become
// obsolete when Kee Vault is rewritten in TypeScript. Until then, note that
// the fundamental difference between what the KeePassRPC protocol delivers and
// what Kee Vault requires is due to KeeWeb framework's incompatibility with
// the object property name "id"
// tslint:disable-next-line:class-name
export class keeLoginField {

    // The name displayed to the user to help identify this field.
    // Two MAGIC names exist to identify the standard username and
    // password fields - "KeePass username" and "KeePass password"
    displayName: string;

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

export class KeeLoginFieldInternal {

    // The name displayed to the user to help identify this field.
    // Two MAGIC names exist to identify the standard username and
    // password fields - "KeePass username" and "KeePass password"
    displayName: string;

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

    public constructor(init?: Partial<KeeLoginFieldInternal>) {
        Object.assign(this, init);
    }
}

export enum keeFormFieldType {
    radio = "FFTradio",
    username = "FFTusername",
    text = "FFTtext",
    password = "FFTpassword",
    select = "FFTselect",
    checkbox = "FFTcheckbox"
}
