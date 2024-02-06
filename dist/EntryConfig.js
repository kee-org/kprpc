"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryConfigV2 = exports.Field = exports.EntryMatcherConfig = exports.EntryMatcher = exports.FieldMatcherConfig = exports.FieldMatcher = exports.FieldMatcherType = exports.FieldType = exports.EntryAutomationBehaviour = exports.MatcherLogic = exports.MatchAction = exports.EntryMatcherType = exports.EntryConfigConverted = exports.EntryConfig = void 0;
const MatchAccuracyMethod_1 = require("./MatchAccuracyMethod");
const kfDm = __importStar(require("./kfDataModel"));
const model_1 = require("./model");
class EntryConfig {
    constructor(init, mam) {
        Object.assign(this, init);
        if (mam !== undefined)
            this.setMatchAccuracyMethod(mam);
    }
    getMatchAccuracyMethod(omitIfDefault = false) {
        if (this.blockHostnameOnlyMatch)
            return MatchAccuracyMethod_1.MatchAccuracyMethod.Exact;
        else if (this.blockDomainOnlyMatch)
            return MatchAccuracyMethod_1.MatchAccuracyMethod.Hostname;
        else if (omitIfDefault)
            return undefined;
        else
            return MatchAccuracyMethod_1.MatchAccuracyMethod.Domain;
    }
    setMatchAccuracyMethod(mam) {
        if (mam === MatchAccuracyMethod_1.MatchAccuracyMethod.Domain) {
            this.blockDomainOnlyMatch = false;
            this.blockHostnameOnlyMatch = false;
        }
        else if (mam === MatchAccuracyMethod_1.MatchAccuracyMethod.Hostname) {
            this.blockDomainOnlyMatch = true;
            this.blockHostnameOnlyMatch = false;
        }
        else {
            this.blockDomainOnlyMatch = false;
            this.blockHostnameOnlyMatch = true;
        }
    }
    convertToV2(guidService) {
        var _a;
        const conf2 = new EntryConfigV2();
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
        const mcList = [
            { matcherType: EntryMatcherType.Url, urlMatchMethod: this.getMatchAccuracyMethod(true) }
        ];
        if (this.hide) {
            mcList.push({ matcherType: EntryMatcherType.Hide });
        }
        conf2.matcherConfigs = mcList;
        conf2.fields = this.convertFields((_a = this.formFieldList) !== null && _a !== void 0 ? _a : [], guidService);
        return conf2;
    }
    convertFields(formFieldList, guidService) {
        const fields = [];
        let usernameFound = false;
        let passwordFound = false;
        if (formFieldList) {
            formFieldList.forEach(ff => {
                if (ff.value === "{USERNAME}") {
                    usernameFound = true;
                    const mc = !(ff.id || ff.name)
                        ? { matcherType: FieldMatcherType.UsernameDefaultHeuristic }
                        : FieldMatcherConfig.forSingleClientMatch(ff.id, ff.name, kfDm.keeFormFieldType.username);
                    const f = new Field({
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
                }
                else if (ff.value === "{PASSWORD}") {
                    passwordFound = true;
                    const mc = !(ff.id || ff.name)
                        ? { matcherType: FieldMatcherType.PasswordDefaultHeuristic }
                        : FieldMatcherConfig.forSingleClientMatch(ff.id, ff.name, kfDm.keeFormFieldType.password);
                    const f = new Field({
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
                    const f = new Field({
                        name: ff.displayName,
                        valuePath: ".",
                        page: Math.max(ff.page, 1),
                        uuid: guidService.NewGuid(),
                        type: model_1.Utilities.FormFieldTypeToFieldType(ff.type),
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
exports.EntryConfig = EntryConfig;
class EntryConfigConverted extends EntryConfig {
    constructor(init, mam) {
        super(init, mam);
        // @ts-ignore
        this._typeDiscriminator = true;
    }
    // Override toJSON method
    toJSON() {
        let _a = this, { _typeDiscriminator } = _a, other = __rest(_a, ["_typeDiscriminator"]);
        return other;
    }
}
exports.EntryConfigConverted = EntryConfigConverted;
var EntryMatcherType;
(function (EntryMatcherType) {
    EntryMatcherType["Custom"] = "Custom";
    EntryMatcherType["Hide"] = "Hide";
    EntryMatcherType["Url"] = "Url";
})(EntryMatcherType || (exports.EntryMatcherType = EntryMatcherType = {}));
var MatchAction;
(function (MatchAction) {
    MatchAction[MatchAction["TotalMatch"] = 0] = "TotalMatch";
    MatchAction[MatchAction["TotalBlock"] = 1] = "TotalBlock";
    MatchAction[MatchAction["WeightedMatch"] = 2] = "WeightedMatch";
    MatchAction[MatchAction["WeightedBlock"] = 3] = "WeightedBlock";
})(MatchAction || (exports.MatchAction = MatchAction = {}));
var MatcherLogic;
(function (MatcherLogic) {
    MatcherLogic["Client"] = "Client";
    MatcherLogic["All"] = "All";
    MatcherLogic["Any"] = "Any";
})(MatcherLogic || (exports.MatcherLogic = MatcherLogic = {}));
var EntryAutomationBehaviour;
(function (EntryAutomationBehaviour) {
    EntryAutomationBehaviour[EntryAutomationBehaviour["Default"] = 0] = "Default";
    EntryAutomationBehaviour[EntryAutomationBehaviour["NeverAutoFillNeverAutoSubmit"] = 1] = "NeverAutoFillNeverAutoSubmit";
    EntryAutomationBehaviour[EntryAutomationBehaviour["NeverAutoSubmit"] = 2] = "NeverAutoSubmit";
    EntryAutomationBehaviour[EntryAutomationBehaviour["AlwaysAutoFillAlwaysAutoSubmit"] = 3] = "AlwaysAutoFillAlwaysAutoSubmit";
    EntryAutomationBehaviour[EntryAutomationBehaviour["AlwaysAutoFill"] = 4] = "AlwaysAutoFill";
    EntryAutomationBehaviour[EntryAutomationBehaviour["AlwaysAutoFillNeverAutoSubmit"] = 5] = "AlwaysAutoFillNeverAutoSubmit";
})(EntryAutomationBehaviour || (exports.EntryAutomationBehaviour = EntryAutomationBehaviour = {}));
var FieldType;
(function (FieldType) {
    FieldType["Text"] = "Text";
    FieldType["Password"] = "Password";
    FieldType["Existing"] = "Existing";
    FieldType["Toggle"] = "Toggle";
    FieldType["Otp"] = "Otp";
    FieldType["SomeChars"] = "SomeChars";
})(FieldType || (exports.FieldType = FieldType = {}));
// For standard KeePass entries with no KPRPC-specific config, we can save storage space (and one day data-exchange bytes) by just recording that the client should use a typical locator to work out which field is the best match, because we have no additional information to help with this task.
// We could extend this to very common additional heuristics in future (e.g. if many sites and entries end up with a custom locator with Id and Name == "password"). That would be pretty complex though so probably won't be worthwhile.
var FieldMatcherType;
(function (FieldMatcherType) {
    FieldMatcherType["Custom"] = "Custom";
    FieldMatcherType["UsernameDefaultHeuristic"] = "UsernameDefaultHeuristic";
    FieldMatcherType["PasswordDefaultHeuristic"] = "PasswordDefaultHeuristic";
})(FieldMatcherType || (exports.FieldMatcherType = FieldMatcherType = {}));
// How we can locate a field in the client. At least one property must be set.
// An array property matches if any of its items match.
class FieldMatcher {
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.FieldMatcher = FieldMatcher;
class FieldMatcherConfig {
    constructor(init) {
        Object.assign(this, init);
    }
    static forSingleClientMatch(id, name, fft) {
        var htmlType = model_1.Utilities.FormFieldTypeToHtmlType(fft);
        return FieldMatcherConfig.forSingleClientMatchHtmlType(id, name, htmlType);
    }
    static forSingleClientMatchHtmlType(id, name, htmlType, domSelector) {
        return new FieldMatcherConfig({
            customMatcher: new FieldMatcher({
                ids: !id ? [] : [id],
                names: !name ? [] : [name],
                types: !htmlType ? [] : [htmlType],
                queries: !domSelector ? [] : [domSelector],
            })
        });
    }
}
exports.FieldMatcherConfig = FieldMatcherConfig;
class EntryMatcher {
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.EntryMatcher = EntryMatcher;
class EntryMatcherConfig {
    constructor(init) {
        Object.assign(this, init);
    }
}
exports.EntryMatcherConfig = EntryMatcherConfig;
class Field {
    constructor(init) {
        this.page = 1; // Fields with multiple positive page numbers are effectively treated as multiple Entries when Kee assesses potential matches and field candidates to fill. Other clients might use for similar logical grouping purposes.
        Object.assign(this, init);
    }
}
exports.Field = Field;
class EntryConfigV2 {
    constructor(init) {
        this.version = 2;
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
    convertToV1() {
        var _a, _b, _c;
        const conf1 = new EntryConfigConverted();
        conf1.version = 1;
        conf1.hTTPRealm = this.httpRealm || '';
        conf1.formFieldList = this.convertFields((_a = this.fields) !== null && _a !== void 0 ? _a : []);
        switch ((_b = this.behaviour) !== null && _b !== void 0 ? _b : EntryAutomationBehaviour.Default) {
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
        conf1.setMatchAccuracyMethod((_c = urlMatcher === null || urlMatcher === void 0 ? void 0 : urlMatcher.urlMatchMethod) !== null && _c !== void 0 ? _c : MatchAccuracyMethod_1.MatchAccuracyMethod.Domain);
        return conf1;
    }
    convertFields(fields) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const formFieldList = [];
        for (let ff of fields) {
            let displayName = ff.name;
            let ffValue = ff.value;
            let htmlName = "";
            let htmlId = "";
            let htmlType = model_1.Utilities.FieldTypeToFormFieldType(ff.type);
            // Currently we can only have one custommatcher. If that changes and someone tries
            // to use this old version with a newer DB things will break so they will have to
            // upgrade again to fix it.
            let customMatcherConfig = ff.matcherConfigs.find(mc => mc.customMatcher != null);
            if (customMatcherConfig != null) {
                htmlName = (_c = (_b = (_a = customMatcherConfig.customMatcher) === null || _a === void 0 ? void 0 : _a.names) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "";
                htmlId = (_f = (_e = (_d = customMatcherConfig.customMatcher) === null || _d === void 0 ? void 0 : _d.ids) === null || _e === void 0 ? void 0 : _e[0]) !== null && _f !== void 0 ? _f : "";
                if (((_g = customMatcherConfig.customMatcher) === null || _g === void 0 ? void 0 : _g.types) != null) {
                    htmlType = model_1.Utilities.FormFieldTypeFromHtmlTypeOrFieldType((_h = customMatcherConfig.customMatcher.types[0]) !== null && _h !== void 0 ? _h : "", ff.type);
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
                    placeholderHandling: (_j = ff.placeholderHandling) !== null && _j !== void 0 ? _j : kfDm.PlaceholderHandling.Default,
                }));
            }
        }
        return formFieldList;
    }
}
exports.EntryConfigV2 = EntryConfigV2;
//# sourceMappingURL=EntryConfig.js.map