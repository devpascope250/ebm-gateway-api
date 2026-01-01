"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveCompanyInsuranceService = void 0;
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
class SaveCompanyInsuranceService extends ApiServices_1.ApiServices {
    async saveCompanyInsurance(data) {
        return await this.fetch(UrlPath_1.UrlPath.SAVE_COMPANY_INSURANCE, "POST", data);
    }
}
exports.SaveCompanyInsuranceService = SaveCompanyInsuranceService;
