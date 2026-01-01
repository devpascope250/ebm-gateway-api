import { Response, Request } from "express";
import { ListImportItemService } from "../services/ListImportItemService";

export class ListImportItemController {
    private listImportItemService: ListImportItemService;
    
    constructor(){
        this.listImportItemService = new ListImportItemService();
    }

    listImportItem = async(req: Request, res: Response)  => {
        try{
            const start_date = req.query.start_date as string;
            const end_date = req.query.end_date as string;

            const result = await this.listImportItemService.syncListImportItem(req.context, start_date, end_date);
            res.status(200).json(result);
        }catch(error){
            res.status(500).json(error ?? "Internal Server Error")
        }
    }
}