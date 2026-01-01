"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SaveCustomerBranchController_1 = require("../controllers/SaveCustomerBranchController");
const router = (0, express_1.Router)();
router.post('/saveBrancheCustomers', new SaveCustomerBranchController_1.SaveCustomerBranchController().saveCustomerBranch);
exports.default = router;
