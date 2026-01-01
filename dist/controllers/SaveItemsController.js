"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveItemsController = void 0;
const SaveItems_1 = require("../services/SaveItems");
class SaveItemsController {
    constructor() {
        this.saveItems = async (req, res) => {
            try {
                const result = await this.saveItemsService.saveItems(req.body, req.context);
                console.log(result);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error ?? "Internal Server Error");
            }
        };
        this.saveItemsService = new SaveItems_1.SaveItemsService();
    }
}
exports.SaveItemsController = SaveItemsController;
