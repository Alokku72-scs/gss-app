const db = require('../config/db');

// Save Quiz Data and Update Visit Count
exports.saveQuizData = (req, res) => {
    const { selectedLanguage, answers } = req.body;

    // Get latest visit count
    db.query('SELECT count FROM quiz_responses ORDER BY id DESC LIMIT 1', (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch visit count" });
        }

        let newCount = results.length > 0 && results[0].count !== null ? results[0].count + 1 : 1;

        // Insert new quiz response with updated count
        const insertQuery = 'INSERT INTO quiz_responses (selectedLanguage, answers, count) VALUES (?, ?, ?)';
        db.query(insertQuery, [selectedLanguage, JSON.stringify(answers), newCount], (err, results) => {
            if (err) {
                console.error("Insert error:", err);
                return res.status(500).json({ error: "Failed to save quiz data" });
            }
            res.status(201).json({ message: "Quiz data saved successfully!", newCount });
        });
    });
};

// Get Total Visit Count from Latest Row
exports.getTotalVisits = (req, res) => {
    db.query('SELECT count FROM quiz_responses ORDER BY id DESC LIMIT 1', (err, results) => {
        if (err) {
            console.error("Fetch error:", err);
            return res.status(500).json({ error: "Failed to fetch total visits" });
        }

        const totalVisits = results.length > 0 && results[0].count !== null ? results[0].count : 0;
        res.json({ totalVisits });
    });
};
