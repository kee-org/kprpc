"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryConfig = void 0;
const MatchAccuracyMethod_1 = require("./MatchAccuracyMethod");
class EntryConfig {
    constructor(init, mam) {
        Object.assign(this, init);
        if (mam !== undefined)
            this.setMatchAccuracyMethod(mam);
    }
    getMatchAccuracyMethod() {
        if (this.blockHostnameOnlyMatch)
            return MatchAccuracyMethod_1.MatchAccuracyMethod.Exact;
        else if (this.blockDomainOnlyMatch)
            return MatchAccuracyMethod_1.MatchAccuracyMethod.Hostname;
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
}
exports.EntryConfig = EntryConfig;
//# sourceMappingURL=EntryConfig.js.map