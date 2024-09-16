const { getQuizzes, getQuizById } = require('./quizData');
const { updateLeaderboard } = require('./leaderboard');
const { getRedisClient } = require('./redis');

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('setUsername', (username) => {
      socket.username = username;
      console.log(`Username set: ${username}`);
    });

    socket.on('getQuizzes', () => {
      const quizList = getQuizzes();
      socket.emit('quizList', quizList);
    });

    socket.on('joinQuiz', async (quizId) => {
      const quiz = getQuizById(quizId);
      if (quiz) {
        socket.join(quizId);
        socket.emit('quizData', quiz);
        await updateLeaderboard(io, quizId);
      } else {
        socket.emit('error', 'Quiz not found');
      }
    });

    socket.on('submitAnswer', async ({ quizId, questionId, answer }) => {
      const quiz = getQuizById(quizId);
      const question = quiz?.questions.find(q => q.id === questionId);
      
      if (question && answer === question.correctAnswer) {
        const redis = getRedisClient();
        const score = await redis.hincrby(`quiz:${quizId}:scores`, socket.username || socket.id, 1);
        socket.emit('scoreUpdate', score);
        await updateLeaderboard(io, quizId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}

module.exports = setupSocketHandlers;