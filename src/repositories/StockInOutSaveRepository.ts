import { StockInOutSave } from "../models/StockInOutSave";
import { BaseRepository } from "./BaseRepository";

export class StockInOutSaveRepository extends BaseRepository {
    private tableName = 'stock_in_out_save';


    async create(stock: StockInOutSave): Promise<number> {
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

        const result = await this.queryNamed<{ id: number }>(query, stock);
        return result.id;
    }
}