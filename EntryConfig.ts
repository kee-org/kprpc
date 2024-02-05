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

    public getMatchAccuracyMethod(omitIfDefault: boolean = false) {
        if (this.blockHostnameOnlyMatch) return MatchAccuracyMethod.Exact;
        else if (this.blockDomainOnlyMatch) return MatchAccuracyMethod.Hostname;
        else if (omitIfDefault) return undefined;
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
        else if (this.alwaysAutoFill && this.neverAutoSubmit)
            conf2.behaviour = EntryAutomationBehaviour.AlwaysAutoFillNeverAutoSubmit;
        else if (this.neverAutoSubmit)
            conf2.behaviour = EntryAutomationBehaviour.NeverAutoSubmit;
        else if (this.alwaysAutoFill)
            conf2.behaviour = EntryAutomationBehaviour.AlwaysAutoFill;
        //else default (can be persisted as null)

        conf2.blockedUrls = this.BlockedURLs;
        conf2.httpRealm = this.hTTPRealm || undefined;
        conf2.altUrls = this.altURLs;
        conf2.regExUrls = this.regExURLs;
        conf2.regExBlockedUrls = this.regExBlockedURLs;
        conf2.authenticationMethods = ["password"];
        const mcList: EntryMatcherConfig[] = [
            { matcherType: EntryMatcherType.Url, urlMatchMethod: this.getMatchAccuracyMethod(true) }
        ];
        if (this.hide) {
            mcList.push({ matcherType: EntryMatcherType.Hide });
        }
        conf2.matcherConfigs = mcList;
        conf2.fields = this.convertFields(this.formFieldList ?? [], guidService);

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
                    const mc = !(ff.id || ff.name)
                        ? { matcherType: FieldMatcherType.UsernameDefaultHeuristic }
                        : FieldMatcherConfig.forSingleClientMatch(ff.id, ff.name, kfDm.keeFormFieldType.username);
                    const f: Field = new Field({
                        valuePath: "UserName",
                        page: Math.max(ff.page, 1),
                        uuid: guidService.NewGuid(),
                        type: FieldType.Text,
                        matcherConfigs: [mc]
                    });
                    if (ff.placeholderHandling !== kfDm.PlaceholderHandling.Default) {
                        f.placeholderHandling = ff.placeholderHandling;
                    }
                    fields.push(f);
                } else if (ff.value === "{PASSWORD}") {
                    passwordFound = true;
                    const mc = !(ff.id || ff.name)
                        ? { matcherType: FieldMatcherType.PasswordDefaultHeuristic }
                        : FieldMatcherConfig.forSingleClientMatch(ff.id, ff.name, kfDm.keeFormFieldType.password);
                    const f: Field = new Field({
                        valuePath: "Password",
                        page: Math.max(ff.page, 1),
                        uuid: guidService.NewGuid(),
                        type: FieldType.Password,
                        matcherConfigs: [mc]
                    });
                    if (ff.placeholderHandling !== kfDm.PlaceholderHandling.Default) {
                        f.placeholderHandling = ff.placeholderHandling;
                    }
                    fields.push(f);
                }
                else {
                    const mc = FieldMatcherConfig.forSingleClientMatch(ff.id, ff.name, ff.type);
                    const f: Field = new Field({
                        name: ff.displayName,
                        valuePath: ".",
                        page: Math.max(ff.page, 1),
                        uuid: guidService.NewGuid(),
                        type: Utilities.FormFieldTypeToFieldType(ff.type),
                        matcherConfigs: [mc],
                        value: ff.value
                    });
                    if (ff.placeholderHandling !== kfDm.PlaceholderHandling.Default) {
                        f.placeholderHandling = ff.placeholderHandling;
                    }
                    fields.push(f);
                }
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
    // Override toJSON method
    public toJSON() {
        let { _typeDiscriminator, ...other } = this;
        return other;
    }
}

export enum EntryMatcherType {
    Custom = "Custom",
    Hide = "Hide",
    Url = "Url", // magic type that uses primary URL + the 4 URL data arrays and current urlmatchconfig to determine a match
}

export enum MatchAction { TotalMatch, TotalBlock, WeightedMatch, WeightedBlock }

export enum MatcherLogic { Client = "Client", All = "All", Any = "Any" }

export enum EntryAutomationBehaviour {
    Default,
    NeverAutoFillNeverAutoSubmit,
    NeverAutoSubmit,
    AlwaysAutoFillAlwaysAutoSubmit,
    AlwaysAutoFill,
    AlwaysAutoFillNeverAutoSubmit
}

export enum FieldType { Text = "Text", Password = "Password", Existing = "Existing", Toggle = "Toggle", Otp = "Otp", SomeChars = "SomeChars" }

// For standard KeePass entries with no KPRPC-specific config, we can save storage space (and one day data-exchange bytes) by just recording that the client should use a typical locator to work out which field is the best match, because we have no additional information to help with this task.
// We could extend this to very common additional heuristics in future (e.g. if many sites and entries end up with a custom locator with Id and Name == "password"). That would be pretty complex though so probably won't be worthwhile.
export enum FieldMatcherType {
    Custom = "Custom",
    UsernameDefaultHeuristic = "UsernameDefaultHeuristic",
    PasswordDefaultHeuristic = "PasswordDefaultHeuristic"
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

