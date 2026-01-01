import { Router } from "express";
import { TaxPayerBranchInformationController } from "../controllers/TaxPayerBranchInformationController";
const router = Router();
const taxpayerBranchService = new TaxPayerBranchInformationController;

router.get('/selectBranches', taxpayerBranchService.getAll);
router.get('/selectBranches/byTinBybhfId', taxpayerBranchService.getByTinAndBybhfId);

export default router;