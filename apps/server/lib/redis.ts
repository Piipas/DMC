import { createClient } from "redis";

export const redisClient = createClient();

export const redisConnect = async () => {
  await redisClient.connect();
};
