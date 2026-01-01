import { CodeClassification, dtlList } from "../models/CodeClassification";
import { EbmSyncStatus } from "../models/EbmSyncStatus";
import { TableModal } from "../types/types";
import { BaseRepository, TransactionInterface } from "./BaseRepository";

export class CodeClassificationRepository extends BaseRepository {
  private tableName = 'code_classification';
  private subTable = 'code_list';
  private codeStatusTable = "ebm_sync_status";
  async getAllClassificationCode(): Promise<CodeClassification[]> {
    const sql = `SELECT * FROM ${this.tableName}`;
    const rows = await this.query<CodeClassification[]>(sql);
    return rows;
  }

  // get all code list

  async getAllCodeList(cdCls: string): Promise<dtlList[]> {
    const sql = `SELECT * FROM ${this.subTable} WHERE cdCls = :cdCls`;
    const rows = await this.queryNamed<dtlList[]>(sql, { cdCls });
    return rows;
  }

  async findAll(): Promise<CodeClassification[]> {
    const sql = `
      SELECT 
        cc.*,
        cl.id as detail_id,
        cl.cdCls as detail_cdCls,
        cl.useYn as detail_useYn,
        cl.cd as detail_cd,
        cl.cdNm as detail_cdNm,
        cl.cdDesc as detail_cdDesc,
        cl.srtOrd as detail_srtOrd,
        cl.userDfnCd1 as detail_userDfnCd1,
        cl.userDfnCd2 as detail_userDfnCd2,
        cl.userDfnCd3 as detail_userDfnCd3
      FROM ${this.tableName} cc
      LEFT JOIN ${this.subTable} cl ON cc.cdCls = cl.cdCls
      ORDER BY cc.cdCls, cl.srtOrd
    `;

    const rows = await this.query<any[]>(sql);
    // Group by code classification and aggregate details
    const grouped = rows.reduce((acc, row) => {
      const cdCls = row.cdCls;

      if (!acc[cdCls]) {
        // Create the main code classification object
        acc[cdCls] = {
          cdCls: row.cdCls,
          cdClsNm: row.cdClsNm,
          cdClsDesc: row.cdClsDesc,
          userDfnNm1: row.userDfnNm1,
          userDfnNm2: row.userDfnNm2,
          userDfnNm3: row.userDfnNm3,
          createdAt: row.createdAt,
          dtlList: []
        };
      }

      // Add detail if it exists (check if detail_id is not null)
      if (row.detail_id) {
        const detail: dtlList = {
          id: row.detail_id,
          cdCls: row.detail_cdCls,
          useYn: row.detail_useYn,
          cd: row.detail_cd,
          cdNm: row.detail_cdNm,
          cdDesc: row.detail_cdDesc,
          srtOrd: row.detail_srtOrd,
          userDfnCd1: row.detail_userDfnCd1,
          userDfnCd2: row.detail_userDfnCd2,
          userDfnCd3: row.detail_userDfnCd3
        };
        acc[cdCls].dtlList!.push(detail);
      }

      return acc;
    }, {} as { [key: string]: CodeClassification });

    return Object.values(grouped);
  }

  // find by cdCls

  async findByCdCls(cdCls: string): Promise<CodeClassification | null> {
    const sql = `
      SELECT 
        cc.*,
        cl.id as detail_id,
        cl.cdCls as detail_cdCls,
        cl.useYn as detail_useYn,
        cl.cd as detail_cd,
        cl.cdNm as detail_cdNm,
        cl.cdDesc as detail_cdDesc,
        cl.srtOrd as detail_srtOrd,
        cl.userDfnCd1 as detail_userDfnCd1,
        cl.userDfnCd2 as detail_userDfnCd2,
        cl.userDfnCd3 as detail_userDfnCd3
      FROM ${this.tableName} cc
      LEFT JOIN ${this.subTable} cl ON cc.cdCls = cl.cdCls
      WHERE cc.cdCls = :cdCls
      ORDER BY cc.cdCls, cl.srtOrd
          `
    const rows = await this.queryNamed<any[]>(sql, { cdCls });

    // Group by code classification and aggregate details
    const grouped = rows.reduce((acc, row) => {
      const cdCls = row.cdCls;

      if (!acc[cdCls]) {
        // Create the main code classification object
        acc[cdCls] = {
          cdCls: row.cdCls,
          cdClsNm: row.cdClsNm,
          cdClsDesc: row.cdClsDesc,
          userDfnNm1: row.userDfnNm1,
          userDfnNm2: row.userDfnNm2,
          userDfnNm3: row.userDfnNm3,
          createdAt: row.createdAt,
          dtlList: []
        };
      }

      // Add detail if it exists (check if detail_id is not null)
      if (row.detail_id) {
        const detail: dtlList = {
          id: row.detail_id,
          cdCls: row.detail_cdCls,
          useYn: row.detail_useYn,
          cd: row.detail_cd,
          cdNm: row.detail_cdNm,
          cdDesc: row.detail_cdDesc,
          srtOrd: row.detail_srtOrd,
          userDfnCd1: row.detail_userDfnCd1,
          userDfnCd2: row.detail_userDfnCd2,
          userDfnCd3: row.detail_userDfnCd3
        }
        acc[cdCls].dtlList!.push(detail);
      }

      return acc;
    }, {} as { [key: string]: CodeClassification });
    const result = Object.values(grouped) as CodeClassification[];
    return result.length > 0 ? result[0] : null;

  }

