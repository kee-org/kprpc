import { MatchAccuracyMethod } from "./MatchAccuracyMethod";
import { PlaceholderHandling } from "./kfDataModel";
import { base642hex, hex2base64 } from "./Hex";

export class DatabaseConfig {
    public version: number;
    public rootUUID: string;
    public defaultMatchAccuracy: MatchAccuracyMethod;
    public matchedURLAccuracyOverrides: { [url: string]: MatchAccuracyMethod; };
    public defaultPlaceholderHandling: PlaceholderHandling;

    public constructor () {
        this.version = 3;
        this.defaultMatchAccuracy = MatchAccuracyMethod.Domain;
        this.matchedURLAccuracyOverrides = {};
        this.defaultPlaceholderHandling = PlaceholderHandling.Disabled;
    }

    public static fromJSON (json: string) {
        const conf = JSON.parse(json) as DatabaseConfig;
        if (conf.rootUUID) {
            conf.rootUUID = hex2base64(conf.rootUUID);
        }
        return conf;
    }

    public toJSON () {
        const conf = Object.assign({}, this);
        if (conf.rootUUID) {
            conf.rootUUID = base642hex(conf.rootUUID);
        }
        const json = JSON.stringify(conf);
        return json;
    }
}
