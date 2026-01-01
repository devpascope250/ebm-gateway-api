"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveBranchUserAccountService = void 0;
const UrlPath_1 = require("../utils/UrlPath");
const ApiServices_1 = require("./ApiServices");
class SaveBranchUserAccountService extends ApiServices_1.ApiServices {
    async saveBranchUserAccount(data) {
        return await this.fetch(UrlPath_1.UrlPath.SAVE_BRANCH_USER, "POST", data);
    }
}
exports.SaveBranchUserAccountService = SaveBranchUserAccountService;
