const Redis = require('ioredis');

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL || `localhost:6379/1`);
  }
  return redisClient;
}

module.exports = { getRedisClient };