import { Response, Request } from "express";
import { SaveCustomerBranchService } from "../services/SaveCustomerBranchService";
export class SaveCustomerBranchController {
    private saveCustomerService: SaveCustomerBranchService;

    constructor(){
        this.saveCustomerService = new SaveCustomerBranchService();
    }

    saveCustomerBranch = async(req: Request, res: Response)  => {
        try{
            const result = await this.saveCustomerService.saveCustomerBranch(req.body);
            res.status(200).json(result);
        }catch(error){
            res.status(500).json(error ?? "Internal Server Error")
        }
    }
}