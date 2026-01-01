import { Response, Request } from "express";
import { ItemListService } from "../services/ItemListService";
import { LatestProductItemCodeService } from "../services/LatestProductItemCodeService";

export class ItemsListController {
    private itemsListService: ItemListService;
    private latestItemCode: LatestProductItemCodeService;

    constructor() {
        this.itemsListService = new ItemListService();
        this.latestItemCode = new LatestProductItemCodeService();
    }

    getAllItemsList = async(req: Request, res: Response)  => {
        try{
            const result = await this.itemsListService.getItemsList(req.context);
            res.status(200).json(result);
        }catch(error){
            res.status(500).json(error ?? "Internal Server Error")
        }
    }

    getLatestItemCode = async(req: Request, res: Response) => {
        try{
            const result = await this.latestItemCode.getLatestProductItemCode(req.context);
            res.status(200).json(result);
        }catch(error){
            console.log(error);
            
            res.status(500).json(error ?? "Internal Server Error")
        }
    }

    getItemsByItemCd = async(req: Request, res: Response) => {
        try{
            const result = await this.itemsListService.getItemsListByItemCd(req.context, req.body);
            res.status(200).json(result);
        }catch(error){
            console.log(error); 
            res.status(500).json(error ?? "Internal Server Error")
        }
    }
}