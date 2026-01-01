import { Router } from "express";
import { SaveCompanyInsuranceController } from "../controllers/SaveCompanyInsuranceController";
const router = Router();
router.post('/saveBrancheInsurances', new SaveCompanyInsuranceController().saveCompanyInsurance);

export default router;