"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockInOutSaveRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class StockInOutSaveRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'stock_in_out_save';
    }
    async create(stock) {
        const query = `INSERT INTO ${this.tableName} 
        (
        tin,
bhfId,
sarNo,
orgSarNo,
regTyCd,
custTin,
custNm,
custBhfId,
sarTyCd,
ocrnDt,
totItemCnt,
totTaxblAmt,
totTaxAmt,
totAmt,
remark,
regrNm,
regrId,
modrNm,
modrId,
itemSeq,
itemCd,
itemClsCd,
itemNm,
bcd,
pkgUnitCd,
pkg,
qtyUnitCd,
qty,
itemExprDt,
prc,
splyAmt,
totDcAmt,
taxblAmt,
taxTyCd,
taxAmt)
VALUES (
:tin,
:bhfId,
:sarNo,
:orgSarNo,
:regTyCd,
:custTin,
:custNm,
:custBhfId,
:sarTyCd,
:ocrnDt,
:totItemCnt,
:totTaxblAmt,
:totTaxAmt,
:totAmt,
:remark,
:regrNm,
:regrId,
:modrNm,
:modrId,
:itemSeq,
:itemCd,
:itemClsCd,
:itemNm,
:bcd,
:pkgUnitCd,
:pkg,
:qtyUnitCd,
:qty,
:itemExprDt,
:prc,
:splyAmt,
:totDcAmt,
:taxblAmt,
:taxTyCd,
:taxAmt
)`;
        const result = await this.queryNamed(query, stock);
        return result.id;
    }
}
exports.StockInOutSaveRepository = StockInOutSaveRepository;
