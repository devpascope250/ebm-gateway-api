import { InitInfoRes } from "../models/InitInfoRes";
import { BaseRepository } from "./BaseRepository";

export class InitInfoResRepository extends BaseRepository {
    private tableName = "init_info_res";

    async findAll(): Promise<InitInfoRes[]> {
        const sql = `SELECT * FROM ${this.tableName}`;
        return await this.query<InitInfoRes[]>(sql);
    }

    async findOne(id: number): Promise<InitInfoRes | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = :id`;
        const result = await this.queryNamed<InitInfoRes[]>(sql, { id });
        return result[0] || null;
    }

    // get all by tin
    async findAllByTin(tin: string): Promise<InitInfoRes[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        return await this.queryNamed<InitInfoRes[]>(sql, [tin]);
    }

    // create new 

    async create(data: InitInfoRes): Promise<boolean> {
        const sql = `INSERT INTO ${this.tableName} 
        (tin,
        taxprNm,
        bsnsActv,
        bhfId,
        bhfNm,
        bhfOpenDt,
        prvncNm,
        dstrtNm,
        sctrNm,
        locDesc,
        hqYn,
        mgrNm,
        mgrTelNo,
        mgrEmail,
        sdcId,
        mrcNo,
        dvcId,
        intrlKey,
signKey,
cmcKey,
lastSaleInvcNo,
lastPchsInvcNo,
lastSaleRcptNo,
lastInvcNo,
lastTrainInvcNo,
lastProfrmInvcNo,
lastCopyInvcNo) VALUES (:tin,:taxprNm,:bsnsActv,:bhfId,:bhfNm,:bhfOpenDt,:prvncNm,:dstrtNm,:sctrNm,:locDesc,:hqYn,:mgrNm,:mgrTelNo,:mgrEmail,:sdcId,:mrcNo,:dvcId,:intrlKey,
:signKey,
:cmcKey,
:lastSaleInvcNo,
:lastPchsInvcNo,
:lastSaleRcptNo,
:lastInvcNo,
:lastTrainInvcNo,
:lastProfrmInvcNo,
:lastCopyInvcNo)`;

        await this.queryNamed<boolean>(sql, data);
        return true;
    }
}