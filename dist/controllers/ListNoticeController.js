"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNoticeController = void 0;
const ListNoticeService_1 = require("../services/ListNoticeService");
class ListNoticeController {
    constructor() {
        this.listNotice = async (req, res) => {
            try {
                const result = await this.listNoticeService.getAllNotice(req.context);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json(error ?? "Internal Server Error");
            }
        };
        this.listNoticeService = new ListNoticeService_1.ListNoticeService();
    }
}
exports.ListNoticeController = ListNoticeController;
