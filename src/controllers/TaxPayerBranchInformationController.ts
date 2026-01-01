import { TaxPayerBranchInformationService } from "../services/TaxPayerBranchInformationService";
import { Response, Request } from "express";
export class TaxPayerBranchInformationController {
    private taxPayerBranchInformationService: TaxPayerBranchInformationService;

    constructor() {
        this.taxPayerBranchInformationService = new TaxPayerBranchInformationService();
    }

    getAll = async (req: Request, res: Response) => {
        try{
            const result = await this.taxPayerBranchInformationService.getAllTaxPayerBranchInformation(req.context);
            res.status(200).json(result);
        }catch(err){
            console.log(err);
            res.status(500).json(err ?? "Error Occured");
            
        }
        
    }

    // get by tin and by bhfId

    getByTinAndBybhfId = async(req: Request, res: Response) => {
        try{
            const result = await this.taxPayerBranchInformationService.getTaxPayerBranchInformationByTinBybhfId(req.context);
            res.status(200).json(result);
        }catch(error) {
            console.log(error);
            res.status(500).json(error ?? "There is an Internal error");
            
        }
    }
    
}