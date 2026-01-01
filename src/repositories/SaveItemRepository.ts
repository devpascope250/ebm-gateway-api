import { SaveItems } from "../models/SaveItems";
import { BaseRepository } from "./BaseRepository";

export class SaveItemRepository extends BaseRepository {
    private  readonly tableName = 'save_items';

    async create(itemInformation: SaveItems): Promise<number> {
         const sql = `INSERT INTO ${this.tableName} (tin,bhfId,itemClsCd,itemCd,itemTyCd,itemNm,itemStdNm,orgnNatCd,pkgUnitCd,qtyUnitCd,taxTyCd,btchNo,bcd,dftPrc,grpPrcL1,grpPrcL2,grpPrcL3,grpPrcL4,grpPrcL5,addInfo,sftyQty,isrcAplcbYn,useYn,regrNm,regrId,modrNm,modrId) VALUES (:tin,:bhfId,:itemClsCd, :itemCd, :itemTyCd,:itemNm,:itemStdNm,:orgnNatCd,:pkgUnitCd,:qtyUnitCd,:taxTyCd,:btchNo,:bcd,:dftPrc,:grpPrcL1,:grpPrcL2,grpPrcL3,:grpPrcL4,grpPrcL5,:addInfo,:sftyQty,:isrcAplcbYn,:useYn,:regrNm,:regrId,:modrNm,:modrId)`;
        const result = await this.queryNamed<{ insertId: number }>(sql, itemInformation);
        return result.insertId;
    }

    async getAll(): Promise<SaveItems[]> {
        const sql = `SELECT * FROM ${this.tableName}`;
        const result = await this.query<SaveItems[]>(sql);
        return result;
    }

    // get by tin

    async geItemInformationByTin(tin: string): Promise<SaveItems[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed<SaveItems[]>(sql, { tin });
        return result;
    }
}