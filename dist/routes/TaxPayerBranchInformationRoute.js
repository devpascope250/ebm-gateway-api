"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaxPayerBranchInformationController_1 = require("../controllers/TaxPayerBranchInformationController");
const router = (0, express_1.Router)();
const taxpayerBranchService = new TaxPayerBranchInformationController_1.TaxPayerBranchInformationController;
router.get('/selectBranches', taxpayerBranchService.getAll);
router.get('/selectBranches/byTinBybhfId', taxpayerBranchService.getByTinAndBybhfId);
exports.default = router;
