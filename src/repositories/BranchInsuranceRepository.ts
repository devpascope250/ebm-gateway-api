import { SaveCompanyInsurance } from "../models/SaveCompanyInsurance";
import { BaseRepository } from "./BaseRepository";

export class BranchInsuranceRepository extends BaseRepository{
    private tableName = 'branch_insurance';

    // create branch insurance

    async create(insurance: SaveCompanyInsurance): Promise<number> {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,isrccCd,isrccNm,isrcRt,useYn,regrNm,regrId,modrNm) VALUES (:tin,:bhfId,:isrccCd,:isrccNm,:isrcRt,:useYn,:regrNm,:regrId,:modrNm)`;
        const result = await this.queryNamed<{insertId: number}>(sql, insurance);
        return result.insertId;
    }

    // get all insurances

    async getAll(): Promise<SaveCompanyInsurance[]> {
        const sql = `SELECT * FROM ${this.tableName}`;
        const result = await this.query<SaveCompanyInsurance[]>(sql);
        return result;
    }

    // get insurance by id

    async getByTin(tin: string): Promise<SaveCompanyInsurance> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed<SaveCompanyInsurance[]>(sql, {tin});
        return result[0];  
    }
}