const { getRedisClient } = require('./redis');

async function updateLeaderboard(io, quizId) {
  const redis = getRedisClient();
  const scores = await redis.hgetall(`quiz:${quizId}:scores`);
  const leaderboard = Object.entries(scores)
    .map(([userId, score]) => ({ userId, score: parseInt(score) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  io.to(quizId).emit('leaderboardUpdate', leaderboard);
}

module.exports = { updateLeaderboard };
