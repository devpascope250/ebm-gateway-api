import { SalesTransactionService } from "../services/SalesTransactionService";
import { Response, Request } from "express";
let counter = 0;
export class SalesTransactionController {
    private saleTransactionService = new SalesTransactionService();

    saveSales = async (req: Request, res: Response) => {
        try {
            const result = await this.saleTransactionService.saveSalesTransaction(req.body.salesTransaction, req.body.allInvo, req.context);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);

            res.status(500).json(error);
        }
    }

    generateTransactionsInvoice = async (req: Request, res: Response) => {
        try {
            const { currentInv, allInvo, type, rfdRsnCd, freshInv, custData } = req.body;
            if ((type === "NR" || type === "TR") && !rfdRsnCd) {
                throw {
                    status: 400,
                    message: "rfdRsnCd(Refund Reason Code) is required for type NR and TR"
                }
            }
            const increment = req.body.increment;
            const result = await this.saleTransactionService.generateTransactionInvoice(req.context, currentInv, allInvo, type, rfdRsnCd, freshInv, custData, increment);
            res.status(200).json(result);
        } catch (error) {
            // console.log(error);

            res.status(500).json(error);
        }
    }

    findAllSalesReport = async (req: Request, res: Response) => {
        try {
            const startDate = req.query.startDate as string;
            const endDate = req.query.endDate as string;
            const reportType = req.query.reportType as any;
            const response = await this.saleTransactionService.findAllSalesReport(req.context,reportType, startDate, endDate,);
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    // get Latest invoidId

    findLatestInvoiceId = async (req: Request, res: Response) => {
        try {
            const response = await this.saleTransactionService.findLatestInvoiceId(req.context);
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    findLatestSalesTransactionId = async (req: Request, res: Response) => {
        try {
            const response = await this.saleTransactionService.findLatestSalesTransactionId(req.context);
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

}