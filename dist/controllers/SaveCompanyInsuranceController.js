"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveCompanyInsuranceController = void 0;
const SaveCompanyInsuranceService_1 = require("../services/SaveCompanyInsuranceService");
class SaveCompanyInsuranceController {
    constructor() {
        this.saveCompanyInsurance = async (req, res) => {
            try {
                const result = await this.saveCompanyInsuranceService.saveCompanyInsurance(req.body);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json(error ?? "Internal Server Error");
            }
        };
        this.saveCompanyInsuranceService = new SaveCompanyInsuranceService_1.SaveCompanyInsuranceService();
    }
}
exports.SaveCompanyInsuranceController = SaveCompanyInsuranceController;
