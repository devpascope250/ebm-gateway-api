"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxPayerInformationController = void 0;
const TaxPayerInformationService_1 = require("../services/TaxPayerInformationService");
class TaxPayerInformationController {
    constructor() {
        // get all TaxPayers
        this.getAllTaxPayers = async (req, res) => {
            try {
                const custmTin = req.headers['x-custmTin'];
                if (!custmTin) {
                    throw new Error("Invalid Customer Tin");
                }
                const instance = new TaxPayerInformationService_1.TaxPayerInformationService(req.context.tin, req.context.bhfId, custmTin);
                const result = await instance.getAllTaxPayers();
                res.status(200).json(result);
            }
            catch (err) {
                res.status(500).json(err ?? "Error Occured");
            }
        };
        // get TaxPayerByTin
        this.getTaxPayerByTin = async (req, res) => {
            try {
                const custmTin = req.headers['x-custmTin'];
                const instance = new TaxPayerInformationService_1.TaxPayerInformationService(req.context.tin, req.context.bhfId, custmTin);
                const result = await instance.findOneByTin();
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json(error ?? "Error Occured");
            }
        };
    }
}
exports.TaxPayerInformationController = TaxPayerInformationController;
