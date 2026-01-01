"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveBranchUserController = void 0;
const SaveBranchUserAccountService_1 = require("../services/SaveBranchUserAccountService");
class SaveBranchUserController {
    constructor() {
        this.saveBranchUser = async (req, res) => {
            try {
                const result = await this.saveBranchUserAccount.saveBranchUserAccount(req.body);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json(error ?? "Internal Server Error");
            }
        };
        this.saveBranchUserAccount = new SaveBranchUserAccountService_1.SaveBranchUserAccountService();
    }
}
exports.SaveBranchUserController = SaveBranchUserController;
