"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ListNoticeController_1 = require("../controllers/ListNoticeController");
const router = (0, express_1.Router)();
const listNoticeController = new ListNoticeController_1.ListNoticeController();
router.get('/selectNotices', listNoticeController.listNotice);
exports.default = router;
