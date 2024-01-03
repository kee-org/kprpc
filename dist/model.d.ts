import { KdbxEntry, Kdbx, KdbxGroup } from "kdbxweb";
import { EntryConfig } from "./EntryConfig";
import { DatabaseConfig } from "./DatabaseConfig";
import { MatchAccuracyMethod } from "./MatchAccuracyMethod";
import { URLSummary } from "./URLSummary";
import { Database, KeeEntry, MatchAccuracyEnum, KeeEntrySummary } from "./kfDataModel";
import { KdbxPlaceholders } from "kdbx-placeholders";
declare class DBContext {
    fileName: string;
    active: boolean;
}
declare class ModelMasherConfig {
    complete?: boolean;
    fullDetail?: boolean;
    matchAccuracy?: MatchAccuracyEnum;
    urlRequired?: boolean;
    noDetail?: boolean;
}
export default class ModelMasher {
    private Placeholders;
    private getDomain;
    private logger;
    constructor(Placeholders: KdbxPlaceholders, getDomain: any, logger: any);
    toKeeDatabase(dbIn: Kdbx, dbContext: DBContext, config: ModelMasherConfig): Database;
    toKeeEntry(db: Kdbx, kdbxEntry: KdbxEntry, dbContext: DBContext, config: ModelMasherConfig): KeeEntry | KeeEntrySummary;
    toKeeGroup(db: Kdbx, groupIn?: KdbxGroup): {
        title: string | undefined;
        iconImageData: string;
        uniqueID: string;
        path: string;
    } | undefined;
    fromKeeEntry(db: Kdbx, keeEntry: KeeEntry, kdbxEntry: KdbxEntry, getDomain: any): KdbxEntry;
    getRootPwGroup(dbIn: Kdbx, location?: any): KdbxGroup;
    _getSubGroups(db: Kdbx, groupModel: KdbxGroup, dbContext: DBContext, config: ModelMasherConfig): any;
    getEntryConfig(entryIn: KdbxEntry, dbConfig: DatabaseConfig): EntryConfig;
    setEntryConfig(entry: KdbxEntry, config: EntryConfig): void;
    getMatchAccuracyMethod(entry: KdbxEntry, urlsum: URLSummary, dbConfig: DatabaseConfig): MatchAccuracyMethod;
    getDatabaseKPRPCConfig(db: Kdbx): DatabaseConfig;
    setDatabaseKPRPCConfig(db: Kdbx, newConfig: DatabaseConfig): void;
    getGroupPath(group?: KdbxGroup): string;
    isConfigCorrectVersion(db: Kdbx): boolean;
    getURLSummary(url: string, getDomain: any): URLSummary;
    bestMatchAccuracyForAnyURL(e: KdbxEntry, conf: EntryConfig, url: any, urlSummary: URLSummary, mam: MatchAccuracyMethod, db: Kdbx): number;
    matchesAnyBlockedURL(conf: EntryConfig, url: string): boolean;
    setField(entry: KdbxEntry, field: string, value: string, allowEmpty?: boolean): void;
    getField(entry: KdbxEntry, field: string, db: Kdbx, dereference?: boolean): any;
    derefValue(value: string, entry: KdbxEntry, db: Kdbx): any;
}
export {};
