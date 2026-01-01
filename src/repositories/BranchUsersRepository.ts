import { SaveBranchUsers } from "../models/SaveBranchUsers";
import { BaseRepository } from "./BaseRepository";

export class BranchUsersRepository extends BaseRepository {
    private tabName = 'branch_users';

    // create new user

    async create(user: SaveBranchUsers): Promise<number> {
        const sql = `INSERT INTO ${this.tabName} (tin,bhfId,userId,userNm,pwd,adrs,cntc,authCd,remark,useYn,regrNm,regrId,modrNm,modrId) VALUES (:tin,:bhfId,:userId,:userNm,:pwd,:adrs,:cntc,:authCd,:remark,:useYn,:regrNm,:regrId,:modrNm,modrId)`;
        const result = await this.queryNamed<{insertId: number}>(sql, user);
        return result.insertId;
    }
    async getBranchUsersByBhId(branchId: number): Promise<SaveBranchUsers[]> {
        const sql = `SELECT * FROM ${this.tabName} WHERE bhfId = :bhfId`;
        const result = await this.queryNamed<SaveBranchUsers[]>(sql, {bhfId: branchId});
        return result;
    }

    // gett user by tin

    async getBranchUsersByTin(tin: string): Promise<SaveBranchUsers[]> {
        const sql = `SELECT * FROM ${this.tabName} WHERE tin = :tin`;
        const result = await this.queryNamed<SaveBranchUsers[]>(sql, {tin: tin});
        return result;
    }

    // get all

    async getAll(): Promise<SaveBranchUsers[]> {
        const sql = `SELECT * FROM ${this.tabName}`;
        const result = await this.queryNamed<SaveBranchUsers[]>(sql);
        return result;
    }

    // get user by userId

    async getBranchUsersByUserId(userId: string): Promise<SaveBranchUsers | null> {
        const sql = `SELECT * FROM ${this.tabName} WHERE userId = :userId`;
        const result = await this.queryNamed<SaveBranchUsers[]>(sql, {userId});
        return result[0] || null;
    }
}