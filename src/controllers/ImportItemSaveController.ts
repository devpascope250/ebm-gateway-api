import { ImportItemSaveService } from "../services/ImportItemSaveService";
import { Response, Request } from "express";
export class ImportItemSaveController {
    private importItemSaveService: ImportItemSaveService;

    constructor() {
        this.importItemSaveService = new ImportItemSaveService();
    }

    importItemSave = async (req: Request, res: Response) => {        
        try {
            const result = await this.importItemSaveService.importItemSave(req.body, req.context);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            const err = (error as {resultMsg?: string})?.resultMsg ?? (error  as {resultMsg?: string, message?: string})?.message ?? "Internal Server Error";
            
            res.status(500).json(err ?? "Internal Server Error");
        }
    }
}