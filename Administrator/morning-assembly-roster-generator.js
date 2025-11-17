// Enhanced Main JavaScript functionality for Morning Assembly Roster Generator

class RosterGenerator {
    constructor() {
        this.activities = [];
        this.templates = [];
        this.currentRoster = null;
        this.collaborators = [];
        this.isCollaborationActive = false;
        this.init();
    }

    init() {
        this.setDefaultDate();
        this.loadTemplates();
        this.loadActivities();
        this.setupEventListeners();
        this.setupCollaboration();
        this.updatePreview();
        this.checkURLParameters();
    }

    checkURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const rosterData = urlParams.get('roster');
        
        if (rosterData) {
            try {
                const decodedData = JSON.parse(atob(rosterData));
                this.loadSharedRoster(decodedData);
                this.showNotification('Shared roster loaded successfully!', 'success');
            } catch (error) {
                console.error('Error loading shared roster:', error);
            }
        }
    }

    loadSharedRoster(rosterData) {
        if (rosterData.schoolName) document.getElementById('schoolName').value = rosterData.schoolName;
        if (rosterData.date) document.getElementById('date').value = rosterData.date;
        if (rosterData.theme) document.getElementById('theme').value = rosterData.theme;
        if (rosterData.grade) document.getElementById('gradeSelect').value = rosterData.grade;
        if (rosterData.totalTime) document.getElementById('totalTime').value = rosterData.totalTime;
        if (rosterData.language) document.getElementById('language').value = rosterData.language;
        if (rosterData.activities) {
            this.activities = rosterData.activities;
            this.renderActivities();
            this.updatePreview();
        }
    }

    setDefaultDate() {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        document.getElementById('date').value = formattedDate;
    }

    loadTemplates() {
        const savedTemplates = localStorage.getItem('assemblyTemplates');
        if (savedTemplates) {
            this.templates = JSON.parse(savedTemplates);
        } else {
            this.templates = this.getDefaultTemplates();
            this.saveTemplates();
        }
    }

    getDefaultTemplates() {
        return [
            {
                id: 1,
                name: "Standard Morning Assembly",
                description: "Basic assembly structure with essential elements",
                activities: this.getDefaultActivities(),
                totalTime: 45,
                theme: "General Assembly"
            },
            {
                id: 2,
                name: "Islamic Theme Assembly",
                description: "Focus on Islamic values and teachings",
                activities: this.getIslamicActivities(),
                totalTime: 50,
                theme: "Islamic Values"
            },
            {
                id: 3,
                name: "National Day Assembly",
                description: "Special assembly for Pakistani national days",
                activities: this.getNationalDayActivities(),
                totalTime: 60,
                theme: "Patriotism and National Pride"
            }
        ];
    }

    getDefaultActivities() {
        return [
            { order: 1, name: "Call to Order & Assembly Formation", leadBy: "Head Boy / Head Girl", time: "3 min", description: "Students line up in an orderly manner" },
            { order: 2, name: "Recitation from the Holy Quran", leadBy: "Student with good Tajweed", time: "4 min", description: "Selected verses with translation" },
            { order: 3, name: "Naat-e-Rasool-e-Maqbool (S.A.W)", leadBy: "School Naat Khawan", time: "3 min", description: "Traditional Islamic poetry praising the Prophet" },
            { order: 4, name: "Pakistani National Anthem", leadBy: "Whole Assembly", time: "1 min", description: "Standing in attention position" },
            { order: 5, name: "School Pledge & Thought for the Day", leadBy: "Captain of a House", time: "3 min", description: "Inspiring message for students" },
            { order: 6, name: "Hadith of the Day", leadBy: "Islamic Studies Teacher", time: "3 min", description: "Teaching from Prophet Muhammad (PBUH)" },
            { order: 7, name: "Advice of the Day", leadBy: "Principal / Vice Principal", time: "4 min", description: "Motivational speech for students" },
            { order: 8, name: "Short Speech on Theme", leadBy: "Head of Department", time: "5 min", description: "Detailed explanation of the assembly theme" },
            { order: 9, name: "Special Presentation", leadBy: "Student Club", time: "7 min", description: "Student-led presentation" },
            { order: 10, name: "Announcements & Upcoming Events", leadBy: "Student Council President", time: "3 min", description: "Important school announcements" },
            { order: 11, name: "Dua (Prayer) for Knowledge", leadBy: "School Prefect", time: "2 min", description: "Closing prayer for the assembly" },
            { order: 12, name: "Dismissal to Classes", leadBy: "Class Teachers", time: "2 min", description: "Orderly return to classrooms" }
        ];
    }

    getIslamicActivities() {
        return [
            { order: 1, name: "Quran Recitation with Translation", leadBy: "Quran Teacher", time: "5 min", description: "Detailed recitation with meaning" },
            { order: 2, name: "Naat Sharif", leadBy: "School Naat Group", time: "4 min", description: "Group performance of Naat" },
            { order: 3, name: "Islamic Story", leadBy: "Storyteller Student", time: "5 min", description: "Inspiring story from Islamic history" },
            { order: 4, name: "Hadith Explanation", leadBy: "Islamic Studies Teacher", time: "6 min", description: "Detailed explanation of selected Hadith" },
            { order: 5, name: "Islamic Quiz", leadBy: "Quiz Master", time: "8 min", description: "Interactive quiz about Islam" },
            { order: 6, name: "Nasheed Performance", leadBy: "Music Club", time: "4 min", description: "Islamic songs without instruments" },
            { order: 7, name: "Dua and Prayer", leadBy: "Imam", time: "3 min", description: "Collective prayer for Ummah" }
        ];
    }

    getNationalDayActivities() {
        return [
            { order: 1, name: "Flag Hoisting Ceremony", leadBy: "School Principal", time: "5 min", description: "National flag hoisting with salute" },
            { order: 2, name: "National Anthem", leadBy: "Whole School", time: "2 min", description: "Singing with full enthusiasm" },
            { order: 3, name: "Patriotic Song", leadBy: "Music Department", time: "4 min", description: "Traditional patriotic song" },
            { order: 4, name: "Speech on National Heroes", leadBy: "History Teacher", time: "6 min", description: "Stories of national heroes" },
            { order: 5, name: "Tableau Performance", leadBy: "Drama Club", time: "8 min", description: "Historical tableau presentation" },
            { order: 6, name: "Poetry Recitation", leadBy: "Literary Society", time: "4 min", description: "Patriotic poetry in Urdu" },
            { order: 7, name: "Pledge for Pakistan", leadBy: "All Students", time: "3 min", description: "Renewed commitment to nation" }
        ];
    }

    loadActivities() {
        this.activities = this.getDefaultActivities();
        this.renderActivities();
    }

    renderActivities() {
        const activitiesList = document.getElementById('activitiesList');
        activitiesList.innerHTML = '';

        this.activities.forEach((activity, index) => {
            const activityEl = this.createActivityElement(activity, index);
            activitiesList.appendChild(activityEl);
        });
    }

    createActivityElement(activity, index) {
        const activityEl = document.createElement('div');
        activityEl.className = 'activity-item';
        activityEl.setAttribute('data-index', index);
        activityEl.innerHTML = `
            <div class="activity-header">
                <span class="activity-title">${activity.order}. ${activity.name}</span>
                <span class="activity-time">${activity.time}</span>
            </div>
            <div class="activity-description">
                <strong>Lead By:</strong> ${activity.leadBy}<br>
                ${activity.description}
            </div>
            <div class="activity-actions-inline">
                <button class="btn-small btn-outline edit-activity" data-index="${index}">Edit</button>
                <button class="btn-small btn-outline delete-activity" data-index="${index}">Delete</button>
                <button class="btn-small btn-outline move-up" data-index="${index}">↑</button>
                <button class="btn-small btn-outline move-down" data-index="${index}">↓</button>
            </div>
        `;

        this.attachActivityEventListeners(activityEl, index);
        return activityEl;
    }

    attachActivityEventListeners(activityEl, index) {
        activityEl.querySelector('.edit-activity').addEventListener('click', () => this.editActivity(index));
        activityEl.querySelector('.delete-activity').addEventListener('click', () => this.deleteActivity(index));
        activityEl.querySelector('.move-up').addEventListener('click', () => this.moveActivity(index, -1));
        activityEl.querySelector('.move-down').addEventListener('click', () => this.moveActivity(index, 1));
    }

    setupEventListeners() {
        // Main action buttons
        document.getElementById('generateBtn').addEventListener('click', () => this.generateRoster());
        document.getElementById('downloadPdfBtn').addEventListener('click', () => this.downloadPDF('choose'));
        document.getElementById('downloadWordBtn').addEventListener('click', () => this.downloadWord());
        document.getElementById('downloadExcelBtn').addEventListener('click', () => this.exportToExcel());
        document.getElementById('saveRosterBtn').addEventListener('click', () => this.saveRoster());

        // Quick actions
        document.getElementById('saveTemplateBtn').addEventListener('click', () => this.saveAsTemplate());
        document.getElementById('loadTemplateBtn').addEventListener('click', () => this.showTemplateModal());
        document.getElementById('shareRosterBtn').addEventListener('click', () => this.shareRoster());
        document.getElementById('aiSuggestBtn').addEventListener('click', () => this.showAISuggestions());

        // Activity management
        document.getElementById('addActivityBtn').addEventListener('click', () => this.addCustomActivity());
        document.getElementById('reorderActivitiesBtn').addEventListener('click', () => this.toggleReorderMode());

        // Time optimization
        document.getElementById('optimizeTimeBtn').addEventListener('click', () => this.optimizeTime());

        // Collaboration
        document.getElementById('toggleCollaborationBtn').addEventListener('click', () => this.toggleCollaboration());

        // Export options
        document.getElementById('exportOptionsBtn').addEventListener('click', () => this.showExportModal());

        // Form input listeners for real-time updates
        const formInputs = ['schoolName', 'date', 'theme', 'totalTime', 'gradeSelect', 'language'];
        formInputs.forEach(inputId => {
            document.getElementById(inputId).addEventListener('input', () => this.updatePreview());
        });

        // Modal close buttons
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Export option buttons
        document.querySelectorAll('[data-format]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleExportFormat(e.target.dataset.format));
        });

        // Footer links
        document.getElementById('exportHistory').addEventListener('click', (e) => {
            e.preventDefault();
            this.showExportHistory();
        });

        document.getElementById('viewAnalytics').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAnalytics();
        });

        document.getElementById('helpDocs').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelpDocumentation();
        });

        // Chat functionality
        document.getElementById('sendChatBtn').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
    }

    sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (message) {
            this.addChatMessage('You', message);
            chatInput.value = '';
            
            // Simulate response
            setTimeout(() => {
                const responses = [
                    "That's a great idea for the assembly!",
                    "I'll help with that activity.",
                    "Should we adjust the timing?",
                    "Perfect for our theme!"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                this.addChatMessage('Team Member', randomResponse);
            }, 1000);
        }
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        messageEl.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    setupCollaboration() {
        this.collaborators = [
            { id: 1, name: "Teacher Ali", role: "Coordinator", online: true },
            { id: 2, name: "Teacher Sana", role: "Islamic Studies", online: true },
            { id: 3, name: "Teacher Ahmed", role: "Science Dept", online: false }
        ];

        this.updateCollaborationPanel();
    }

    updateCollaborationPanel() {
        const onlineUsers = document.getElementById('onlineUsers');
        onlineUsers.innerHTML = '';

        this.collaborators.forEach(collaborator => {
            const userBadge = document.createElement('div');
            userBadge.className = `user-badge ${collaborator.online ? 'online' : 'offline'}`;
            userBadge.innerHTML = `
                <span class="status-indicator ${collaborator.online ? 'status-online' : 'status-offline'}"></span>
                ${collaborator.name}
            `;
            onlineUsers.appendChild(userBadge);
        });
    }

    toggleCollaboration() {
        const panel = document.getElementById('collaborationPanel');
        const isActive = panel.classList.contains('active');
        
        if (isActive) {
            panel.classList.remove('active');
            this.isCollaborationActive = false;
        } else {
            panel.classList.add('active');
            this.isCollaborationActive = true;
            this.simulateCollaborationActivity();
        }
    }

    simulateCollaborationActivity() {
        setInterval(() => {
            if (this.isCollaborationActive) {
                this.addChatMessage("System", "Teacher Sana is editing the Quran recitation activity");
                this.updateCollaborationPanel();
            }
        }, 10000);
    }

    generateRoster() {
        this.updatePreview();
        this.showNotification('Roster generated successfully!', 'success');
        this.saveToHistory();
    }

    updatePreview() {
        const previewBody = document.getElementById('previewBody');
        previewBody.innerHTML = '';

        let totalCalculatedTime = 0;

        this.activities.forEach(activity => {
            const row = document.createElement('tr');
            
            const timeMatch = activity.time.match(/(\d+)/);
            if (timeMatch) {
                totalCalculatedTime += parseInt(timeMatch[1]);
            }

            row.innerHTML = `
                <td>${activity.order}</td>
                <td>
                    <strong>${activity.name}</strong>
                    <div style="font-size: 0.9em; color: #666;">${activity.description}</div>
                </td>
                <td>${activity.leadBy}</td>
                <td>${activity.time}</td>
                <td>
                    <button class="btn-small btn-outline" onclick="rosterGenerator.editActivity(${activity.order - 1})">Edit</button>
                </td>
            `;
            previewBody.appendChild(row);
        });

        const totalRow = document.createElement('tr');
        totalRow.className = 'total-row';
        totalRow.innerHTML = `
            <td colspan="3" style="text-align: right; font-weight: bold;">Total Time:</td>
            <td>${totalCalculatedTime} min</td>
            <td></td>
        `;
        previewBody.appendChild(totalRow);

        const totalTimeInput = parseInt(document.getElementById('totalTime').value) || 0;
        const timeStatus = document.getElementById('timeStatus');
        
        if (totalCalculatedTime > totalTimeInput) {
            timeStatus.textContent = `⚠️ Exceeds by ${totalCalculatedTime - totalTimeInput} min`;
            timeStatus.style.color = 'var(--danger)';
        } else if (totalCalculatedTime < totalTimeInput) {
            timeStatus.textContent = `✅ ${totalTimeInput - totalCalculatedTime} min available`;
            timeStatus.style.color = 'var(--success)';
        } else {
            timeStatus.textContent = '✅ Perfect timing';
            timeStatus.style.color = 'var(--success)';
        }
    }

    addCustomActivity() {
        const newActivity = {
            order: this.activities.length + 1,
            name: "New Custom Activity",
            leadBy: "To be assigned",
            time: "5 min",
            description: "Custom activity description"
        };

        this.activities.push(newActivity);
        this.renumberActivities();
        this.renderActivities();
        this.updatePreview();
        
        this.showNotification('Custom activity added successfully!', 'success');
    }

    editActivity(index) {
        const activity = this.activities[index];
        const newName = prompt('Edit activity name:', activity.name);
        if (newName) activity.name = newName;
        
        const newLeadBy = prompt('Edit lead by:', activity.leadBy);
        if (newLeadBy) activity.leadBy = newLeadBy;
        
        const newTime = prompt('Edit time (e.g., "5 min"):', activity.time);
        if (newTime) activity.time = newTime;
        
        const newDesc = prompt('Edit description:', activity.description);
        if (newDesc) activity.description = newDesc;

        this.renderActivities();
        this.updatePreview();
        this.showNotification('Activity updated successfully!', 'success');
    }

    deleteActivity(index) {
        if (confirm('Are you sure you want to delete this activity?')) {
            this.activities.splice(index, 1);
            this.renumberActivities();
            this.renderActivities();
            this.updatePreview();
            this.showNotification('Activity deleted successfully!', 'success');
        }
    }

    moveActivity(index, direction) {
        if ((direction === -1 && index === 0) || (direction === 1 && index === this.activities.length - 1)) {
            return;
        }

        const newIndex = index + direction;
        [this.activities[index], this.activities[newIndex]] = [this.activities[newIndex], this.activities[index]];
        this.renumberActivities();
        this.renderActivities();
        this.updatePreview();
    }

    renumberActivities() {
        this.activities.forEach((activity, index) => {
            activity.order = index + 1;
        });
    }

    toggleReorderMode() {
        const activitiesList = document.getElementById('activitiesList');
        activitiesList.classList.toggle('reorder-mode');
        
        if (activitiesList.classList.contains('reorder-mode')) {
            this.showNotification('Drag and drop to reorder activities', 'info');
        } else {
            this.showNotification('Activities reordered successfully!', 'success');
        }
    }

    optimizeTime() {
        const totalTime = parseInt(document.getElementById('totalTime').value) || 45;
        let currentTotal = 0;

        this.activities.forEach(activity => {
            const timeMatch = activity.time.match(/(\d+)/);
            if (timeMatch) {
                currentTotal += parseInt(timeMatch[1]);
            }
        });

        if (currentTotal === totalTime) {
            this.showNotification('Time is already perfectly optimized!', 'info');
            return;
        }

        if (currentTotal > totalTime) {
            const reductionNeeded = currentTotal - totalTime;
            this.adjustActivityTimes(-reductionNeeded);
        } else {
            const additionPossible = totalTime - currentTotal;
            this.adjustActivityTimes(additionPossible);
        }

        this.renderActivities();
        this.updatePreview();
        this.showNotification('Time optimized successfully!', 'success');
    }

    adjustActivityTimes(adjustment) {
        let longestActivity = null;
        let maxTime = 0;

        this.activities.forEach(activity => {
            const timeMatch = activity.time.match(/(\d+)/);
            if (timeMatch) {
                const time = parseInt(timeMatch[1]);
                if (time > maxTime) {
                    maxTime = time;
                    longestActivity = activity;
                }
            }
        });

        if (longestActivity) {
            const currentTime = parseInt(longestActivity.time);
            let newTime = currentTime + adjustment;
            
            if (newTime < 1) newTime = 1;
            
            longestActivity.time = `${newTime} min`;
        }
    }

    saveAsTemplate() {
        const templateName = prompt('Enter template name:');
        if (!templateName) return;

        const newTemplate = {
            id: Date.now(),
            name: templateName,
            description: prompt('Enter template description:') || '',
            activities: JSON.parse(JSON.stringify(this.activities)),
            totalTime: parseInt(document.getElementById('totalTime').value) || 45,
            theme: document.getElementById('theme').value
        };

        this.templates.push(newTemplate);
        this.saveTemplates();
        this.showNotification('Template saved successfully!', 'success');
    }

    showTemplateModal() {
        const modal = document.getElementById('templateModal');
        const templateGrid = document.getElementById('templateGrid');
        
        templateGrid.innerHTML = '';
        
        this.templates.forEach(template => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.innerHTML = `
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <p><strong>Theme:</strong> ${template.theme}</p>
                <p><strong>Activities:</strong> ${template.activities.length}</p>
                <p><strong>Total Time:</strong> ${template.totalTime} min</p>
            `;
            templateCard.addEventListener('click', () => this.loadTemplate(template));
            templateGrid.appendChild(templateCard);
        });

        modal.style.display = 'block';
    }

    loadTemplate(template) {
        this.activities = JSON.parse(JSON.stringify(template.activities));
        document.getElementById('totalTime').value = template.totalTime;
        document.getElementById('theme').value = template.theme;
        
        this.renderActivities();
        this.updatePreview();
        
        document.getElementById('templateModal').style.display = 'none';
        this.showNotification(`Template "${template.name}" loaded successfully!`, 'success');
    }

    showAISuggestions() {
        const modal = document.getElementById('aiModal');
        const suggestionsContainer = document.getElementById('aiSuggestions');
        
        suggestionsContainer.innerHTML = `
            <div class="ai-suggestion" onclick="rosterGenerator.addAISuggestion('Quran Recitation Competition')">
                <strong>Quran Recitation Competition</strong><br>
                <small>Organize a short competition with 3 participants</small>
            </div>
            <div class="ai-suggestion" onclick="rosterGenerator.addAISuggestion('Environmental Pledge')">
                <strong>Environmental Pledge</strong><br>
                <small>Students pledge to protect the environment</small>
            </div>
            <div class="ai-suggestion" onclick="rosterGenerator.addAISuggestion('Science Demonstration')">
                <strong>Science Demonstration</strong><br>
                <small>Quick science experiment related to theme</small>
            </div>
            <div class="ai-suggestion" onclick="rosterGenerator.addAISuggestion('Cultural Performance')">
                <strong>Cultural Performance</strong><br>
                <small>Traditional dance or music from Pakistani culture</small>
            </div>
        `;

        modal.style.display = 'block';
    }

    addAISuggestion(activityName) {
        const newActivity = {
            order: this.activities.length + 1,
            name: activityName,
            leadBy: "AI Suggested - Assign Leader",
            time: "5 min",
            description: "AI-suggested activity based on theme analysis"
        };

        this.activities.push(newActivity);
        this.renumberActivities();
        this.renderActivities();
        this.updatePreview();
        
        document.getElementById('aiModal').style.display = 'none';
        this.showNotification('AI suggestion added successfully!', 'success');
    }

    showExportModal() {
        document.getElementById('exportModal').style.display = 'block';
    }

    handleExportFormat(format) {
        switch (format) {
            case 'pdf-simple':
                this.downloadPDF('simple');
                break;
            case 'pdf-detailed':
                this.downloadPDF('detailed');
                break;
            case 'pdf-booklet':
                this.downloadPDF('booklet');
                break;
            case 'word':
                this.downloadWord();
                break;
            case 'excel':
                this.exportToExcel();
                break;
            case 'json':
                this.exportToJSON();
                break;
        }
        document.getElementById('exportModal').style.display = 'none';
    }

    shareRoster() {
        const rosterData = this.getRosterData();
        const shareableUrl = this.generateShareableUrl(rosterData);
        
        navigator.clipboard.writeText(shareableUrl).then(() => {
            this.showNotification('Shareable link copied to clipboard!', 'success');
        }).catch(() => {
            prompt('Copy this link to share:', shareableUrl);
        });
    }

    generateShareableUrl(rosterData) {
        const encodedData = btoa(JSON.stringify(rosterData));
        return `${window.location.origin}${window.location.pathname}?roster=${encodedData}`;
    }

    getRosterData() {
        return {
            schoolName: document.getElementById('schoolName').value,
            date: document.getElementById('date').value,
            theme: document.getElementById('theme').value,
            grade: document.getElementById('gradeSelect').value,
            totalTime: document.getElementById('totalTime').value,
            activities: this.activities,
            language: document.getElementById('language').value
        };
    }

    saveRoster() {
        const rosterData = this.getRosterData();
        const rosters = JSON.parse(localStorage.getItem('savedRosters') || '[]');
        
        rosterData.id = Date.now();
        rosterData.savedAt = new Date().toISOString();
        
        rosters.push(rosterData);
        localStorage.setItem('savedRosters', JSON.stringify(rosters));
        
        this.showNotification('Roster saved to cloud successfully!', 'success');
    }

    saveToHistory() {
        const history = JSON.parse(localStorage.getItem('rosterHistory') || '[]');
        const rosterData = this.getRosterData();
        
        rosterData.generatedAt = new Date().toISOString();
        history.unshift(rosterData);
        
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('rosterHistory', JSON.stringify(history));
    }

    saveTemplates() {
        localStorage.setItem('assemblyTemplates', JSON.stringify(this.templates));
    }

    showExportHistory() {
        const history = JSON.parse(localStorage.getItem('rosterHistory') || '[]');
        alert(`You have generated ${history.length} rosters in history.`);
    }

    showAnalytics() {
        const history = JSON.parse(localStorage.getItem('rosterHistory') || '[]');
        const templates = JSON.parse(localStorage.getItem('assemblyTemplates') || '[]');
        
        const analytics = `
            Assembly Roster Analytics:
            
            Total Rosters Generated: ${history.length}
            Saved Templates: ${templates.length}
            Most Used Grade: ${this.getMostUsedGrade(history)}
            Average Assembly Time: ${this.getAverageTime(history)} minutes
        `;
        
        alert(analytics);
    }

    getMostUsedGrade(history) {
        if (history.length === 0) return 'N/A';
        
        const gradeCount = {};
        history.forEach(roster => {
            gradeCount[roster.grade] = (gradeCount[roster.grade] || 0) + 1;
        });
        
        return Object.keys(gradeCount).reduce((a, b) => gradeCount[a] > gradeCount[b] ? a : b);
    }

    getAverageTime(history) {
        if (history.length === 0) return 0;
        
        const total = history.reduce((sum, roster) => sum + parseInt(roster.totalTime || 0), 0);
        return Math.round(total / history.length);
    }

    showHelpDocumentation() {
        const helpContent = `
Morning Assembly Roster Generator - Help Guide

1. BASIC USAGE:
   - Fill in assembly details (school, date, theme, grade)
   - Activities are pre-loaded but can be customized
   - Use "Generate Roster" to create preview
   - Download in PDF or Word format

2. EXPORT OPTIONS:
   - PDF: Simple, Detailed, Booklet formats
   - Word: Document format
   - Excel: Spreadsheet format
   - JSON: Data backup

3. ADVANCED FEATURES:
   - Save/Load Templates
   - AI Activity Suggestions
   - Time Optimization
   - Team Collaboration
   - Shareable Links

4. TIPS:
   - Use templates for recurring assembly types
   - Share rosters with colleagues using shareable links
   - All exports work 100% client-side

Need more help? The tool includes fallback options for all exports.
        `;
        
        alert(helpContent);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Export methods - implemented in separate modules
    downloadPDF(format = 'simple') {
        // Implemented in PDF module
        if (typeof pdfExporter !== 'undefined') {
            const rosterData = this.getRosterData();
            if (format === 'choose') {
                pdfExporter.showExportOptions(rosterData);
            } else {
                pdfExporter.exportRoster(rosterData, format);
            }
        } else {
            this.showNotification('PDF exporter not available', 'error');
        }
    }

    downloadWord() {
        // Implemented in Word module
        if (typeof wordExporter !== 'undefined') {
            const rosterData = this.getRosterData();
            wordExporter.exportRoster(rosterData);
        } else {
            this.showNotification('Word exporter not available', 'error');
        }
    }

    exportToExcel() {
        this.showNotification('Exporting to Excel format...', 'info');
        const rosterData = this.getRosterData();
        
        // Enhanced CSV export
        let csvContent = "Assembly Roster\n\n";
        csvContent += `School,${rosterData.schoolName}\n`;
        csvContent += `Date,${rosterData.date}\n`;
        csvContent += `Theme,${rosterData.theme}\n`;
        csvContent += `Grade,${rosterData.grade}\n`;
        csvContent += `Total Time,${rosterData.totalTime} minutes\n`;
        csvContent += `Language,${rosterData.language}\n\n`;
        
        csvContent += "Order,Activity,Lead By,Time,Description\n";
        
        rosterData.activities.forEach(activity => {
            csvContent += `${activity.order},"${activity.name}","${activity.leadBy}",${activity.time},"${activity.description}"\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `assembly_roster_${rosterData.date}.csv`;
        link.click();
        
        this.showNotification('Excel/CSV data exported successfully!', 'success');
    }

    exportToJSON() {
        const rosterData = this.getRosterData();
        const dataStr = JSON.stringify(rosterData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `assembly_roster_${rosterData.date}.json`;
        link.click();
        
        this.showNotification('JSON data exported successfully!', 'success');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    window.rosterGenerator = new RosterGenerator();
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Add CSS for notifications and animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .chat-message {
        margin-bottom: 8px;
        padding: 8px;
        background: #f9f9f9;
        border-radius: 4px;
    }
    
    .chat-message strong {
        color: #2196F3;
    }
`;
document.head.appendChild(notificationStyles);