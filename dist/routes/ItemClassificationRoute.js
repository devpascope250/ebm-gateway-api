"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../authMiddleware");
const ItemClassificationsController_1 = require("../controllers/ItemClassificationsController");
const router = (0, express_1.Router)();
const itemclass = new ItemClassificationsController_1.ItemClassificationsController();
router.get("/selectItemsClass", (0, authMiddleware_1.authMiddleware)(), itemclass.getItemClassifications);
exports.default = router;
