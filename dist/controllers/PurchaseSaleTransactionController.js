"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseSaleTransactionController = void 0;
const PurchaseSalesTransactionService_1 = require("../services/PurchaseSalesTransactionService");
const PurchaseSalesTransactionSaveService_1 = require("../services/PurchaseSalesTransactionSaveService");
class PurchaseSaleTransactionController {
    constructor() {
        this.saveSyncPurchaseSalesTransaction = async (req, res) => {
            try {
                const payload = req.context;
                const result = await this.purchaseSalesTransactionService.saveSyncPurchaseSalesTransaction(payload);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ error: error ?? "Internal Server Error" });
            }
        };
        // save purchase sales transaction
        this.savePurchaseSalesTransaction = async (req, res) => {
            try {
                const data = req.body;
                const result = await this.purchaseSalesTransactionSaveService.savePurchaseSalesTransaction(data.data, data.id, req.context);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                const err = error.resultMsg;
                if (err) {
                    res.status(500).json(error);
                }
                else {
                    res.status(500).json({ message: err ?? error ?? "Internal Server Error" });
                }
            }
        };
        this.purchaseSalesTransactionService = new PurchaseSalesTransactionService_1.PurchaseSalesTransactionService();
        this.purchaseSalesTransactionSaveService = new PurchaseSalesTransactionSaveService_1.PurchaseSalesTransactionSaveService();
    }
}
exports.PurchaseSaleTransactionController = PurchaseSaleTransactionController;
