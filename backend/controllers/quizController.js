const db = require('../config/db');

// Save Quiz Data and Update Visit Count
exports.saveQuizData = (req, res) => {
    const { selectedLanguage, answers } = req.body;

    const insertQuery = 'INSERT INTO quiz_responses (selectedLanguage, answers) VALUES (?, ?)';
    db.query(insertQuery, [selectedLanguage, JSON.stringify(answers)], (err, _results) => {
        if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({ error: "Failed to save quiz data" });
        }
        res.status(201).json({ message: "Quiz data saved successfully!" });
    });
};

// Get Total Visit Count from Latest Row
exports.getTotalVisits = (req, res) => {
    db.query('SELECT count(*) FROM quiz_responses', (err, results) => {
        if (err) {
            console.error("Fetch error:", err);
            return res.status(500).json({ error: "Failed to fetch total visits" });
        }
        const totalVisits = results[0]['count(*)'];
        res.json({ totalVisits });
    });
};