    public static forSingleClientMatch(id: string, name: string, fft: kfDm.keeFormFieldType): FieldMatcherConfig {
        var htmlType = Utilities.FormFieldTypeToHtmlType(fft);
        return FieldMatcherConfig.forSingleClientMatchHtmlType(id, name, htmlType);
    }

    public static forSingleClientMatchHtmlType(id: string, name: string, htmlType: string, domSelector?: string): FieldMatcherConfig {
        return new FieldMatcherConfig(
            {
                customMatcher: new FieldMatcher(
                    {
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
    version: number = 2;
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


    public convertToV1(guidService: IGuidService): EntryConfigConverted {
        const conf1: EntryConfigConverted = new EntryConfigConverted();

        conf1.version = 1;
        conf1.hTTPRealm = this.httpRealm || '';
        conf1.formFieldList = this.convertFields(this.fields ?? [], guidService);

        switch (this.behaviour ?? EntryAutomationBehaviour.Default) {
            case EntryAutomationBehaviour.AlwaysAutoFill:
                conf1.alwaysAutoFill = true;
                conf1.neverAutoFill = false;
                conf1.alwaysAutoSubmit = false;
                conf1.neverAutoSubmit = false;
                break;
            case EntryAutomationBehaviour.NeverAutoSubmit:
                conf1.alwaysAutoFill = false;
                conf1.neverAutoFill = false;
                conf1.alwaysAutoSubmit = false;
                conf1.neverAutoSubmit = true;
                break;
            case EntryAutomationBehaviour.AlwaysAutoFillAlwaysAutoSubmit:
                conf1.alwaysAutoFill = true;
                conf1.neverAutoFill = false;
                conf1.alwaysAutoSubmit = true;
                conf1.neverAutoSubmit = false;
                break;
            case EntryAutomationBehaviour.NeverAutoFillNeverAutoSubmit:
                conf1.alwaysAutoFill = false;
                conf1.neverAutoFill = true;
                conf1.alwaysAutoSubmit = false;
                conf1.neverAutoSubmit = true;
                break;
            case EntryAutomationBehaviour.AlwaysAutoFillNeverAutoSubmit:
                conf1.alwaysAutoFill = true;
                conf1.neverAutoFill = false;
                conf1.alwaysAutoSubmit = false;
                conf1.neverAutoSubmit = true;
                break;
            case EntryAutomationBehaviour.Default:
                conf1.alwaysAutoFill = false;
                conf1.neverAutoFill = false;
                conf1.alwaysAutoSubmit = false;
                conf1.neverAutoSubmit = false;
                break;
        }

        conf1.priority = 0;

        conf1.BlockedURLs = this.blockedUrls;
        conf1.altURLs = this.altUrls;
        conf1.regExURLs = this.regExUrls;
        conf1.regExBlockedURLs = this.regExBlockedUrls;

        conf1.hide = this.matcherConfigs.some(mc => mc.matcherType == EntryMatcherType.Hide);

        const urlMatcher = this.matcherConfigs.find(mc => mc.matcherType == EntryMatcherType.Url);
        conf1.setMatchAccuracyMethod(urlMatcher?.urlMatchMethod ?? MatchAccuracyMethod.Domain);


        return conf1;
    }

    public convertFields(fields: Field[], guidService: IGuidService): kfDm.KeeLoginFieldInternal[] {
        const formFieldList: kfDm.KeeLoginFieldInternal[] = [];

        for (let ff of fields) {

            let displayName = ff.name;
            let ffValue = ff.value;
            let htmlName = "";
            let htmlId = "";
            let htmlType = Utilities.FieldTypeToFormFieldType(ff.type);

            // Currently we can only have one custommatcher. If that changes and someone tries
            // to use this old version with a newer DB things will break so they will have to
            // upgrade again to fix it.
            let customMatcherConfig = ff.matcherConfigs.find(mc => mc.customMatcher != null);
            if (customMatcherConfig != null) {
                htmlName = customMatcherConfig.customMatcher?.names?.[0] ?? "";

                htmlId = customMatcherConfig.customMatcher?.ids?.[0] ?? "";

                if (customMatcherConfig.customMatcher?.types != null) {
                    htmlType = Utilities.FormFieldTypeFromHtmlTypeOrFieldType(
                        customMatcherConfig.customMatcher.types[0] ?? "", ff.type);
                }
            }

            if (ff.type == FieldType.Password && ff.valuePath == "Password") {
                displayName = "KeePass password";
                htmlType = kfDm.keeFormFieldType.password;
                ffValue = "{PASSWORD}";
            }
            else if (ff.type == FieldType.Text && ff.valuePath == "UserName") {
                displayName = "KeePass username";
                htmlType = kfDm.keeFormFieldType.username;
                ffValue = "{USERNAME}";
            }

            if (ffValue !== "") {
                formFieldList.push(new kfDm.KeeLoginFieldInternal({
                    name: htmlName,
                    displayName: displayName,
                    value: ffValue,
                    type: htmlType,
                    id: htmlId,
                    page: ff.page,
                    placeholderHandling: ff.placeholderHandling ?? kfDm.PlaceholderHandling.Default,
                }));
            }
        }

        return formFieldList;
    }

}
