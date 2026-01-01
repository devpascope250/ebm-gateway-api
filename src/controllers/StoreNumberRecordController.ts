import { Response, Request } from "express";
import { StoreNumberRecordService } from "../services/StoreNumberRecordService";

export class StoreNumberRecordController {
    private storeNumberRecordService = new StoreNumberRecordService();
    // get next sarNo
    getNextSarNo = async (req: Request, res: Response) => {
        try {
            const nextSarNo = await this.storeNumberRecordService.getNextSarNo(req.context.tin, req.context.bhfId);
            res.status(200).json({ nextSarNo });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}