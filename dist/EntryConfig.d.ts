import { IGuidService } from "./GuidService";
import { MatchAccuracyMethod } from "./MatchAccuracyMethod";
import * as kfDm from "./kfDataModel";
export declare class EntryConfig {
    version: number;
    alwaysAutoFill: boolean;
    neverAutoFill: boolean;
    alwaysAutoSubmit: boolean;
    neverAutoSubmit: boolean;
    priority: number;
    hide: boolean;
    blockHostnameOnlyMatch: boolean;
    blockDomainOnlyMatch: boolean;
    formFieldList?: kfDm.KeeLoginFieldInternal[];
    altURLs?: string[];
    regExURLs?: string[];
    regExBlockedURLs?: string[];
    BlockedURLs?: string[];
    blockedURLs?: string[];
    hTTPRealm?: string;
    constructor(init?: Partial<EntryConfig>, mam?: MatchAccuracyMethod);
    getMatchAccuracyMethod(omitIfDefault?: boolean): MatchAccuracyMethod | undefined;
    setMatchAccuracyMethod(mam: MatchAccuracyMethod): void;
    convertToV2(guidService: IGuidService): EntryConfigV2;
    convertFields(formFieldList: kfDm.KeeLoginFieldInternal[], guidService: IGuidService): Field[];
}
export declare class EntryConfigConverted extends EntryConfig {
    private _typeDiscriminator;
    constructor(init?: Partial<EntryConfigConverted>, mam?: MatchAccuracyMethod);
    toJSON(): Omit<this, "getMatchAccuracyMethod" | "setMatchAccuracyMethod" | "convertToV2" | "convertFields" | "toJSON" | "_typeDiscriminator">;
}
export declare enum EntryMatcherType {
    Custom = "Custom",
    Hide = "Hide",
    Url = "Url"
}
export declare enum MatchAction {
    TotalMatch = 0,
    TotalBlock = 1,
    WeightedMatch = 2,
    WeightedBlock = 3
}
export declare enum MatcherLogic {
    Client = "Client",
    All = "All",
    Any = "Any"
}
export declare enum EntryAutomationBehaviour {
    Default = 0,
    NeverAutoFillNeverAutoSubmit = 1,
    NeverAutoSubmit = 2,
    AlwaysAutoFillAlwaysAutoSubmit = 3,
    AlwaysAutoFill = 4,
    AlwaysAutoFillNeverAutoSubmit = 5
}
export declare enum FieldType {
    Text = "Text",
    Password = "Password",
    Existing = "Existing",
    Toggle = "Toggle",
    Otp = "Otp",
    SomeChars = "SomeChars"
}
export declare enum FieldMatcherType {
    Custom = "Custom",
    UsernameDefaultHeuristic = "UsernameDefaultHeuristic",
    PasswordDefaultHeuristic = "PasswordDefaultHeuristic"
}
export declare class FieldMatcher {
    matchLogic?: MatcherLogic;
    ids: string[];
    names: string[];
    types: string[];
    queries: string[];
    labels: string[];
    autocompleteValues: string[];
    maxLength?: number;
    minLength?: number;
    constructor(init?: Partial<FieldMatcher>);
}
export declare class FieldMatcherConfig {
    matcherType?: FieldMatcherType;
    customMatcher?: FieldMatcher;
    weight?: number;
    actionOnMatch?: MatchAction;
    constructor(init?: Partial<FieldMatcherConfig>);
    static forSingleClientMatch(id: string, name: string, fft: kfDm.keeFormFieldType): FieldMatcherConfig;
    static forSingleClientMatchHtmlType(id: string, name: string, htmlType: string, domSelector?: string): FieldMatcherConfig;
}
export declare class EntryMatcher {
    matchLogic?: MatcherLogic;
    queries: string[];
    pageTitles: string[];
    constructor(init?: Partial<EntryMatcher>);
}
export declare class EntryMatcherConfig {
    matcherType?: EntryMatcherType;
    customMatcher?: EntryMatcher;
    urlMatchMethod?: MatchAccuracyMethod;
    weight?: number;
    actionOnMatch?: MatchAction;
    actionOnNoMatch?: MatchAction;
    constructor(init?: Partial<EntryMatcherConfig>);
}
export declare class Field {
    uuid: string;
    name: string;
    valuePath: string;
    value: string;
    page: number;
    type: FieldType;
    placeholderHandling?: kfDm.PlaceholderHandling;
    matcherConfigs: FieldMatcherConfig[];
    constructor(init?: Partial<Field>);
}
export declare class EntryConfigV2 {
    version: number;
    altUrls?: string[];
    regExUrls?: string[];
    regExBlockedUrls?: string[];
    blockedUrls?: string[];
    httpRealm?: string;
    authenticationMethods?: string[];
    behaviour?: EntryAutomationBehaviour;
    matcherConfigs: EntryMatcherConfig[];
    fields?: Field[];
    constructor(init?: Partial<EntryConfigV2>);
    convertToV1(): EntryConfigConverted;
    convertFields(fields: Field[]): kfDm.KeeLoginFieldInternal[];
}
