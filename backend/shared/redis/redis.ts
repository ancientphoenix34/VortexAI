import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
  console.log('redis connected');
});

redis.on('error', (err: any) => {
  console.error('Redis connection error:', err);
});

export default redis;
export { redis };
