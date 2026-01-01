import { Router } from "express";
import { ListNoticeController } from "../controllers/ListNoticeController";
const router = Router();
const listNoticeController = new ListNoticeController();
router.get('/selectNotices', listNoticeController.listNotice);

export default router;