import { CodeClassification } from "../models/CodeClassification";

export interface ResCodeData {
    data: ClsList;
}
interface ClsList {
    clsList: CodeClassification[];
}

export type TableModal = "ebm_sync_status" | "code_list" | "code_classification" | "item_classification" | "tax_payer_branch_information" | "list_notice" | "items_list" | "list_import_item" | "purchase_sales_transaction" | "list_stock_movement"

export type ENVIRONMENT = "sandbox" | "production" | "tomcat"

// Batching types and its Values
export const enum BATCHING_TYPE {
    FIRST_BATCH_SIZE = 5,
    SECOND_BATCH_SIZE = 10,
    LAST_BATCH_SIZE = 50
}