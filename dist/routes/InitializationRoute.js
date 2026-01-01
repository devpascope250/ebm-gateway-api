"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InitializationController_1 = require("../controllers/InitializationController");
const router = (0, express_1.Router)();
router.get("/initialize", new InitializationController_1.InitializationController().initialize);
exports.default = router;
