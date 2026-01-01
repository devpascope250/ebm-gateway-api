"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportItemSaveRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class ImportItemSaveRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'list_import_item';
    }
    async create(data) {
        const sql = `INSERT INTO ${this.tableName} (tin,bhfId,taskCd,dclDe,itemSeq,hsCd,itemClCd,itemCd,imptItemsttsCd,remark,modrNm,modrId) VALUES (:tin,:bhfId,:taskCd,:dclDe,:itemSeq,:hsCd,:itemClCd,:itemCd,:imptItemsttsCd,:remark,:modrNm,:modrId)`;
        const result = await this.queryNamed(sql, data);
        return result.insertId;
    }
    async update(searchImportItem, payload, tx) {
        console.log(searchImportItem, payload);
        const query = `UPDATE ${this.tableName} SET itemClsCd = :itemClsCd,itemCd = :itemCd, imptItemSttsCd = :imptItemSttsCd WHERE tin = :tin AND bhfId = :bhfId AND id = :id`;
        if (tx) {
            await tx.queryNamed(query, { ...searchImportItem, ...payload });
        }
        else {
            await this.queryNamed(query, { ...searchImportItem, ...payload });
        }
        return true;
    }
}
exports.ImportItemSaveRepository = ImportItemSaveRepository;
