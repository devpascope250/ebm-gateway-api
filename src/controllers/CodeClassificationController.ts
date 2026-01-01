import { Response, Request } from "express";

import { CodeClassificationService } from "../services/CodeClassificationService";
export class CodeClassificationController {
    getAllCodeClassification = async (req: Request, res: Response,): Promise<void> => {
        const { tin, bhfId, lastRequestDate } = req.context;
        const codeClassificationService = new CodeClassificationService(tin, bhfId, lastRequestDate);
        try {
            const codeClassification = await codeClassificationService.getAll();
            res.status(200).json(codeClassification);
        } catch (error) {
            res.status(500).json({ message: error ?? "Error" });
        }
    }

    getCodeClassificationByCdCls = async (req: Request, res: Response,): Promise<void> => {
        const { tin, bhfId, lastRequestDate } = req.context;
        const codeClassificationService = new CodeClassificationService(tin, bhfId, lastRequestDate);
        try {
            const codeClassification = await codeClassificationService.getBycdCls(req.params.cdCls);
            res.status(200).json(codeClassification);
        } catch (error) {
            res.status(500).json({ message: error ?? "Error" });
        }
        
    }

    getAllClassification = async (req: Request, res: Response,): Promise<void> => {
        const { tin, bhfId, lastRequestDate } = req.context;
        const codeClassificationService = new CodeClassificationService(tin, bhfId, lastRequestDate);
        try {
            const codeClassification = await codeClassificationService.getAllClassification();
            res.status(200).json(codeClassification);
        } catch (error) {
            res.status(500).json({ message: error ?? "Error" });
        }
    }

    getCodeListByCdCls = async (req: Request, res: Response,): Promise<void> => {
        const { tin, bhfId, lastRequestDate } = req.context;
        const codeClassificationService = new CodeClassificationService(tin, bhfId, lastRequestDate);
        try {
            const codeClassification = await codeClassificationService.getCodeList(req.params.cdCls);
            res.status(200).json(codeClassification);
        } catch (error) {
            res.status(500).json({ message: error ?? "Error" });
        }
    }

    getCodeClassificationByCdClNm = async (req: Request, res: Response,): Promise<void> => {
        const { tin, bhfId, lastRequestDate } = req.context;
        const codeClassificationService = new CodeClassificationService(tin, bhfId, lastRequestDate);
        const searchQuery = req.query.query as string;
        try {
            const codeClassification = await codeClassificationService.getCodeListByCdClsNm( req.params.cdClNm === "StockIOType" ? "Stock I/O Type" : req.params.cdClNm, searchQuery);
            res.status(200).json(codeClassification);
        } catch (error) {
            res.status(500).json({ message: error ?? "Error" });
        }
    }



}