"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsListController = void 0;
const ItemListService_1 = require("../services/ItemListService");
const LatestProductItemCodeService_1 = require("../services/LatestProductItemCodeService");
class ItemsListController {
    constructor() {
        this.getAllItemsList = async (req, res) => {
            try {
                const result = await this.itemsListService.getItemsList(req.context);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json(error ?? "Internal Server Error");
            }
        };
        this.getLatestItemCode = async (req, res) => {
            try {
                const result = await this.latestItemCode.getLatestProductItemCode(req.context);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error ?? "Internal Server Error");
            }
        };
        this.getItemsByItemCd = async (req, res) => {
            try {
                const result = await this.itemsListService.getItemsListByItemCd(req.context, req.body);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error ?? "Internal Server Error");
            }
        };
        this.itemsListService = new ItemListService_1.ItemListService();
        this.latestItemCode = new LatestProductItemCodeService_1.LatestProductItemCodeService();
    }
}
exports.ItemsListController = ItemsListController;
