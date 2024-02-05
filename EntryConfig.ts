import { IGuidService } from "./GuidService";
import { MatchAccuracyMethod } from "./MatchAccuracyMethod";
import * as kfDm from "./kfDataModel";
import { Utilities } from "./model";

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
    formFieldList?: kfDm.KeeLoginFieldInternal[];
    altURLs?: string[];
    regExURLs?: string[];
    regExBlockedURLs?: string[];
    BlockedURLs?: string[];
    hTTPRealm?: string;

    public constructor(init?: Partial<EntryConfig>, mam?: MatchAccuracyMethod) {
        Object.assign(this, init);
        if (mam !== undefined) this.setMatchAccuracyMethod(mam);
    }

    public getMatchAccuracyMethod() {
        if (this.blockHostnameOnlyMatch) return MatchAccuracyMethod.Exact;
        else if (this.blockDomainOnlyMatch) return MatchAccuracyMethod.Hostname;
        else return MatchAccuracyMethod.Domain;
    }

    public setMatchAccuracyMethod(mam: MatchAccuracyMethod) {
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

    public convertToV2(guidService: IGuidService): EntryConfigV2 {
        const conf2: EntryConfigV2 = new EntryConfigV2();

        if (this.neverAutoFill)
            conf2.behaviour = EntryAutomationBehaviour.NeverAutoFillNeverAutoSubmit;
        else if (this.alwaysAutoSubmit)
            conf2.behaviour = EntryAutomationBehaviour.AlwaysAutoFillAlwaysAutoSubmit;
        //TODO:  ... (rest of the if-else conditions)

        conf2.blockedUrls = this.BlockedURLs;
        conf2.httpRealm = this.hTTPRealm;
        conf2.altUrls = this.altURLs;
        conf2.regExUrls = this.regExURLs;
        conf2.regExBlockedUrls = this.regExBlockedURLs;
        conf2.authenticationMethods = ["password"];
        conf2.fields = this.convertFields(this.formFieldList ?? [], guidService);
        const mcList: EntryMatcherConfig[] = [
            { matcherType: EntryMatcherType.Url, urlMatchMethod: this.getMatchAccuracyMethod() }
        ];
        if (this.hide) {
            mcList.push({ matcherType: EntryMatcherType.Hide });
        }

        conf2.matcherConfigs = mcList;

        return conf2;
    }

    public convertFields(formFieldList: kfDm.KeeLoginFieldInternal[], guidService: IGuidService): Field[] {
        const fields: Field[] = [];
        let usernameFound = false;
        let passwordFound = false;
        if (formFieldList) {
            formFieldList.forEach(ff => {
                if (ff.value === "{USERNAME}") {
                    usernameFound = true;
                    const mc = ff.id || ff.name
                        ? { matcherType: FieldMatcherType.UsernameDefaultHeuristic }
                        : FieldMatcherConfig.forSingleClientMatch(ff.id, ff.name, ff.type);
                    const f: Field = new Field({
                        page: Math.max(ff.page, 1),
                        valuePath: "UserName",
                        uuid: guidService.NewGuid(),
                        type: FieldType.Text,
                        matcherConfigs: [mc]
                    });
                    //TODO: string enums?
                    if (ff.placeholderHandling !== kfDm.PlaceholderHandling.Default) {
                        f.placeholderHandling = ff.placeholderHandling;
                    }
                    fields.push(f);
                }
                //TODO:  ... (rest of the if-else conditions for password, and default field)
            });
        }

        if (!usernameFound) {
            fields.push(new Field({
                valuePath: "UserName",
                uuid: guidService.NewGuid(),
                type: FieldType.Text,
                matcherConfigs: [{ matcherType: FieldMatcherType.UsernameDefaultHeuristic }]
            }));
        }
        if (!passwordFound) {
            fields.push(new Field({
                valuePath: "Password",
                uuid: guidService.NewGuid(),
                type: FieldType.Password,
                matcherConfigs: [{ matcherType: FieldMatcherType.PasswordDefaultHeuristic }]
            }));
        }

        return fields;
    }

}

export class EntryConfigConverted extends EntryConfig {
    // @ts-ignore
    private _typeDiscriminator = true;
    public constructor(init?: Partial<EntryConfigConverted>, mam?: MatchAccuracyMethod) {
        super(init, mam);
    }
}

export enum EntryMatcherType {
    Custom = 0,
    Hide = 1,
    Url = 2, // magic type that uses primary URL + the 4 URL data arrays and current urlmatchconfig to determine a match
}

