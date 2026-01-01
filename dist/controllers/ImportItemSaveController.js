"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportItemSaveController = void 0;
const ImportItemSaveService_1 = require("../services/ImportItemSaveService");
class ImportItemSaveController {
    constructor() {
        this.importItemSave = async (req, res) => {
            try {
                const result = await this.importItemSaveService.importItemSave(req.body, req.context);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                const err = error?.resultMsg ?? error?.message ?? "Internal Server Error";
                res.status(500).json(err ?? "Internal Server Error");
            }
        };
        this.importItemSaveService = new ImportItemSaveService_1.ImportItemSaveService();
    }
}
exports.ImportItemSaveController = ImportItemSaveController;
