import { SaveItemsService } from "../services/SaveItems";
import { Response, Request } from "express";
export class SaveItemsController {
    private saveItemsService: SaveItemsService;

    constructor() {
        this.saveItemsService = new SaveItemsService();
    }

     saveItems = async(req: Request, res: Response) => {
        try{
            const result = await this.saveItemsService.saveItems(req.body, req.context);
            console.log(result);
            res.status(200).json(result);

        }catch(error){
            console.log(error);
            

            res.status(500).json(error ?? "Internal Server Error")
        }
    }
}