"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemClassificationsController = void 0;
const ItemClassificationService_1 = require("../services/ItemClassificationService");
class ItemClassificationsController {
    constructor() {
        this.getItemClassifications = async (req, res) => {
            const searchQuery = req.query.query;
            try {
                const itemClassifications = await this.itemClassifications.getAllItemClassifications(req.context, searchQuery ?? "");
                res.status(200).json(itemClassifications);
            }
            catch (error) {
                res.status(500).json({ error: error ?? "Error getting item classifications" });
            }
        };
        this.itemClassifications = new ItemClassificationService_1.ItemClassificationService();
    }
}
exports.ItemClassificationsController = ItemClassificationsController;
