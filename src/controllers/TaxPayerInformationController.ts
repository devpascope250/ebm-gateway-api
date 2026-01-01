import { Response, Request } from "express"
import { TaxPayerInformationService } from "../services/TaxPayerInformationService"


export class TaxPayerInformationController {
    // get all TaxPayers
    getAllTaxPayers = async (req: Request, res: Response) => {
        try {
            const custmTin = req.headers['x-custmTin'] as string;
            if(!custmTin){
                throw new Error("Invalid Customer Tin")
            }
            const instance = new TaxPayerInformationService(req.context.tin, req.context.bhfId, custmTin);
            const result = await instance.getAllTaxPayers();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(err ?? "Error Occured");
        }
    }


    // get TaxPayerByTin

    getTaxPayerByTin = async (req: Request, res: Response) => {
        try {
            const custmTin = req.headers['x-custmTin'] as string;
            const instance = new TaxPayerInformationService(req.context.tin, req.context.bhfId, custmTin);
            const result = await instance.findOneByTin();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error ?? "Error Occured");
        }
    }
}