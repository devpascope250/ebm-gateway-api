"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ImportItemSaveController_1 = require("../controllers/ImportItemSaveController");
const ListImportItemController_1 = require("../controllers/ListImportItemController");
const router = (0, express_1.Router)();
router.post('/updateImportItems', new ImportItemSaveController_1.ImportItemSaveController().importItemSave);
router.get('/selectImportItems', new ListImportItemController_1.ListImportItemController().listImportItem);
exports.default = router;
