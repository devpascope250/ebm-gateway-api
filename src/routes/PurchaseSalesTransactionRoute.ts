import { Router } from "express";
import { PurchaseSaleTransactionController } from "../controllers/PurchaseSaleTransactionController";
const router = Router();
router.get('/selectTrnsPurchaseSales', new PurchaseSaleTransactionController().saveSyncPurchaseSalesTransaction);
router.post('/savePurchases', new PurchaseSaleTransactionController().savePurchaseSalesTransaction);

export default router;