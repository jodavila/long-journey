const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'DataOutput', 'data.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Ensure DataOutput directory exists
if (!fs.existsSync(path.join(__dirname, 'DataOutput'))) {
    fs.mkdirSync(path.join(__dirname, 'DataOutput'), { recursive: true });
}

// API endpoint to load data
app.get('/api/data', (req, res) => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // Return default empty data structure
            res.json({
                dailyActivities: {},
                sessions: [],
                prayerList: [],
                stats: {
                    totalPoints: 0,
                    streakDays: 0,
                    lastActiveDate: null
                }
            });
        }
    } catch (error) {
        console.error('Error loading data:', error);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// API endpoint to save data
app.post('/api/data', (req, res) => {
    try {
        const data = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Long Journey app running at http://localhost:${PORT}`);
    console.log(`Data will be saved to: ${DATA_FILE}`);
});
