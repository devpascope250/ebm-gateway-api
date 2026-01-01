import { Response, Request } from "express";
import { PurchaseSalesTransactionService } from "../services/PurchaseSalesTransactionService";
import { PurchaseSalesTransactionSaveService } from "../services/PurchaseSalesTransactionSaveService";
import { ResultData } from "../types/data";
import { start } from "repl";
export class PurchaseSaleTransactionController {
    private purchaseSalesTransactionService: PurchaseSalesTransactionService;
    private purchaseSalesTransactionSaveService: PurchaseSalesTransactionSaveService;

    constructor() {
        this.purchaseSalesTransactionService = new PurchaseSalesTransactionService();
        this.purchaseSalesTransactionSaveService = new PurchaseSalesTransactionSaveService();
    }

    saveSyncPurchaseSalesTransaction = async (req: Request, res: Response) => {
        try {
            const payload = req.context;
            const start_date = req.query.start_date as string;
            const end_date = req.query.end_date as string;
            const result = await this.purchaseSalesTransactionService.saveSyncPurchaseSalesTransaction(payload,false, start_date, end_date);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error ?? "Internal Server Error" });
        }
    }
        // save purchase sales transaction

    savePurchaseSalesTransaction = async (req: Request, res: Response) => {  
        try{
       const data = req.body;
       const result = await this.purchaseSalesTransactionSaveService.savePurchaseSalesTransaction(data.data,data.id, req.context);
        res.status(200).json(result);
        
        } catch (error) {
            console.log(error);
            const err = (error as ResultData).resultMsg
            if (err) {
                res.status(500).json(error);
            } else {
                res.status(500).json({ message: err ?? error ?? "Internal Server Error" });
            }
        }
    }
}