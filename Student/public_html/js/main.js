// Main application controller
class ResumeApp {
    constructor() {
        this.resumeData = this.loadInitialData();
        this.init();
    }

    loadInitialData() {
        return {
            personal: {
                name: "",
                title: "",
                email: "",
                phone: "",
                address: "",
                summary: "",
                image: "",
                social: []
            },
            experience: [],
            education: [],
            skills: [],
            settings: {
                theme: "theme-default",
                font: "font-arial",
                template: "template-standard"
            }
        };
    }

    init() {
        this.initializeEventListeners();
        this.loadFromLocalStorage();
        this.generatePreview();
        
        // Auto-save every 10 seconds
        setInterval(() => this.saveToLocalStorage(), 10000);
    }

    initializeEventListeners() {
        // Tab functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Action buttons
        document.getElementById('preview-btn').addEventListener('click', () => this.generatePreview());
        document.getElementById('refresh-preview').addEventListener('click', () => this.generatePreview());
        document.getElementById('download-pdf').addEventListener('click', () => this.downloadPDF());
        document.getElementById('download-doc').addEventListener('click', () => this.downloadDOC());
        document.getElementById('print-btn').addEventListener('click', () => window.print());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetForm());
    }

    switchTab(tabId) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to current tab
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Load tab content
        this.loadTabContent(tabId);
    }

    loadTabContent(tabId) {
        const tabContents = document.getElementById('tab-contents');
        // This would be expanded to load different tab contents
        tabContents.innerHTML = this.getTabHTML(tabId);
    }

    getTabHTML(tabId) {
        // Simplified - you would expand this for each tab
        return `<div class="tab-content active" id="${tabId}-tab">
            <p>Content for ${tabId} tab</p>
        </div>`;
    }

    generatePreview() {
        // This will be implemented in resume-builder.js
        console.log('Generating preview...');
    }

    downloadPDF() {
        // This will be implemented in export.js
        console.log('Downloading PDF...');
    }

    downloadDOC() {
        // This will be implemented in export.js
        console.log('Downloading DOC...');
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('resumeData', JSON.stringify(this.resumeData));
            this.updateSaveStatus('Auto-saved', '#27ae60');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('resumeData');
            if (savedData) {
                this.resumeData = { ...this.resumeData, ...JSON.parse(savedData) };
                this.updateFormFields();
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    updateFormFields() {
        // Update form fields with loaded data
        // Implementation details...
    }

    updateSaveStatus(message, color) {
        const statusElement = document.getElementById('auto-save-status');
        statusElement.textContent = message;
        statusElement.style.color = color;
    }

    resetForm() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            this.resumeData = this.loadInitialData();
            localStorage.removeItem('resumeData');
            this.updateFormFields();
            this.generatePreview();
            this.updateSaveStatus('Form reset', '#27ae60');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resumeApp = new ResumeApp();
});