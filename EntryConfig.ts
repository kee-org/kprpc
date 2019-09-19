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
