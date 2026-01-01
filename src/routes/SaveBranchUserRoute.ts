import { Router } from "express";
import { SaveBranchUserController } from "../controllers/SaveBranchUserController";
const router = Router();
router.post('/saveBrancheUsers', new SaveBranchUserController().saveBranchUser);
export default router;