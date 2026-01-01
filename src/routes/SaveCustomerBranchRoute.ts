import { Router } from "express";
import { SaveCustomerBranchController } from "../controllers/SaveCustomerBranchController";
const router = Router();
router.post('/saveBrancheCustomers', new SaveCustomerBranchController().saveCustomerBranch);

export default router;