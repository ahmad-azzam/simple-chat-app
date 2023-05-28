import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL as string;
const token = process.env.UPSTASH_REDIS_REST_TOKEN as string;

export const db = new Redis({
  url,
  token,
});
