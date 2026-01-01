import { TaxPayerInformation } from "../models/TaxPayerInformation";
import { BaseRepository } from "./BaseRepository";

export class TaxPayerInformationRepository extends BaseRepository {
    private table = "tax_payer_information";

    async getTaxPayerByTin(tin: string): Promise<TaxPayerInformation| null> {
        const query = `SELECT * FROM ${this.table} WHERE tin = :tin`;
        const rows = await this.queryNamed<TaxPayerInformation[]>(query, {tin})
        return rows[0] || null;
    }

    async createTaxPayerInformation(taxPayerInformation: TaxPayerInformation): Promise<number> {
        const query = `INSERT INTO ${this.table} ( tin, taxprNm, taxprSttsCd, prvncNm, dstrtNm, sctrNm, locDesc) VALUES (:tin, :taxprNm, :taxprSttsCd, :prvncNm, :dstrtNm, :sctrNm, :locDesc)`;
        const result = await this.queryNamed<{insertId: number}>(query, taxPayerInformation);
        return result.insertId;
    }
    // findAll

    async findAll(): Promise<TaxPayerInformation[]> {
        const query = `SELECT * FROM ${this.table}`;
        const rows = await this.query<TaxPayerInformation[]>(query);
        return rows;
    }
}