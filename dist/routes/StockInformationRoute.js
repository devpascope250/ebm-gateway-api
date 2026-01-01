"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StockInformationsController_1 = require("../controllers/StockInformationsController");
const router = (0, express_1.Router)();
router.post('/saveStockItems', new StockInformationsController_1.StockInformationsController().saveStockInOut);
router.post('/saveStockMaster', new StockInformationsController_1.StockInformationsController().saveStockMaster);
router.get('/selectStockItems', new StockInformationsController_1.StockInformationsController().listStockMovements);
exports.default = router;