  // create method - optimized with ebm_sync_status outside the loop
  async create(ebmSync: EbmSyncStatus, entityName: TableModal, codeRes: CodeClassification[]): Promise<number[]> {
    const result = await this.transaction(async (tx: TransactionInterface) => {
      // Check if exists - FIXED THE SQL SYNTAX ERROR
      const checkExist = `SELECT * FROM ${this.codeStatusTable} WHERE entityName = :entityName`; // Removed the extra }
      const exist = await tx.queryNamed<EbmSyncStatus[]>(checkExist, { entityName });

      if (exist.length > 0) {
        const updateSql = `
          UPDATE ${this.codeStatusTable} 
          SET lastRequestDate = :lastRequestDate 
          WHERE entityName = :entityName`;
        await tx.queryNamed(updateSql, { entityName });
      } else {
        // Insert ebm_sync_status record ONCE, outside the loop
        const syncStatusSql = `
          INSERT INTO ${this.codeStatusTable} (lastRequestDate, entityName)
          VALUES (:lastRequestDate, :entityName)
        `;
        await tx.queryNamed(syncStatusSql, { ...ebmSync, entityName });
      }

      // Process all code classifications
      return await Promise.all(
        codeRes.map(async (code) => {
          // Insert main code classification
          const insertCodeSql = `
            INSERT INTO ${this.tableName} 
            (cdCls, cdClsNm, cdClsDesc, userDfnNm1, userDfnNm2, userDfnNm3) 
            VALUES (:cdCls, :cdClsNm, :cdClsDesc, :userDfnNm1, :userDfnNm2, :userDfnNm3)
          `;
          const insertedRows = await tx.queryNamed(insertCodeSql, code);
          // For MySQL, use insertId to get the last inserted ID
          const codeId = (insertedRows as any).insertId;

          // Insert details if exists
          if (code.dtlList && code.dtlList.length > 0) {
            await Promise.all(
              code.dtlList.map(async (dtl) => {
                // check if exists
                const checkDtlExist = `SELECT * FROM ${this.subTable} WHERE cdCls = :cdCls AND cd = :cd`;
                const dtlExist = await tx.queryNamed<CodeClassification[]>(checkDtlExist, { cdCls: code.cdCls, cd: dtl.cd });
                // if not exists, insert with cdCls
                if (dtlExist.length === 0) {
                  const insertDtlSql = `
                    INSERT INTO ${this.subTable} 
                    (cdCls, cd, cdNm, cdDesc, useYn, srtOrd, userDfnCd1, userDfnCd2, userDfnCd3) 
                    VALUES (:cdCls, :cd, :cdNm, :cdDesc, :useYn, :srtOrd, :userDfnCd1, :userDfnCd2, :userDfnCd3)
                  `;
                  dtl.cdCls = code.cdCls;
                  await tx.queryNamed(insertDtlSql, dtl);
                }
              })
            );
          }
          return codeId;
        })
      );
    });

    return result;
  }

  async findOne(cdCls: string): Promise<CodeClassification | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE cdCls = :cdCls`;
    const results = await this.queryNamed<CodeClassification[]>(sql, { cdCls: cdCls });
    return results.length > 0 ? results[0] : null;
  }

  // find by itemClsNm
  async findByCdClsNm(cdClsNm: string, query?: string): Promise<dtlList[] | []> {
    if (!query) {
      const sql = `SELECT * FROM ${this.subTable} RIGHT JOIN ${this.tableName} ON ${this.subTable}.cdCls = ${this.tableName}.cdCls WHERE ${this.tableName}.cdClsNm = :cdClsNm LIMIT 20`;
      const results = await this.queryNamed<dtlList[]>(sql, { cdClsNm });
      const freshData: dtlList[] = results.map((data) => {
        return {
          id: data.id,
          cd: data.cd,
          cdNm: data.cdNm,
          cdCls: data.cdCls,
          cdDesc: data.cdDesc,
          srtOrd: data.srtOrd,
          useYn: data.useYn,
          userDfnCd1: data.userDfnCd1,
          userDfnCd2: data.userDfnCd2,
          userDfnCd3: data.userDfnCd3,
        }
      })
      return freshData.length > 0 ? freshData : [];
    } else {
      const sql = `SELECT * FROM ${this.subTable} RIGHT JOIN ${this.tableName} ON ${this.subTable}.cdCls = ${this.tableName}.cdCls WHERE ${this.tableName}.cdClsNm = :cdClsNm AND ${this.subTable}.cdNm LIKE :query LIMIT 20`;
      const results = await this.queryNamed<dtlList[]>(sql, { cdClsNm, query: `%${query}%` });
      const freshData: dtlList[] = results.map((data) => {
        return {
          id: data.id,
          cd: data.cd,
          cdNm: data.cdNm,
          cdCls: data.cdCls,
          cdDesc: data.cdDesc,
          srtOrd: data.srtOrd,
          useYn: data.useYn,
          userDfnCd1: data.userDfnCd1,
          userDfnCd2: data.userDfnCd2,
          userDfnCd3: data.userDfnCd3,
        }
      })
      return freshData.length > 0 ? freshData : [];
    }
  }
}