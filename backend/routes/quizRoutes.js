const express = require('express');
const { saveQuizData, getTotalVisits } = require('../controllers/quizController');

const router = express.Router();

// Save Quiz Data (includes visit count)
router.post('/save-quiz-data', saveQuizData);

// Get Total Visits
router.get('/total-visits', getTotalVisits);

module.exports = router;
