import { Response, Request } from "express";
import { SaveBranchUserAccountService } from "../services/SaveBranchUserAccountService";

export class SaveBranchUserController {
    private saveBranchUserAccount: SaveBranchUserAccountService;
    
    constructor(){
        this.saveBranchUserAccount = new SaveBranchUserAccountService();
    }

    saveBranchUser = async(req: Request, res: Response)  => {
        try{
            const result = await this.saveBranchUserAccount.saveBranchUserAccount(req.body);
            res.status(200).json(result);
        }catch(error){
            res.status(500).json(error ?? "Internal Server Error")
        }
    }
}