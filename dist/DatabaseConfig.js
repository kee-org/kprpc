"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = void 0;
const MatchAccuracyMethod_1 = require("./MatchAccuracyMethod");
const kfDataModel_1 = require("./kfDataModel");
const Hex_1 = require("./Hex");
class DatabaseConfig {
    constructor() {
        this.version = 3;
        this.defaultMatchAccuracy = MatchAccuracyMethod_1.MatchAccuracyMethod.Domain;
        this.matchedURLAccuracyOverrides = {};
        this.defaultPlaceholderHandling = kfDataModel_1.PlaceholderHandling.Disabled;
    }
    static fromJSON(json) {
        const conf = JSON.parse(json);
        if (conf.rootUUID) {
            conf.rootUUID = (0, Hex_1.hex2base64)(conf.rootUUID);
        }
        return conf;
    }
    toJSON() {
        const conf = Object.assign({}, this);
        if (conf.rootUUID) {
            conf.rootUUID = (0, Hex_1.base642hex)(conf.rootUUID);
        }
        const json = JSON.stringify(conf);
        return json;
    }
}
exports.DatabaseConfig = DatabaseConfig;
//# sourceMappingURL=DatabaseConfig.js.map