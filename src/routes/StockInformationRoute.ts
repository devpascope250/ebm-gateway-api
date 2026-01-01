import { Router } from "express";
import { StockInformationsController } from "../controllers/StockInformationsController";
const router = Router();
router.post('/saveStockItems', new StockInformationsController().saveStockInOut);
router.post('/saveStockMaster', new StockInformationsController().saveStockMaster);
router.get('/selectStockItems', new StockInformationsController().listStockMovements);
router.get('/selectStockMaster', new StockInformationsController().listStockMaster);
export default router;