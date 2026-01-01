"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaxPayerInformationController_1 = require("../controllers/TaxPayerInformationController");
const router = (0, express_1.Router)();
const taxPayerControl = new TaxPayerInformationController_1.TaxPayerInformationController();
router.get("/selectCustomer", taxPayerControl.getAllTaxPayers);
router.get("/selectCustomer/byTin", taxPayerControl.getTaxPayerByTin);
exports.default = router;
