const axios = require('axios');
const he = require('he');

let quizzes = [];

async function fetchQuizzes() {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple');

    if (response.data.response_code === 0) {
      quizzes = response.data.results.map((question, index) => ({
        id: `quiz_${index + 1}`,
        name: `Quiz ${index + 1}`,
        questions: [{
          id: `q_${index}_0`,
          text: he.decode(question.question),
          options: shuffleArray([
            ...question.incorrect_answers.map(he.decode),
            he.decode(question.correct_answer)
          ]),
          correctAnswer: he.decode(question.correct_answer)
        }]
      }));
    } else {
      console.error('Failed to fetch quiz data from the API');
    }
  } catch (error) {
    console.error('Error fetching quiz data:', error);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getQuizzes() {
  return quizzes.map(quiz => ({ id: quiz.id, name: quiz.name }));
}

function getQuizById(id) {
  return quizzes.find(quiz => quiz.id === id);
}

// Initialize quizzes on module load
fetchQuizzes();

module.exports = { getQuizzes, getQuizById, fetchQuizzes };
