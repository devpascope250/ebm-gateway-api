import { Router } from "express";
import { SalesTransactionController } from "../controllers/SalesTransactionController";
const router = Router();
router.post('/saveSales', new SalesTransactionController().saveSales);
router.post('/generate-transaction-invoice', new SalesTransactionController().generateTransactionsInvoice);
router.get('/generate-sales-report', new SalesTransactionController().findAllSalesReport);
router.get('/get-latest-invoice-id', new SalesTransactionController().findLatestInvoiceId);
router.get('/get-latest-sales-transaction-id', new SalesTransactionController().findLatestSalesTransactionId);

export default router;