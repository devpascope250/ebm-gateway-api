import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ItemsList } from "../models/ItemsList";
import { BaseEbmSyncService } from "../services/EbmSyncStatusService";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class ItemsListRepository extends BaseRepository {
    private readonly tableName = "items_list";
    private baseEbmSyncService: BaseEbmSyncService = new (class extends BaseEbmSyncService { })();
    //create items

    async create(item: ItemsList, tx?: TransactionInterface): Promise<number> {
        const query = `INSERT IGNORE INTO ${this.tableName} (tin,itemClsCd,itemCd,itemTyCd,itemNm,itemStdNm,orgnNatCd,pkgUnitCd,qtyUnitCd,taxTyCd,btchNo,regBhfId,bcd,dftPrc,grpPrcL1,grpPrcL2,grpPrcL3,grpPrcL4,grpPrcL5,addInfo,sftyQty,isrcAplcbYn,rraModYn,useYn) VALUES (:tin,:itemClsCd,:itemCd,:itemTyCd,:itemNm,:itemStdNm,:orgnNatCd,:pkgUnitCd,:qtyUnitCd,:taxTyCd,:btchNo,:regBhfId,:bcd,:dftPrc,:grpPrcL1,:grpPrcL2,:grpPrcL3,:grpPrcL4,:grpPrcL5,:addInfo,:sftyQty,:isrcAplcbYn,:rraModYn,:useYn)`;
        if (tx) {
            const result = await tx.queryNamed<{ id: number }>(query, { ...item });
            return result.id;
        } else {
            const result = await this.queryNamed<{ id: number }>(query, { ...item });
            return result.id;
        }
    }

    async update(item: ItemsList, tx: TransactionInterface) {
        const query = `UPDATE ${this.tableName} SET tin = :tin,itemClsCd = :itemClsCd,itemCd = :itemCd,itemTyCd = :itemTyCd,itemNm = :itemNm,itemStdNm = :itemStdNm,orgnNatCd = :orgnNatCd,pkgUnitCd = :pkgUnitCd,qtyUnitCd = :qtyUnitCd,taxTyCd = :taxTyCd,btchNo = :btchNo,regBhfId = :regBhfId,bcd = :bcd,dftPrc = :dftPrc,grpPrcL1 = :grpPrcL1,grpPrcL2 = :grpPrcL2,grpPrcL3 = :grpPrcL3,grpPrcL4 = :grpPrcL4,grpPrcL5 = :grpPrcL5,addInfo = :addInfo,sftyQty = :sftyQty,isrcAplcbYn = :isrcAplcbYn,rraModYn = :rraModYn,useYn = :useYn WHERE tin = :tin AND regBhfId = :regBhfId AND itemCd = :itemCd`;
        if (tx) {
            const result = await tx.queryNamed(query, { ...item });
            return result;
        } else {
            const result = await this.queryNamed(query, { ...item });
            return result
        }
    }

     async checkExistedItem(itemCd: string, payload: EbmSyncStatus, tx?: TransactionInterface): Promise<boolean> {
        const sql = `SELECT * FROM ${this.tableName} WHERE itemCd = :itemCd AND tin = :tin AND regBhfId = :bhfId`;
        if(tx){
            const result = await tx.queryNamed<ItemsList[]>(sql, {itemCd, ...payload});
            return (result && result.length > 0) ? true : false;
        }else{
            const result = await this.queryNamed<ItemsList[]>(sql, {itemCd, ...payload});
            return (result && result.length > 0) ? true : false;
        }
    }

    async createManyItems(items: ItemsList[], payload: EbmSyncStatus) {
        await this.transaction(async (tx) => {
            await this.baseEbmSyncService.recordEbmSyncStatusWithTransaction(payload, "items_list", tx);
            await Promise.all(items.map(async (item) => {
                const existed = await this.checkExistedItem(item.itemCd ?? "", payload, tx);
                if(existed){
                    await this.update(item, tx)
                }else{
                    await this.create(item, tx);
                }
                
            }))
        })
    }

    public async getAll(payload: EbmSyncStatus): Promise<ItemsList[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND regBhfId = :bhfId`;
        const result = await this.queryNamed<ItemsList[]>(sql, { ...payload });
        return result;
    }

    // get items by tin

    public async getByTin(tin: string): Promise<ItemsList[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin`;
        const result = await this.queryNamed<ItemsList[]>(sql, { tin });
        return result;
    }

    // get items by bhfId

    public async getByBhfId(bhfId: string): Promise<ItemsList[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE bhfId = :bhfId`;
        const result = await this.queryNamed<ItemsList[]>(sql, { bhfId });
        return result;
    }

    // get items by tin and itemClsCd

    public async getByTinBhfIdAndItemCd(tin: string,bhfId: string, itemCd: string | Array<{ itemCd: string }>): Promise<ItemsList[]> {
        if (Array.isArray(itemCd)) {
            const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND regBhfId = :bhfId AND itemCd IN (:itemCd)`;
            const result = await this.queryNamedWithArrays<ItemsList[]>(sql, { tin, bhfId, itemCd: itemCd.map(item => item.itemCd) });
            return result;
        } else {
            const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND regBhfId = :bhfId AND itemCd = :itemCd`;
            const result = await this.queryNamed<ItemsList[]>(sql, { tin, bhfId, itemCd });
            return result;
        }

    }

    // get items by tin and itemClsCd and itemCd

    public async getByTinAndItemClsCdAndItemCd(tin: string, itemClsCd: string, itemCd: string): Promise<ItemsList[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE tin = :tin AND itemClsCd = :itemClsCd AND itemCd = :itemCd`;
        const result = await this.queryNamed<ItemsList[]>(sql, { tin, itemClsCd, itemCd });
        return result;
    }

    // fer
}