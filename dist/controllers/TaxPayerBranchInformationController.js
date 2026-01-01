"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxPayerBranchInformationController = void 0;
const TaxPayerBranchInformationService_1 = require("../services/TaxPayerBranchInformationService");
class TaxPayerBranchInformationController {
    constructor() {
        this.getAll = async (req, res) => {
            try {
                const result = await this.taxPayerBranchInformationService.getAllTaxPayerBranchInformation(req.context);
                res.status(200).json(result);
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err ?? "Error Occured");
            }
        };
        // get by tin and by bhfId
        this.getByTinAndBybhfId = async (req, res) => {
            try {
                const result = await this.taxPayerBranchInformationService.getTaxPayerBranchInformationByTinBybhfId(req.context);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error ?? "There is an Internal error");
            }
        };
        this.taxPayerBranchInformationService = new TaxPayerBranchInformationService_1.TaxPayerBranchInformationService();
    }
}
exports.TaxPayerBranchInformationController = TaxPayerBranchInformationController;
