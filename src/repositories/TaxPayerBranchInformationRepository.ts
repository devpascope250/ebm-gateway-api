import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { TaxPayerBranchInformation } from "../models/TaxBranchInformation";
import { BaseEbmSyncService } from "../services/EbmSyncStatusService";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class TaxPayerBranchInformationRepository extends BaseRepository {
    
    private tableName = "tax_payer_branch_information";
    private baseEbmSyncService: BaseEbmSyncService  = new (class extends BaseEbmSyncService{})();
    async create(branch: TaxPayerBranchInformation, tx?: TransactionInterface): Promise<number> {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,bhfNm,bhfSttsCd,prvncNm,dstrtNm,sctrNm,locDesc,mgrNm,mgrTelNo,mgrEmail,hqYn) VALUES (:tin,:bhfId,:bhfNm,:bhfSttsCd,:prvncNm,:dstrtNm,:sctrNm,:locDesc,:mgrNm,:mgrTelNo,:mgrEmail,:hqYn)`;
        if (tx) {
            const result = await tx.queryNamed<{ insertId: number }>
                (sql, branch);
            return result.insertId;
        } else {
            const result = await this.queryNamed<{ insertId: number }>(sql, branch);
            return result.insertId;
        }
    }

    async createWithTransaction(branch: TaxPayerBranchInformation[], ebmSync: EbmSyncStatus,): Promise<boolean> {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransaction(ebmSync, "tax_payer_branch_information", tx);
            await Promise.all(branch.map(async (branch) => {
                await this.create(branch, tx);
            }))
        })
        return true;
    }



    // get branch by tin

    async getBranchByTin(tin: string): Promise<TaxPayerBranchInformation[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed<TaxPayerBranchInformation[]>(sql, { tin });
        return result;
    }

    async getBranchByTinByBhfId(tin: string, bhfId: string): Promise<TaxPayerBranchInformation[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE bhfId = :bhfId AND tin = :tin`;
        const result = await this.queryNamed<TaxPayerBranchInformation[]>(sql, { bhfId, tin });
        return result;
    }

    // get all 

    async getAll(payload: EbmSyncStatus): Promise<TaxPayerBranchInformation[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE bhfId = :bhfId AND tin = :tin`;
        const result = await this.queryNamed<TaxPayerBranchInformation[]>(sql, { ...payload });
        return result;
    }
}