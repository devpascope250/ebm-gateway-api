"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PurchaseSaleTransactionController_1 = require("../controllers/PurchaseSaleTransactionController");
const router = (0, express_1.Router)();
router.get('/selectTrnsPurchaseSales', new PurchaseSaleTransactionController_1.PurchaseSaleTransactionController().saveSyncPurchaseSalesTransaction);
router.post('/savePurchases', new PurchaseSaleTransactionController_1.PurchaseSaleTransactionController().savePurchaseSalesTransaction);
exports.default = router;
