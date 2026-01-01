import { Response, Request } from "express";
import { SaveCompanyInsuranceService } from "../services/SaveCompanyInsuranceService";

export class SaveCompanyInsuranceController {
    private saveCompanyInsuranceService: SaveCompanyInsuranceService;

    constructor() {
        this.saveCompanyInsuranceService = new SaveCompanyInsuranceService();
    }

     saveCompanyInsurance = async(req: Request, res: Response) => {
        try{
            const result = await this.saveCompanyInsuranceService.saveCompanyInsurance(req.body);
            res.status(200).json(result);
        }catch(error){
            res.status(500).json(error ?? "Internal Server Error")
        }
    }
}