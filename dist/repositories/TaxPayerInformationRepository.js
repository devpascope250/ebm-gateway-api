"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxPayerInformationRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class TaxPayerInformationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.table = "tax_payer_information";
    }
    async getTaxPayerByTin(tin) {
        const query = `SELECT * FROM ${this.table} WHERE tin = :tin`;
        const rows = await this.queryNamed(query, { tin });
        return rows[0] || null;
    }
    async createTaxPayerInformation(taxPayerInformation) {
        const query = `INSERT INTO ${this.table} ( tin, taxprNm, taxprSttsCd, prvncNm, dstrtNm, sctrNm, locDesc) VALUES (:tin, :taxprNm, :taxprSttsCd, :prvncNm, :dstrtNm, :sctrNm, :locDesc)`;
        const result = await this.queryNamed(query, taxPayerInformation);
        return result.insertId;
    }
    // findAll
    async findAll() {
        const query = `SELECT * FROM ${this.table}`;
        const rows = await this.query(query);
        return rows;
    }
}
exports.TaxPayerInformationRepository = TaxPayerInformationRepository;
