"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveCustomerBranchController = void 0;
const SaveCustomerBranchService_1 = require("../services/SaveCustomerBranchService");
class SaveCustomerBranchController {
    constructor() {
        this.saveCustomerBranch = async (req, res) => {
            try {
                const result = await this.saveCustomerService.saveCustomerBranch(req.body);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json(error ?? "Internal Server Error");
            }
        };
        this.saveCustomerService = new SaveCustomerBranchService_1.SaveCustomerBranchService();
    }
}
exports.SaveCustomerBranchController = SaveCustomerBranchController;
