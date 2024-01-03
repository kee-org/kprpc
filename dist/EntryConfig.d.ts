import { MatchAccuracyMethod } from "./MatchAccuracyMethod";
import { KeeLoginFieldInternal } from "./kfDataModel";
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
    formFieldList?: KeeLoginFieldInternal[];
    altURLs?: string[];
    regExURLs?: string[];
    regExBlockedURLs?: string[];
    BlockedURLs?: string[];
    hTTPRealm?: string;
    constructor(init?: Partial<EntryConfig>, mam?: MatchAccuracyMethod);
    getMatchAccuracyMethod(): MatchAccuracyMethod;
    setMatchAccuracyMethod(mam: MatchAccuracyMethod): void;
}
