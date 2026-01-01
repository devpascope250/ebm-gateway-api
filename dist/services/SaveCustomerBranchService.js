"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveCustomerBranchService = void 0;
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
class SaveCustomerBranchService extends ApiServices_1.ApiServices {
    async saveCustomerBranch(data) {
        return await this.fetch(UrlPath_1.UrlPath.SAVE_CUSTOMER_BRANCH, "POST", data);
    }
}
exports.SaveCustomerBranchService = SaveCustomerBranchService;
