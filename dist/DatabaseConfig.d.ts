import { MatchAccuracyMethod } from "./MatchAccuracyMethod";
import { PlaceholderHandling } from "./kfDataModel";
export declare class DatabaseConfig {
    version: number;
    rootUUID: string;
    defaultMatchAccuracy: MatchAccuracyMethod;
    matchedURLAccuracyOverrides: {
        [url: string]: MatchAccuracyMethod;
    };
    defaultPlaceholderHandling: PlaceholderHandling;
    constructor();
    static fromJSON(json: string): DatabaseConfig;
    toJSON(): string;
}
