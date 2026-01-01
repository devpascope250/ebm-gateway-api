import { Response, Request } from "express";
import { ItemClassificationService } from "../services/ItemClassificationService";

export class ItemClassificationsController {
    private itemClassifications: ItemClassificationService;

    constructor() {
        this.itemClassifications = new ItemClassificationService();
    }
    
    getItemClassifications = async(req: Request, res: Response) => {

         const searchQuery = req.query.query as string;
        try{
            const itemClassifications = await this.itemClassifications.getAllItemClassifications(req.context, searchQuery ?? "");
            res.status(200).json(itemClassifications);
        }catch(error) {
            res.status(500).json({error: error ?? "Error getting item classifications"});
        } 
    }
}