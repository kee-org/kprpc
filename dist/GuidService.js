"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuidService = void 0;
const kdbxweb_1 = require("kdbxweb");
class GuidService {
    NewGuid() {
        return kdbxweb_1.KdbxUuid.random().toString();
    }
}
exports.GuidService = GuidService;
//# sourceMappingURL=GuidService.js.map