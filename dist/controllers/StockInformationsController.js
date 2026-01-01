"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockInformationsController = void 0;
const SaveStockInOutService_1 = require("../services/SaveStockInOutService");
const ListStockMovementService_1 = require("../services/ListStockMovementService");
class StockInformationsController {
    constructor() {
        this.saveStockInOut = async (req, res) => {
            try {
                const data = req.body;
                const result = await this.saveStockInOutService.saveStockInOut(data, req.context);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: error ?? "Internal Server Error" });
            }
        };
        // save stock master
        this.saveStockMaster = async (req, res) => {
            try {
                const data = req.body;
                const result = await this.saveStockInOutService.saveStockMaster(data, req.context);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ error: error ?? "Internal Server Error" });
            }
        };
        // list stock movements
        this.listStockMovements = async (req, res) => {
            try {
                const end_date = req.query.end_date;
                const start_date = req.query.start_date;
                const result = await this.listStockMovementService.fetchStockMovement(req.context, start_date, end_date);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ error: error ?? "Internal Server Error" });
            }
        };
        this.saveStockInOutService = new SaveStockInOutService_1.SaveStockInOutService();
        this.listStockMovementService = new ListStockMovementService_1.ListStockMovementService();
    }
}
exports.StockInformationsController = StockInformationsController;
