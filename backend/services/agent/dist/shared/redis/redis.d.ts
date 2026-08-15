import { Redis } from 'ioredis';
declare const redis: Redis<"legacy">;
export default redis;
export { redis };
