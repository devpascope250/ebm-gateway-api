import { Router } from "express";
import { ImportItemSaveController } from "../controllers/ImportItemSaveController";
import { ListImportItemController } from "../controllers/ListImportItemController";
const router = Router(); 
router.post('/updateImportItems', new ImportItemSaveController().importItemSave);
router.get('/selectImportItems', new ListImportItemController().listImportItem);

export default router;