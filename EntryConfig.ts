import { MatchAccuracyMethod } from "./MatchAccuracyMethod";
import { KeeLoginFieldInternal } from "./kfDataModel";

export class EntryConfig {
    version: number;
    alwaysAutoFill: boolean;
    neverAutoFill: boolean;
    alwaysAutoSubmit: boolean;
    neverAutoSubmit: boolean;
    priority: number;
    hide: boolean;
    blockHostnameOnlyMatch: boolean;
    blockDomainOnlyMatch: boolean;
    formFieldList?: KeeLoginFieldInternal[];
    altURLs?: string[];
    regExURLs?: string[];
    regExBlockedURLs?: string[];
    BlockedURLs?: string[];
    hTTPRealm?: string;

    public constructor (init?: Partial<EntryConfig>, mam?: MatchAccuracyMethod) {
        Object.assign(this, init);
        if (mam !== undefined) this.setMatchAccuracyMethod(mam);
    }

    public getMatchAccuracyMethod () {
        if (this.blockHostnameOnlyMatch) return MatchAccuracyMethod.Exact;
        else if (this.blockDomainOnlyMatch) return MatchAccuracyMethod.Hostname;
        else return MatchAccuracyMethod.Domain;
    }

    public setMatchAccuracyMethod (mam: MatchAccuracyMethod) {
        if (mam === MatchAccuracyMethod.Domain) {
            this.blockDomainOnlyMatch = false;
            this.blockHostnameOnlyMatch = false;
        } else if (mam === MatchAccuracyMethod.Hostname) {
            this.blockDomainOnlyMatch = true;
            this.blockHostnameOnlyMatch = false;
        } else {
            this.blockDomainOnlyMatch = false;
            this.blockHostnameOnlyMatch = true;
        }
    }

}

export class EntryConfigConverted extends EntryConfig {
    private _typeDiscriminator = true;
    public constructor (init?: Partial<EntryConfig>, mam?: MatchAccuracyMethod) {
        super(init, mam);
    }
}

export enum EntryMatcherType
{
    Custom = 0,
    Hide = 1,
    Url = 2, // magic type that uses primary URL + the 4 URL data arrays and current urlmatchconfig to determine a match
}

export enum MatchAction { TotalMatch, TotalBlock, WeightedMatch, WeightedBlock }

export enum MatcherLogic { Client, All, Any }

export enum EntryAutomationBehaviour
    {
        Default,
        NeverAutoFillNeverAutoSubmit,
        NeverAutoSubmit,
        AlwaysAutoFillAlwaysAutoSubmit,
        AlwaysAutoFill,
        AlwaysAutoFillNeverAutoSubmit
    }

    export enum FieldType { Text, Password, Existing, Toggle, Otp, SomeChars }

    export enum PlaceholderHandling { Default, Enabled, Disabled }

    // For standard KeePass entries with no KPRPC-specific config, we can save storage space (and one day data-exchange bytes) by just recording that the client should use a typical locator to work out which field is the best match, because we have no additional information to help with this task.
    // We could extend this to very common additional heuristics in future (e.g. if many sites and entries end up with a custom locator with Id and Name == "password"). That would be pretty complex though so probably won't be worthwhile.
    export enum FieldMatcherType
    {
        Custom = 0,
        UsernameDefaultHeuristic = 1,
        PasswordDefaultHeuristic = 2
    }

    // How we can locate a field in the client. At least one property must be set.
    // An array property matches if any of its items match.
    export class FieldMatcher
    {
        public MatcherLogic? MatchLogic; // default to Client initially
        public string[] Ids; // HTML id attribute
        public string[] Names; // HTML name attribute
        public string[] Types; // HTML input type
        public string[] Queries; // HTML DOM select query
        public string[] Labels; // HTML Label or otherwise visible UI label
        public string[] AutocompleteValues; // HTML autocomplete attribute values
        public int? MaxLength; // max chars allowed in a candidate field for this to match
        public int? MinLength; // min chars allowed in a candidate field for this to match
    }

    export class FieldMatcherConfig
    {
        matcherType?: FieldMatcherType;
        customMatcher: FieldMatcher;
        weight?: number; // 0 = client decides or ignores locator
        actionOnMatch?: MatchAction;

        // public static FieldMatcherConfig ForSingleClientMatch(string id, string name, FormFieldType fft)
        // {
        //     var htmlType = Utilities.FormFieldTypeToHtmlType(fft);
        //     return FieldMatcherConfig.ForSingleClientMatch(id, name, htmlType, null);
        // }

        // public static FieldMatcherConfig ForSingleClientMatch(string id, string name, string htmlType, string domSelector)
        // {
        //     return new FieldMatcherConfig()
        //     {
        //         CustomMatcher = new FieldMatcher()
        //         {
        //             MatchLogic = MatcherLogic.Client,
        //             Ids = string.IsNullOrEmpty(id) ? new string[0] : new[] { id },
        //             Names = string.IsNullOrEmpty(name) ? new string[0] : new[] { name },
        //             Types = string.IsNullOrEmpty(htmlType) ? new string[0] : new []{ htmlType },
        //             Queries = string.IsNullOrEmpty(domSelector) ? new string[0] : new []{ domSelector }
        //         }
        //     };
        // }
    }

