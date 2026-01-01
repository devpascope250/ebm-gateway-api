"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SaveCompanyInsuranceController_1 = require("../controllers/SaveCompanyInsuranceController");
const router = (0, express_1.Router)();
router.post('/saveBrancheInsurances', new SaveCompanyInsuranceController_1.SaveCompanyInsuranceController().saveCompanyInsurance);
exports.default = router;
