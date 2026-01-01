"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializaionService = void 0;
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
class InitializaionService extends ApiServices_1.ApiServices {
    async initialize(data) {
        const payload = {
            tin: data.tin,
            bhfId: data.bhfId,
            dvcSrlNo: process.env.EBM_DEVICE_SERIAL_NUMBER || "",
        };
        const result = await this.fetch(UrlPath_1.UrlPath.INITIALIZATION, "POST", payload);
        return result;
    }
}
exports.InitializaionService = InitializaionService;
