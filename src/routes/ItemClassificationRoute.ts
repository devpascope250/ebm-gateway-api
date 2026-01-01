import { Router } from "express";
import { authMiddleware } from "../authMiddleware";
import { ItemClassificationsController } from "../controllers/ItemClassificationsController";
const router = Router();
const itemclass = new ItemClassificationsController();
router.get("/selectItemsClass", authMiddleware(), itemclass.getItemClassifications);


export default router;