import { ListNoticeService } from "../services/ListNoticeService";
import { Response, Request } from "express";
import { DateUtils } from "../utils/date-time";
export class ListNoticeController {
    private listNoticeService: ListNoticeService;

    constructor() {
        this.listNoticeService = new ListNoticeService();
    }
    listNotice = async(req: Request, res: Response)  => {
        try{
            const result = await this.listNoticeService.getAllNotice(req.context);
            const newData = result.map((notice) => {
                return{
                    id: notice.noticeNo,
                    title: notice.title,
                    content: notice.cont,
                    detailUrl: notice.dtlUrl,
                    registeredDate: (DateUtils.parse(notice?.regDt ?? "") ?? notice.regDt).toLocaleDateString()+ " "+(DateUtils.parse(notice?.regDt ?? "") ?? notice.regDt).toLocaleTimeString(),
                    isRead: false,
                    type: "info"    
                }
            })
            res.status(200).json(newData);
        }catch(error){
            res.status(500).json(error ?? "Internal Server Error")
        }
    }
}