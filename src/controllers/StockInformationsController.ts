import { Response, Request } from "express";
import { SaveStockInOutService } from "../services/SaveStockInOutService";
import { ListStockMovementService } from "../services/ListStockMovementService";

export class StockInformationsController {
    private saveStockInOutService: SaveStockInOutService;
    private listStockMovementService: ListStockMovementService;
    constructor() {
        this.saveStockInOutService = new SaveStockInOutService();
        this.listStockMovementService = new ListStockMovementService();
    }

    saveStockInOut = async (req: Request, res: Response) => {
        try {
            const data = req.body;

            const result = await this.saveStockInOutService.saveStockInOut(data, req.context);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: error ?? "Internal Server Error" });
        }
    }

    // save stock master
    saveStockMaster = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const result = await this.saveStockInOutService.saveStockMaster(data, req.context);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error ?? "Internal Server Error" });
        }
    }

    // list stock movements
    listStockMovements = async (req: Request, res: Response) => {
        try {
            const end_date = req.query.end_date as string;
            const start_date = req.query.start_date as string;
            const result = await this.listStockMovementService.fetchStockMovement(req.context, start_date, end_date);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error ?? "Internal Server Error" });
        }
    }

    // list stock master

    listStockMaster = async (req: Request, res: Response) => {
        try {
            const result = await this.saveStockInOutService.findAllStockMasters(req.context);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error ?? "Internal Server Error" });
        }
    }

}