const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'DataOutput', 'data.json');

// Rate limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

const staticLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Higher limit for static files
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(express.json());

// Serve only specific static files (not the entire directory)
app.get('/', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/styles.css', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/app.js', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'app.js'));
});

// Ensure DataOutput directory exists
if (!fs.existsSync(path.join(__dirname, 'DataOutput'))) {
    fs.mkdirSync(path.join(__dirname, 'DataOutput'), { recursive: true });
}

// API endpoint to load data
app.get('/api/data', apiLimiter, (req, res) => {
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
app.post('/api/data', apiLimiter, (req, res) => {
    try {
        const data = req.body;
        
        // Validate request body structure
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Invalid data format' });
        }
        
        // Validate required fields
        if (!data.dailyActivities || !data.sessions || !data.prayerList || !data.stats) {
            return res.status(400).json({ error: 'Missing required data fields' });
        }
        
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
