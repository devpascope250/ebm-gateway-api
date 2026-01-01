import { Router } from "express";
const router = Router();

import { SaveItemsController } from "../controllers/SaveItemsController";
import { ItemsListController } from "../controllers/ItemListController";
router.get("/selectItems", new ItemsListController().getAllItemsList);
router.post("/saveItems", new SaveItemsController().saveItems);
router.get("/get-latest-item-code", new ItemsListController().getLatestItemCode);
router.post("/get-items-by-itemCd", new ItemsListController().getItemsByItemCd);

export default router;