export class EntryMatcher
    {
        matchLogic?: MatcherLogic; // default to Client initially
        queries: string[]; // HTML DOM select query
        pageTitles: string[]; // HTML Page title contains

    }

export class EntryMatcherConfig
{
    matcherType?: EntryMatcherType;
    customMatcher: EntryMatcher;
    urlMatchMethod?: MatchAccuracyMethod;
    weight?: number; // 0 = client decides or ignores matcher
    actionOnMatch?: MatchAction;
    actionOnNoMatch?: MatchAction; // critical to use TotalBlock here for Url match type
}

export class Field
    {
        uuid: string;
        name: string; // display name, not form field name attribute
        valuePath: string; // e.g. "Username" for a KeePass Property or "." for this object
        value: string;
        page: number = 1; // Fields with multiple positive page numbers are effectively treated as multiple Entries when Kee assesses potential matches and field candidates to fill. Other clients might use for similar logical grouping purposes.
        type: FieldType;
        placeholderHandling?: PlaceholderHandling;
        matcherConfigs: FieldMatcherConfig[];
    }

export class EntryConfigV2 {
    version: number;
    altURLs?: string[];
    regExURLs?: string[];
    regExBlockedURLs?: string[];
    BlockedURLs?: string[];
    hTTPRealm?: string;
    authenticationMethods?: string[];
    behaviour?: EntryAutomationBehaviour;
    matcherConfigs: EntryMatcherConfig[];
    fields?: Field[];

    // public constructor (init?: Partial<EntryConfig>, mam?: MatchAccuracyMethod) {
    //     Object.assign(this, init);
    //     if (mam !== undefined) this.setMatchAccuracyMethod(mam);
    // }

    // public getMatchAccuracyMethod () {
    //     if (this.blockHostnameOnlyMatch) return MatchAccuracyMethod.Exact;
    //     else if (this.blockDomainOnlyMatch) return MatchAccuracyMethod.Hostname;
    //     else return MatchAccuracyMethod.Domain;
    // }

    // public setMatchAccuracyMethod (mam: MatchAccuracyMethod) {
    //     if (mam === MatchAccuracyMethod.Domain) {
    //         this.blockDomainOnlyMatch = false;
    //         this.blockHostnameOnlyMatch = false;
    //     } else if (mam === MatchAccuracyMethod.Hostname) {
    //         this.blockDomainOnlyMatch = true;
    //         this.blockHostnameOnlyMatch = false;
    //     } else {
    //         this.blockDomainOnlyMatch = false;
    //         this.blockHostnameOnlyMatch = true;
    //     }
    // }

}
