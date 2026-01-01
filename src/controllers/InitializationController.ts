import { Response, Request } from "express";
import { InitializaionService } from "../services/InitializationService";

export class InitializationController {
    private initalizationService: InitializaionService;
    constructor() {
        this.initalizationService = new InitializaionService();
    }

    initialize = async(req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.initalizationService.initialize(req.context);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            
            res.status(500).json(error ?? { error: "Initialization failed", details: error });
        }
    }
}