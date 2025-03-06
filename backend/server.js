require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const connection = require('./config/db'); // Import the database connection


const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes'); // Import quiz routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/quiz',quizRoutes);

app.get('/', (req, res) => {
    res.send('Server is running and database connection is initialized.');
  });

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
