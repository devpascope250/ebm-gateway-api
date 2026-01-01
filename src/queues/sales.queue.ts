import { Queue } from "bullmq";
import redisCache from "../utils/redisCache";
import Redis from "ioredis";

const salesQueue = new Queue("saveSales", {
    connection: redisCache["client"] as Redis,
    defaultJobOptions: {
        removeOnComplete: true,  // automatically delete completed jobs
        removeOnFail: false, // keep failed jobs in the queue
        attempts: 3, // retry failed jobs 3 times
        backoff: {
            type: "exponential",
            delay: 5000
        }
    }
});


export default salesQueue;
