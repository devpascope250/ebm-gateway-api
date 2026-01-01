import { Router } from "express";
import { CodeClassificationController } from "../controllers/CodeClassificationController";
import { authMiddleware } from "../authMiddleware";
const router = Router();
const CodeCls = new CodeClassificationController();
router.get('/selectCodes', authMiddleware(), CodeCls.getAllCodeClassification);
router.get('/selectCodes/cdCls/:cdCls', authMiddleware(), CodeCls.getCodeClassificationByCdCls);
router.get('/all-classificationCodes', CodeCls.getAllClassification);
router.get('/all-codes/:cdCls', CodeCls.getCodeListByCdCls);
router.get('/all-codes/by-cdCls/:cdClNm', CodeCls.getCodeClassificationByCdClNm);

export default router;