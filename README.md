# Long Journey - Spiritual Tracker 🙏

A beautiful and interactive web application to track your daily spiritual journey, including Bible study, prayers, devotionals, and more. Built with pure HTML, CSS, and JavaScript - no frameworks needed!

![Long Journey App Screenshot](https://github.com/user-attachments/assets/28d196b6-6dc6-46f3-85d4-02064b9f8a89)

## ✨ Features

### 📖 Daily Activities Tracking
- **Bible Chapters Read**: Track which chapters of the Bible you've studied each day
  - Add multiple chapters throughout the day
  - Each entry is timestamped
  - Visual tags show your reading history
- **Daily Lessons Completed**: Mark when you've completed your daily lessons
- **Devotional Read**: Track your daily devotional reading

### ⏰ Prayer & Study Sessions
- **Add Prayer Sessions**: Log multiple prayer times throughout the day
- **Add Bible Study Sessions**: Track your Bible study sessions
- **Morning Communion Bonus**: Sessions between 4 AM - 10 AM earn bonus points!
  - Morning prayers: 15 points (vs. 10 points regular)
  - Morning Bible study: 20 points (vs. 15 points regular)
  - Special visual indicator for morning sessions

### 🙌 Prayer List Management
- **Add Prayer Requests**: Create a personal prayer list
- **Track Answered Prayers**: Mark prayers as answered with a simple click
- **Visual Organization**: Answered prayers are highlighted and moved to the bottom
- **Date Tracking**: See when each prayer was added and answered
- **Delete Function**: Remove prayers when no longer needed

### 📊 Progress Tracking
- **Total Points**: Accumulate points for all your spiritual activities
- **Day Streak**: See how many consecutive days you've been active
- **Prayers Answered Counter**: Track how many prayers have been answered
- **Activities Completion Progress Bar**: Visual representation of daily activity completion

### 💾 Data Management
- **Auto-Save**: All data is automatically saved to browser's localStorage
- **Export to JSON**: Download your complete spiritual journey data as a JSON file
- **Import from JSON**: Restore your data from a previously exported file
- **Persistent Storage**: Your data stays safe even after closing the browser

## 🚀 Getting Started

### Option 1: Open Directly
Simply open the `index.html` file in any modern web browser. No server required!

### Option 2: Local Server
For the best experience, serve the files using a local web server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (if you have http-server installed)
npx http-server -p 8080

# Then open http://localhost:8080 in your browser
```

## 📱 Usage

1. **Track Daily Activities**
   - Check off activities as you complete them
   - For Bible chapters, click the checkbox and enter the chapters you read
   - Add multiple chapter entries throughout the day

2. **Log Prayer & Study Sessions**
   - Click "➕ Add Prayer" or "➕ Add Bible Study" buttons
   - Sessions are automatically timestamped
   - Morning sessions (4 AM - 10 AM) earn bonus points

3. **Manage Your Prayer List**
   - Enter a prayer request in the text field
   - Click "Add Prayer" to add it to your list
   - Click "Mark Answered" when a prayer is answered
   - Click "Delete" to remove a prayer

4. **Monitor Your Progress**
   - View your total points, streak days, and answered prayers
   - Check the completion percentage of daily activities
   - Stay motivated with visual progress indicators

5. **Backup Your Data**
   - Click "💾 Export Data" to download a JSON backup
   - Click "📂 Import Data" to restore from a backup file

## 🎨 Design Features

- **Dual Vibrations Theme**: Beautiful gradient animations create an engaging spiritual atmosphere
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Theme**: Easy on the eyes with a modern dark color scheme
- **Visual Feedback**: Smooth animations and transitions for all interactions
- **Emoji Icons**: Friendly emoji icons make the interface intuitive and welcoming

## 🔒 Privacy

All your data is stored locally in your browser's localStorage. Nothing is sent to any server - your spiritual journey remains completely private and personal.

## 🌟 Tips

- **Build a Streak**: Try to complete at least one activity every day to build your streak!
- **Morning Devotion**: Take advantage of the morning bonus by doing your devotions between 4 AM and 10 AM
- **Regular Backups**: Export your data regularly to keep a backup of your spiritual journey
- **Prayer Journal**: Use the prayer list as a journal to see how God answers your prayers over time

## 🛠️ Technical Details

- **Pure JavaScript**: No frameworks or dependencies required
- **Browser Storage**: Uses localStorage API for data persistence
- **JSON Format**: All data stored in clean, readable JSON format
- **Modern CSS**: Utilizes CSS Grid, Flexbox, and CSS Variables
- **Accessible**: Semantic HTML with proper ARIA labels

## 📄 Data Structure

Your data is stored in the following JSON format:

```json
{
  "dailyActivities": {
    "2025-10-12": {
      "bibleChapters": true,
      "chapters": [{"text": "John 3", "time": "10:00 AM"}],
      "dailyLesson": true,
      "devotional": true
    }
  },
  "sessions": [
    {
      "type": "prayer",
      "date": "2025-10-12",
      "time": "10:00 AM",
      "isMorning": true,
      "points": 15
    }
  ],
  "prayerList": [
    {
      "id": 123456789,
      "text": "Prayer request text",
      "date": "10/12/2025",
      "answered": false
    }
  ],
  "stats": {
    "totalPoints": 25,
    "streakDays": 1,
    "lastActiveDate": "2025-10-12"
  }
}
```

## 🤝 Contributing

Feel free to fork this project and customize it for your own spiritual journey tracking needs!

## 📜 License

This project is open source and available for personal use.

---

**Built with ❤️ for your spiritual growth journey**