export enum MatchAction { TotalMatch, TotalBlock, WeightedMatch, WeightedBlock }

export enum MatcherLogic { Client, All, Any }

export enum EntryAutomationBehaviour {
    Default,
    NeverAutoFillNeverAutoSubmit,
    NeverAutoSubmit,
    AlwaysAutoFillAlwaysAutoSubmit,
    AlwaysAutoFill,
    AlwaysAutoFillNeverAutoSubmit
}

export enum FieldType { Text, Password, Existing, Toggle, Otp, SomeChars }

// For standard KeePass entries with no KPRPC-specific config, we can save storage space (and one day data-exchange bytes) by just recording that the client should use a typical locator to work out which field is the best match, because we have no additional information to help with this task.
// We could extend this to very common additional heuristics in future (e.g. if many sites and entries end up with a custom locator with Id and Name == "password"). That would be pretty complex though so probably won't be worthwhile.
export enum FieldMatcherType {
    Custom = 0,
    UsernameDefaultHeuristic = 1,
    PasswordDefaultHeuristic = 2
}

// How we can locate a field in the client. At least one property must be set.
// An array property matches if any of its items match.
export class FieldMatcher {
    matchLogic?: MatcherLogic; // default to Client initially
    ids: string[]; // HTML id attribute
    names: string[]; // HTML name attribute
    types: string[]; // HTML input type
    queries: string[]; // HTML DOM select query
    labels: string[]; // HTML Label or otherwise visible UI label
    autocompleteValues: string[]; // HTML autocomplete attribute values
    maxLength?: number; // max chars allowed in a candidate field for this to match
    minLength?: number; // min chars allowed in a candidate field for this to match

    public constructor(init?: Partial<FieldMatcher>) {
        Object.assign(this, init);
    }
}

export class FieldMatcherConfig {
    matcherType?: FieldMatcherType;
    customMatcher?: FieldMatcher;
    weight?: number; // 0 = client decides or ignores locator
    actionOnMatch?: MatchAction;

    public constructor(init?: Partial<FieldMatcherConfig>) {
        Object.assign(this, init);
    }

    public static forSingleClientMatch(id: string, name: string, fft: kfDm.keeFormFieldType): FieldMatcherConfig
    {
        var htmlType = Utilities.FormFieldTypeToHtmlType(fft);
        return FieldMatcherConfig.forSingleClientMatchHtmlType(id, name, htmlType);
    }

    public static forSingleClientMatchHtmlType(id: string, name: string, htmlType: string, domSelector?: string): FieldMatcherConfig
    {
        return new FieldMatcherConfig(
        {
            customMatcher: new FieldMatcher(
            {
                matchLogic: MatcherLogic.Client,
                ids: !id ? [] : [id],
                names: !name ? [] : [name],
                types: !htmlType ? [] : [htmlType],
                queries: !domSelector ? [] : [domSelector],
            })
        });
    }
}

export class EntryMatcher {
    matchLogic?: MatcherLogic; // default to Client initially
    queries: string[]; // HTML DOM select query
    pageTitles: string[]; // HTML Page title contains

    public constructor(init?: Partial<EntryMatcher>) {
        Object.assign(this, init);
    }

}

export class EntryMatcherConfig {
    matcherType?: EntryMatcherType;
    customMatcher?: EntryMatcher;
    urlMatchMethod?: MatchAccuracyMethod;
    weight?: number; // 0 = client decides or ignores matcher
    actionOnMatch?: MatchAction;
    actionOnNoMatch?: MatchAction; // critical to use TotalBlock here for Url match type

    public constructor(init?: Partial<EntryMatcherConfig>) {
        Object.assign(this, init);
    }
}

export class Field {
    uuid: string;
    name: string; // display name, not form field name attribute
    valuePath: string; // e.g. "Username" for a KeePass Property or "." for this object
    value: string;
    page: number = 1; // Fields with multiple positive page numbers are effectively treated as multiple Entries when Kee assesses potential matches and field candidates to fill. Other clients might use for similar logical grouping purposes.
    type: FieldType;
    placeholderHandling?: kfDm.PlaceholderHandling;
    matcherConfigs: FieldMatcherConfig[];

    public constructor(init?: Partial<Field>) {
        Object.assign(this, init);
    }
}

export class EntryConfigV2 {
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

    public constructor(init?: Partial<EntryConfigV2>) {
        Object.assign(this, init);
    }

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
