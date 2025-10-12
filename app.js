class SpiritualJourneyApp {
    constructor() {
        this.data = {
            dailyActivities: {},
            sessions: [],
            prayerList: [],
            stats: {
                totalPoints: 0,
                streakDays: 0,
                lastActiveDate: null
            }
        };
        this.currentDate = this.getTodayDate();
        this.init();
    }

    init() {
        this.loadData();
        this.updateDisplay();
        this.setupEventListeners();
        this.calculateStreak();
        this.displayCurrentDate();
    }

    getTodayDate() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    displayCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date().toLocaleDateString('en-US', options);
        dateElement.textContent = formattedDate;
    }

    setupEventListeners() {
        // Activity checkboxes
        document.getElementById('bibleChapters').addEventListener('change', (e) => {
            const chapterInputDiv = document.getElementById('chapterInputDiv');
            chapterInputDiv.style.display = e.target.checked ? 'flex' : 'none';
            if (!e.target.checked) {
                this.updateDailyActivity('bibleChapters', false);
            }
        });

        document.getElementById('dailyLesson').addEventListener('change', (e) => {
            this.updateDailyActivity('dailyLesson', e.target.checked);
        });

        document.getElementById('devotional').addEventListener('change', (e) => {
            this.updateDailyActivity('devotional', e.target.checked);
        });

        // File input for import
        document.getElementById('fileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        this.data = JSON.parse(event.target.result);
                        this.saveData();
                        this.updateDisplay();
                        alert('Data imported successfully!');
                    } catch (error) {
                        alert('Error importing data: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    updateDailyActivity(activity, checked) {
        if (!this.data.dailyActivities[this.currentDate]) {
            this.data.dailyActivities[this.currentDate] = {
                bibleChapters: false,
                chapters: [],
                dailyLesson: false,
                devotional: false
            };
        }
        
        this.data.dailyActivities[this.currentDate][activity] = checked;
        this.saveData();
        this.updateProgress();
    }

    saveChapters() {
        const chaptersInput = document.getElementById('chaptersRead');
        const chapters = chaptersInput.value.trim();
        
        if (!chapters) {
            alert('Please enter the chapters you read');
            return;
        }

        if (!this.data.dailyActivities[this.currentDate]) {
            this.data.dailyActivities[this.currentDate] = {
                bibleChapters: false,
                chapters: [],
                dailyLesson: false,
                devotional: false
            };
        }

        this.data.dailyActivities[this.currentDate].chapters.push({
            text: chapters,
            time: new Date().toLocaleTimeString()
        });
        this.data.dailyActivities[this.currentDate].bibleChapters = true;
        
        chaptersInput.value = '';
        this.saveData();
        this.displayChapters();
        this.updateProgress();
    }

    displayChapters() {
        const chaptersList = document.getElementById('chaptersList');
        chaptersList.innerHTML = '';

        if (!this.data.dailyActivities[this.currentDate] || 
            !this.data.dailyActivities[this.currentDate].chapters) {
            return;
        }

        this.data.dailyActivities[this.currentDate].chapters.forEach((chapter, index) => {
            const tag = document.createElement('div');
            tag.className = 'chapter-tag';
            tag.innerHTML = `
                ${chapter.text} <small>(${chapter.time})</small>
                <button onclick="app.removeChapter(${index})">×</button>
            `;
            chaptersList.appendChild(tag);
        });
    }

    removeChapter(index) {
        if (this.data.dailyActivities[this.currentDate]) {
            this.data.dailyActivities[this.currentDate].chapters.splice(index, 1);
            
            if (this.data.dailyActivities[this.currentDate].chapters.length === 0) {
                this.data.dailyActivities[this.currentDate].bibleChapters = false;
                document.getElementById('bibleChapters').checked = false;
                document.getElementById('chapterInputDiv').style.display = 'none';
            }
            
            this.saveData();
            this.displayChapters();
            this.updateProgress();
        }
    }

    addPrayerSession() {
        const now = new Date();
        const hours = now.getHours();
        const isMorning = hours >= 4 && hours < 10;
        const points = isMorning ? 15 : 10;

        const session = {
            type: 'prayer',
            date: this.currentDate,
            time: now.toLocaleTimeString(),
            timestamp: now.toISOString(),
            isMorning,
            points
        };

        this.data.sessions.push(session);
        this.data.stats.totalPoints += points;
        this.saveData();
        this.displaySessions();
        this.updateProgress();
    }

    addBibleStudySession() {
        const now = new Date();
        const hours = now.getHours();
        const isMorning = hours >= 4 && hours < 10;
        const points = isMorning ? 20 : 15;

        const session = {
            type: 'study',
            date: this.currentDate,
            time: now.toLocaleTimeString(),
            timestamp: now.toISOString(),
            isMorning,
            points
        };

        this.data.sessions.push(session);
        this.data.stats.totalPoints += points;
        this.saveData();
        this.displaySessions();
        this.updateProgress();
    }

    displaySessions() {
        const sessionsList = document.getElementById('sessionsList');
        sessionsList.innerHTML = '';

        // Filter today's sessions
        const todaySessions = this.data.sessions.filter(s => s.date === this.currentDate);

        if (todaySessions.length === 0) {
            sessionsList.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No sessions recorded today. Add your first prayer or study session!</p>';
            return;
        }

        todaySessions.forEach((session, index) => {
            const div = document.createElement('div');
            div.className = 'session-item' + (session.isMorning ? ' morning-bonus' : '');
            
            const typeIcon = session.type === 'prayer' ? '🙏' : '📖';
            const typeName = session.type === 'prayer' ? 'Prayer' : 'Bible Study';
            
            div.innerHTML = `
                <div class="session-info">
                    <div class="session-type">${typeIcon} ${typeName}</div>
                    <div class="session-time">${session.time}</div>
                    ${session.isMorning ? '<span class="morning-badge">⭐ Morning Bonus</span>' : ''}
                </div>
                <div class="session-points">+${session.points} pts</div>
            `;
            sessionsList.appendChild(div);
        });
    }

    addPrayerRequest() {
        const input = document.getElementById('prayerRequest');
        const text = input.value.trim();

        if (!text) {
            alert('Please enter a prayer request');
            return;
        }

        const prayer = {
            id: Date.now(),
            text,
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString(),
            answered: false
        };

        this.data.prayerList.push(prayer);
        input.value = '';
        this.saveData();
        this.displayPrayerList();
        this.updateProgress();
    }

    displayPrayerList() {
        const prayerList = document.getElementById('prayerList');
        prayerList.innerHTML = '';

        if (this.data.prayerList.length === 0) {
            prayerList.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No prayer requests yet. Add your first prayer request!</p>';
            return;
        }

        // Sort by answered status (unanswered first)
        const sortedPrayers = [...this.data.prayerList].sort((a, b) => a.answered - b.answered);

        sortedPrayers.forEach(prayer => {
            const div = document.createElement('div');
            div.className = 'prayer-item' + (prayer.answered ? ' answered' : '');
            
            div.innerHTML = `
                <div class="prayer-content">
                    <div class="prayer-text">${prayer.answered ? '✅ ' : ''}${prayer.text}</div>
                    <div class="prayer-date">Added: ${prayer.date}</div>
                </div>
                <div class="prayer-actions">
                    ${!prayer.answered ? 
                        `<button class="btn-answer" onclick="app.markAnswered(${prayer.id})">Mark Answered</button>` : 
                        '<span style="color: var(--success-color); font-weight: bold;">Answered! 🙌</span>'
                    }
                    <button class="btn-delete" onclick="app.deletePrayer(${prayer.id})">Delete</button>
                </div>
            `;
            prayerList.appendChild(div);
        });
    }

    markAnswered(prayerId) {
        const prayer = this.data.prayerList.find(p => p.id === prayerId);
        if (prayer) {
            prayer.answered = true;
            prayer.answeredDate = new Date().toLocaleDateString();
            this.saveData();
            this.displayPrayerList();
            this.updateProgress();
        }
    }

    deletePrayer(prayerId) {
        if (confirm('Are you sure you want to delete this prayer request?')) {
            this.data.prayerList = this.data.prayerList.filter(p => p.id !== prayerId);
            this.saveData();
            this.displayPrayerList();
            this.updateProgress();
        }
    }

    calculateStreak() {
        const dates = Object.keys(this.data.dailyActivities).sort().reverse();
        let streak = 0;
        const today = this.getTodayDate();

        for (let i = 0; i < dates.length; i++) {
            const date = dates[i];
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];

            if (date === expectedDateStr) {
                const activities = this.data.dailyActivities[date];
                // Count as streak day if at least one activity is completed
                if (activities.bibleChapters || activities.dailyLesson || activities.devotional) {
                    streak++;
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        this.data.stats.streakDays = streak;
        this.data.stats.lastActiveDate = today;
    }

    updateProgress() {
        // Calculate today's activity completion
        const today = this.data.dailyActivities[this.currentDate] || {
            bibleChapters: false,
            dailyLesson: false,
            devotional: false
        };

        const totalActivities = 3;
        const completedActivities = 
            (today.bibleChapters ? 1 : 0) +
            (today.dailyLesson ? 1 : 0) +
            (today.devotional ? 1 : 0);

        const percentage = Math.round((completedActivities / totalActivities) * 100);

        // Update UI
        document.getElementById('totalPoints').textContent = this.data.stats.totalPoints;
        document.getElementById('streakDays').textContent = this.data.stats.streakDays;
        
        const answeredCount = this.data.prayerList.filter(p => p.answered).length;
        document.getElementById('prayersAnswered').textContent = answeredCount;

        const progressFill = document.getElementById('activitiesProgress');
        progressFill.style.width = percentage + '%';
        document.getElementById('activitiesPercent').textContent = percentage + '%';
    }

    updateDisplay() {
        // Load today's activities
        const today = this.data.dailyActivities[this.currentDate];
        if (today) {
            document.getElementById('bibleChapters').checked = today.bibleChapters || false;
            document.getElementById('dailyLesson').checked = today.dailyLesson || false;
            document.getElementById('devotional').checked = today.devotional || false;
            
            if (today.bibleChapters) {
                document.getElementById('chapterInputDiv').style.display = 'flex';
            }
        }

        this.displayChapters();
        this.displaySessions();
        this.displayPrayerList();
        this.updateProgress();
    }

    saveData() {
        try {
            localStorage.setItem('spiritualJourneyData', JSON.stringify(this.data));
            this.calculateStreak();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    loadData() {
        try {
            const saved = localStorage.getItem('spiritualJourneyData');
            if (saved) {
                this.data = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `spiritual-journey-${this.currentDate}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('Data exported successfully!');
    }

    importData() {
        document.getElementById('fileInput').click();
    }
}

// Initialize the app
const app = new SpiritualJourneyApp();
