import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { ImportItemSave } from "../models/ImportItemSave";
import { ListImportItem } from "../models/ListImportItem";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class ImportItemSaveRepository extends BaseRepository {
    private tableName = 'list_import_item';
    async create(data: ImportItemSave): Promise<number> {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,taskCd,dclDe,itemSeq,hsCd,itemClCd,itemCd,imptItemsttsCd,remark,modrNm,modrId) VALUES (:tin,:bhfId,:taskCd,:dclDe,:itemSeq,:hsCd,:itemClCd,:itemCd,:imptItemsttsCd,:remark,:modrNm,:modrId)`;
        const result = await this.queryNamed<{insertId: number}>(sql, data);
        return result.insertId;
    }

        async update(searchImportItem: ListImportItem, payload: EbmSyncStatus, tx?: TransactionInterface): Promise<boolean> {
            console.log(searchImportItem, payload);
            
            const query = `UPDATE ${this.tableName} SET itemClsCd = :itemClsCd,itemCd = :itemCd, imptItemSttsCd = :imptItemSttsCd WHERE tin = :tin AND bhfId = :bhfId AND id = :id`;
            if (tx) {
                await tx.queryNamed(query, {...searchImportItem, ...payload});
            } else {
                await this.queryNamed(query, {...searchImportItem, ...payload});
            }
    
            return true;
        }
    
}