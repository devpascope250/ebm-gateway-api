"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListImportItemController = void 0;
const ListImportItemService_1 = require("../services/ListImportItemService");
class ListImportItemController {
    constructor() {
        this.listImportItem = async (req, res) => {
            try {
                const result = await this.listImportItemService.syncListImportItem(req.context);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json(error ?? "Internal Server Error");
            }
        };
        this.listImportItemService = new ListImportItemService_1.ListImportItemService();
    }
}
exports.ListImportItemController = ListImportItemController;
