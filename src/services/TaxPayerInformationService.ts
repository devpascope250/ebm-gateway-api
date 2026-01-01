import { TaxPayerInformation } from "../models/TaxPayerInformation";
import { TaxPayerInformationRepository } from "../repositories/TaxPayerInformationRepository";
import { ResultData } from "../types/data";
import { UrlPath } from "../utils/UrlPath";
import { ApiServices } from "./ApiServices";

export class TaxPayerInformationService extends ApiServices {
  private instance: TaxPayerInformationRepository;
  private tin: string;
  private bhfId: string;
  private custmTin: string;
  constructor(tin: string, bhfId: string, custmTin: string) {
    super();
    this.instance = new TaxPayerInformationRepository();
    this.tin = tin;
    this.bhfId = bhfId;
    this.custmTin = custmTin;
  }

  async getAllTaxPayers(): Promise<TaxPayerInformation[]> {
    return await this.instance.findAll(); 
  }

  // findOnebyTin
  async findOneByTin(): Promise<TaxPayerInformation | null> {
    // check if tin exists
    const existed  =  await this.instance.getTaxPayerByTin(this.tin);
    if(!existed) {
        const loadTaxPayer = await this.fetch(UrlPath.SELECT_CUSTOMER, "POST", 
            {tin: this.tin, bhfId: this.bhfId, custmTin: this.custmTin}
        );
        if((loadTaxPayer as ResultData).resultCd === "000"){
          const result = loadTaxPayer.data.custList;
          if(result.length > 0){
            await this.instance.createTaxPayerInformation(result[0]);
          }
        }
    }
    return await this.instance.getTaxPayerByTin(this.tin);
  }
}