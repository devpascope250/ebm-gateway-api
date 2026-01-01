import { Worker } from "bullmq";
import redisCache from "../utils/redisCache";
import Redis from "ioredis";
import { ApiServices } from "../services/ApiServices";
import { UrlPath } from "../utils/UrlPath";
import { SalesTransactionRepository } from "../repositories/SalesTransactionRepository";
import { CacheNamespace } from "../types/cachesNameSpace";
const apiservice = new (class extends ApiServices {})();
const salesTransactionRepository = new SalesTransactionRepository();

export const salesWorker = new Worker(
  "saveSales",
  async job => {
    const { sale, payload } = job.data;
    const [namespace, key] = CacheNamespace.lockWithIdempotency.getSalesIdempotencyKey(payload.tin, payload.bhfId, sale.invcNo);
    console.log("Processing job", job.id);
    const lockKey = await redisCache.acquireLock(namespace, key, 300);
    if(!lockKey) {
      return {
        skipped: true,
        reason: "Duplicate request"
      }
    }
    try{

    const status = await apiservice.fetch(
      UrlPath.SAVE_SALES,
      "POST",
      sale
    );

    status.data.mrcNo = payload.mrc_code ?? status.data.mrcNo;

    if (status.resultCd === "000") {
      await salesTransactionRepository.createWithTransaction({
        ...sale,
        tin: payload.tin,
        bhfId: payload.bhfId,
        response: status.data,
      });
      return status;
    }

    throw status;
} catch (error) {
    console.error("Error processing job:", error);
    await redisCache.releaseLock(namespace, key);
    throw error;
}
  },
  {
    connection: redisCache["client"] as Redis,
    concurrency: 4,
  }
);

salesWorker.on("completed", job => {
  console.log("Job completed:", job.id);
});

salesWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});
