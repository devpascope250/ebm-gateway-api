import { SaveCustomerBranch } from "../models/SaveBranchCustomer";
import { BaseRepository } from "./BaseRepository";

export class BranchCustomerRepository extends BaseRepository{
    private tableName = 'branch_customer';

    async create(branchCustomer: SaveCustomerBranch): Promise<number> {
        const query = `INSERT INTO ${this.tableName} (tin,bhfId,custNo,custTin,custNm,adrs,telNo,email,faxNo,useYn,remark,regrNm,regrId,modrNm,modrId) VALUES (:tin,:bhfId,:custNo,:custTin,:custNm,:adrs,:telNo,:email,:faxNo,:useYn,:remark,:regrNm,:regrId,:modrNm,:modrId)`;
        const result = await this.queryNamed<{insertId: number}>(query, branchCustomer);
        return result.insertId;
    }

    // get branch by tin

    async getBranchCustomerByTin(tin: string): Promise<SaveCustomerBranch[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed<SaveCustomerBranch[]>(sql, {tin});
        return result;
    }

    async getBranchCustomerByBhfId(bhfId: string): Promise<SaveCustomerBranch[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE bhfId = :bhfId`;
        const result = await this.queryNamed<SaveCustomerBranch[]>(sql, {bhfId});
        return result;
    }

    // get branch by custNo

    async getBranchCustomerByCustNo(custNo: string): Promise<SaveCustomerBranch[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE custNo = :custNo`;
        const result = await this.queryNamed<SaveCustomerBranch[]>(sql, {custNo});
        return result;
    }

    // get all

    async getAll(): Promise<SaveCustomerBranch[]> {
        const sql = `SELECT * FROM ${this.tableName}`;
        const result = await this.queryNamed<SaveCustomerBranch[]>(sql);
        return result;
    }
}