"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keeFormFieldType = exports.KeeLoginFieldInternal = exports.keeLoginField = exports.KeeEntrySummary = exports.KeeEntry = exports.MatchAccuracyEnum = exports.PlaceholderHandling = exports.Database = exports.PasswordProfile = exports.SessionType = void 0;
var SessionType;
(function (SessionType) {
    SessionType["Event"] = "event";
    SessionType["Websocket"] = "websocket";
})(SessionType || (exports.SessionType = SessionType = {}));
class PasswordProfile {
}
exports.PasswordProfile = PasswordProfile;
class Database {
}
exports.Database = Database;
var PlaceholderHandling;
(function (PlaceholderHandling) {
    PlaceholderHandling["Default"] = "Default";
    PlaceholderHandling["Enabled"] = "Enabled";
    PlaceholderHandling["Disabled"] = "Disabled";
})(PlaceholderHandling || (exports.PlaceholderHandling = PlaceholderHandling = {}));
var MatchAccuracyEnum;
(function (MatchAccuracyEnum) {
    // Best = Non-URL match (i.e. we matched by UUID instead)
    // Best = Regex match (it is impossible for us to infer how
    // accurate a regex match is in comparison with other classes
    // of match so we always treat it as the best possible match
    // even if the regex itself is very loose)
    // Best = Same URL including query string
    // Close = Same URL excluding query string
    // HostnameAndPort = Same hostname and port
    // Hostname = Same hostname (domain + subdomains)
    // Domain = Same domain
    // None = No match (e.g. when we are being asked to return all entries)
    MatchAccuracyEnum[MatchAccuracyEnum["Best"] = 50] = "Best";
    MatchAccuracyEnum[MatchAccuracyEnum["Close"] = 40] = "Close";
    MatchAccuracyEnum[MatchAccuracyEnum["HostnameAndPort"] = 30] = "HostnameAndPort";
    MatchAccuracyEnum[MatchAccuracyEnum["Hostname"] = 20] = "Hostname";
    MatchAccuracyEnum[MatchAccuracyEnum["Domain"] = 10] = "Domain";
    MatchAccuracyEnum[MatchAccuracyEnum["None"] = 0] = "None";
})(MatchAccuracyEnum || (exports.MatchAccuracyEnum = MatchAccuracyEnum = {}));
class KeeEntry {
}
exports.KeeEntry = KeeEntry;
class KeeEntrySummary {
}
exports.KeeEntrySummary = KeeEntrySummary;
// This is an indication of the class that Kee Vault expects to be working with
// but is otherwise unused, may get out of sync with reality and will become
// obsolete when Kee Vault is rewritten in TypeScript. Until then, note that
// the fundamental difference between what the KeePassRPC protocol delivers and
// what Kee Vault requires is due to KeeWeb framework's incompatibility with
// the object property name "id"
// tslint:disable-next-line:class-name
class keeLoginField {
}
exports.keeLoginField = keeLoginField;
class KeeLoginFieldInternal {
}
exports.KeeLoginFieldInternal = KeeLoginFieldInternal;
var keeFormFieldType;
(function (keeFormFieldType) {
    keeFormFieldType["radio"] = "FFTradio";
    keeFormFieldType["username"] = "FFTusername";
    keeFormFieldType["text"] = "FFTtext";
    keeFormFieldType["password"] = "FFTpassword";
    keeFormFieldType["select"] = "FFTselect";
    keeFormFieldType["checkbox"] = "FFTcheckbox";
})(keeFormFieldType || (exports.keeFormFieldType = keeFormFieldType = {}));
//# sourceMappingURL=kfDataModel.js.map