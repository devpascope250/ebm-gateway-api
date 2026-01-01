"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesTransactionController = void 0;
const SalesTransactionService_1 = require("../services/SalesTransactionService");
let counter = 0;
class SalesTransactionController {
    constructor() {
        this.saleTransactionService = new SalesTransactionService_1.SalesTransactionService();
        this.saveSales = async (req, res) => {
            try {
                const result = await this.saleTransactionService.saveSalesTransaction(req.body.salesTransaction, req.body.allInvo, req.context);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        };
        this.generateTransactionsInvoice = async (req, res) => {
            try {
                const { currentInv, allInvo, type, rfdRsnCd, freshInv } = req.body;
                if ((type === "NR" || type === "TR") && !rfdRsnCd) {
                    throw {
                        status: 400,
                        message: "rfdRsnCd(Refund Reason Code) is required for type NR and TR"
                    };
                }
                const result = await this.saleTransactionService.generateTransactionInvoice(req.context, currentInv, allInvo, type, rfdRsnCd, freshInv);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        };
        this.findAllSalesReport = async (req, res) => {
            try {
                const startDate = req.query.startDate;
                const endDate = req.query.endDate;
                const response = await this.saleTransactionService.findAllSalesReport(req.context, startDate, endDate);
                res.status(200).json(response);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        };
        // get Latest invoidId
        this.findLatestInvoiceId = async (req, res) => {
            try {
                const response = await this.saleTransactionService.findLatestInvoiceId(req.context);
                res.status(200).json(response);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        };
        this.findLatestSalesTransactionId = async (req, res) => {
            try {
                const response = await this.saleTransactionService.findLatestSalesTransactionId(req.context);
                res.status(200).json(response);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        };
    }
}
exports.SalesTransactionController = SalesTransactionController;
