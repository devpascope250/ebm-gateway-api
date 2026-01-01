import { Router } from "express";
import { TaxPayerInformationController } from "../controllers/TaxPayerInformationController";
const router = Router();
const taxPayerControl = new TaxPayerInformationController();

router.get("/selectCustomer", taxPayerControl.getAllTaxPayers);
router.get("/selectCustomer/byTin", taxPayerControl.getTaxPayerByTin);


export default router;