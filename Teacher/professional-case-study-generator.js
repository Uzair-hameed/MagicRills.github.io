// Professional Case Study Generator - Advanced JavaScript
class CaseStudyGenerator {
    constructor() {
        this.studiesGenerated = 0;
        this.timeSaved = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStats();
        this.initTheme();
    }

    bindEvents() {
        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Generate Button
        document.getElementById('generate-btn').addEventListener('click', () => this.generateCaseStudy());
        
        // Export Buttons
        document.getElementById('export-pdf').addEventListener('click', () => this.exportPDF());
        document.getElementById('export-word').addEventListener('click', () => this.exportWord());
        document.getElementById('export-html').addEventListener('click', () => this.exportHTML());
        document.getElementById('new-study').addEventListener('click', () => this.newStudy());
        
        // Topic Chips
        document.querySelectorAll('.topic-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.getElementById('topic').value = e.target.getAttribute('data-topic');
            });
        });

        // Form Input Animations
        this.addInputAnimations();
    }

    initTheme() {
        const savedTheme = localStorage.getItem('caseStudyTheme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeButton(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('caseStudyTheme', newTheme);
        this.updateThemeButton(newTheme);
    }

    updateThemeButton(theme) {
        const button = document.getElementById('theme-toggle');
        button.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
    }

    addInputAnimations() {
        const inputs = document.querySelectorAll('.form-input, .form-select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }

    async generateCaseStudy() {
        const topic = document.getElementById('topic').value.trim();
        const industry = document.getElementById('industry').value;
        const duration = document.getElementById('duration').value.trim();
        const participants = document.getElementById('participants').value.trim();

        if (!topic) {
            this.showNotification('Please enter a topic first!', 'error');
            return;
        }

        // Show loading state
        this.showLoading(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const caseStudy = this.createCaseStudy({
                topic,
                industry,
                duration,
                participants
            });

            this.displayCaseStudy(caseStudy);
            this.updateStats();
            this.enableExportButtons();
            this.showNotification('Case study generated successfully!', 'success');

        } catch (error) {
            this.showNotification('Error generating case study. Please try again.', 'error');
            console.error('Generation error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    createCaseStudy(data) {
        const templates = this.getTemplates();
        const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
        
        return {
            title: `${data.topic}: A Comprehensive Case Study`,
            subtitle: `Analysis of ${data.topic} in ${data.industry || 'Education'}`,
            template: selectedTemplate,
            meta: {
                topic: data.topic,
                industry: data.industry,
                duration: data.duration,
                participants: data.participants,
                generatedDate: new Date().toLocaleDateString()
            },
            content: this.generateContent(data, selectedTemplate)
        };
    }

    getTemplates() {
        return [
            {
                name: "Problem-Solution Analysis",
                color: "#ef4444",
                steps: [
                    "Problem Identification and Context",
                    "Root Cause Analysis",
                    "Solution Development Process",
                    "Implementation Strategy",
                    "Results and Impact Measurement",
                    "Lessons Learned and Recommendations"
                ]
            },
            {
                name: "Comparative Case Study",
                color: "#3b82f6",
                steps: [
                    "Case Selection Criteria",
                    "Comparative Framework Development",
                    "Data Collection Methods",
                    "Cross-Case Analysis",
                    "Pattern Identification",
                    "Best Practices Extraction"
                ]
            },
            {
                name: "Success Story Analysis",
                color: "#10b981",
                steps: [
                    "Success Context and Background",
                    "Key Success Factors Analysis",
                    "Implementation Journey",
                    "Challenges and Solutions",
                    "Measurable Outcomes",
                    "Transferable Insights"
                ]
            },
            {
                name: "Innovation Implementation",
                color: "#8b5cf6",
                steps: [
                    "Innovation Context and Need",
                    "Implementation Planning",
                    "Stakeholder Engagement",
                    "Execution Process",
                    "Outcome Evaluation",
                    "Scalability Assessment"
                ]
            }
        ];
    }

    generateContent(data, template) {
        const researchMethods = [
            "Mixed-methods research design",
            "Quantitative data analysis",
            "Qualitative interviews and focus groups",
            "Classroom observations",
            "Document analysis",
            "Survey administration"
        ];

        const analysisFrameworks = [
            "SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)",
            "Cost-Benefit Analysis",
            "ROI Calculation Framework",
            "Impact Assessment Matrix",
            "Stakeholder Analysis",
            "Risk Assessment Framework"
        ];

        const recommendations = [
            "Implement evidence-based practices",
            "Develop professional development programs",
            "Enhance stakeholder communication",
            "Optimize resource allocation",
            "Establish monitoring and evaluation systems",
            "Scale successful interventions"
        ];

        return {
            introduction: this.generateIntroduction(data),
            objectives: this.generateObjectives(data),
            methodology: this.shuffleArray(researchMethods).slice(0, 4),
            framework: this.shuffleArray(analysisFrameworks).slice(0, 3),
            steps: template.steps,
            recommendations: this.shuffleArray(recommendations).slice(0, 4),
            conclusion: this.generateConclusion(data)
        };
    }

    generateIntroduction(data) {
        return `This case study examines the implementation and impact of ${data.topic} within the context of ${data.industry || 'educational settings'}. The study explores the challenges, strategies, and outcomes associated with this initiative, providing valuable insights for educators and administrators.`;
    }

    generateObjectives(data) {
        return [
            `Analyze the effectiveness of ${data.topic}`,
            `Identify key success factors and challenges`,
            `Evaluate impact on ${data.participants || 'participants'}`,
            `Provide actionable recommendations for implementation`,
            `Document best practices and lessons learned`
        ];
    }

    generateConclusion(data) {
        return `The case study demonstrates the significant potential of ${data.topic} in enhancing educational outcomes. Through careful implementation and continuous evaluation, institutions can achieve meaningful improvements in teaching and learning experiences.`;
    }

    displayCaseStudy(caseStudy) {
        const preview = document.getElementById('case-study-preview');
        preview.innerHTML = this.createPreviewHTML(caseStudy);
        preview.style.display = 'block';
        
        document.getElementById('preview-placeholder').style.display = 'none';
    }

    createPreviewHTML(caseStudy) {
        return `
            <div class="case-study-header">
                <h1 class="case-study-title">${caseStudy.title}</h1>
                <p class="case-study-subtitle">${caseStudy.subtitle}</p>
            </div>

            <div class="study-meta">
                <div class="meta-item">
                    <span class="meta-label">Educational Sector</span>
                    <span class="meta-value">${caseStudy.meta.industry || 'Not specified'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Study Duration</span>
                    <span class="meta-value">${caseStudy.meta.duration || 'Not specified'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Participants</span>
                    <span class="meta-value">${caseStudy.meta.participants || 'Not specified'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Generated</span>
                    <span class="meta-value">${caseStudy.meta.generatedDate}</span>
                </div>
            </div>

            <h3 class="section-title">📋 Introduction</h3>
            <p>${caseStudy.content.introduction}</p>

            <h3 class="section-title">🎯 Study Objectives</h3>
            <ul class="bullet-list">
                ${caseStudy.content.objectives.map(obj => `
                    <li class="bullet-item">
                        <span class="bullet-icon">✓</span>
                        <span>${obj}</span>
                    </li>
                `).join('')}
            </ul>

            <h3 class="section-title">🔬 Research Methodology</h3>
            <ul class="bullet-list">
                ${caseStudy.content.methodology.map(method => `
                    <li class="bullet-item">
                        <span class="bullet-icon">🔍</span>
                        <span>${method}</span>
                    </li>
                `).join('')}
            </ul>

            <h3 class="section-title">📊 Analysis Framework: ${caseStudy.template.name}</h3>
            <ol class="step-list">
                ${caseStudy.template.steps.map((step, index) => `
                    <li class="step-item">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-content">
                            <div class="step-title">${step}</div>
                            <div class="step-description">Detailed methodology and approach for this phase</div>
                        </div>
                    </li>
                `).join('')}
            </ol>

            <h3 class="section-title">💡 Key Recommendations</h3>
            <ul class="bullet-list">
                ${caseStudy.content.recommendations.map(rec => `
                    <li class="bullet-item">
                        <span class="bullet-icon">💎</span>
                        <span>${rec}</span>
                    </li>
                `).join('')}
            </ul>

            <h3 class="section-title">🏁 Conclusion</h3>
            <p>${caseStudy.content.conclusion}</p>

            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 10px; border-left: 4px solid #0ea5e9;">
                <strong>📈 Expected Outcomes:</strong> Improved educational outcomes, enhanced stakeholder engagement, and sustainable implementation of best practices.
            </div>
        `;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const preview = document.getElementById('case-study-preview');
        const placeholder = document.getElementById('preview-placeholder');
        
        if (show) {
            loading.style.display = 'flex';
            preview.style.display = 'none';
            placeholder.style.display = 'none';
        } else {
            loading.style.display = 'none';
        }
    }

    enableExportButtons() {
        document.getElementById('export-pdf').disabled = false;
        document.getElementById('export-word').disabled = false;
        document.getElementById('export-html').disabled = false;
    }

    async exportPDF() {
        this.showNotification('Generating PDF...', 'info');
        
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add colorful header
            doc.setFillColor(67, 97, 238);
            doc.rect(0, 0, 210, 40, 'F');
            
            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.setFont(undefined, 'bold');
            doc.text('CASE STUDY REPORT', 105, 25, { align: 'center' });
            
            // Content
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            let yPosition = 60;
            
            const content = this.getExportContent();
            const lines = doc.splitTextToSize(content, 180);
            
            lines.forEach(line => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 15, yPosition);
                yPosition += 7;
            });
            
            // Add footer
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated by MagicRills Case Study Generator - ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' });
            
            doc.save(`case-study-${Date.now()}.pdf`);
            this.showNotification('PDF exported successfully!', 'success');
            
        } catch (error) {
            this.showNotification('Error generating PDF', 'error');
            console.error('PDF export error:', error);
        }
    }

    async exportWord() {
        this.showNotification('Generating Word document...', 'info');
        
        try {
            const content = this.getExportContent();
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Case Study Report</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 40px;
                        }
                        .header {
                            background: linear-gradient(135deg, #4361ee, #3a0ca3);
                            color: white;
                            padding: 40px;
                            text-align: center;
                            border-radius: 10px;
                            margin-bottom: 30px;
                        }
                        h1 {
                            color: #4361ee;
                            border-bottom: 3px solid #4361ee;
                            padding-bottom: 10px;
                        }
                        h2 {
                            color: #3a0ca3;
                            margin-top: 30px;
                        }
                        .meta-grid {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 15px;
                            background: #f8fafc;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .meta-item {
                            display: flex;
                            flex-direction: column;
                        }
                        .meta-label {
                            font-weight: bold;
                            color: #6b7280;
                            font-size: 0.9em;
                        }
                        .step-item {
                            background: #f1f5f9;
                            padding: 15px;
                            margin: 10px 0;
                            border-left: 4px solid #4361ee;
                            border-radius: 5px;
                        }
                        .bullet-list {
                            list-style: none;
                            padding: 0;
                        }
                        .bullet-item {
                            display: flex;
                            align-items: flex-start;
                            margin-bottom: 10px;
                        }
                        .bullet-icon {
                            color: #10b981;
                            margin-right: 10px;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 style="color: white; border: none;">CASE STUDY REPORT</h1>
                        <p>Professional Analysis Document</p>
                    </div>
                    ${document.getElementById('case-study-preview').innerHTML}
                </body>
                </html>
            `;
            
            const blob = new Blob([htmlContent], { type: 'application/msword' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `case-study-${Date.now()}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Word document exported!', 'success');
            
        } catch (error) {
            this.showNotification('Error exporting Word document', 'error');
            console.error('Word export error:', error);
        }
    }

    async exportHTML() {
        this.showNotification('Generating HTML file...', 'info');
        
        try {
            const content = document.getElementById('case-study-preview').innerHTML;
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Case Study Report</title>
                    <style>
                        body {
                            font-family: 'Inter', 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #1f2937;
                            background: #f8fafc;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 1000px;
                            margin: 0 auto;
                            background: white;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                        }
                        .report-header {
                            background: linear-gradient(135deg, #4361ee, #3a0ca3);
                            color: white;
                            padding: 50px 40px;
                            text-align: center;
                        }
                        ${document.querySelector('style').textContent}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="report-header">
                            <h1 style="color: white; border: none; font-size: 2.5em;">CASE STUDY REPORT</h1>
                            <p style="font-size: 1.2em; opacity: 0.9;">Professional Analysis Document</p>
                        </div>
                        <div style="padding: 40px;">
                            ${content}
                        </div>
                    </div>
                </body>
                </html>
            `;
            
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `case-study-${Date.now()}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('HTML file exported!', 'success');
            
        } catch (error) {
            this.showNotification('Error exporting HTML', 'error');
            console.error('HTML export error:', error);
        }
    }

    getExportContent() {
        const preview = document.getElementById('case-study-preview');
        return preview ? preview.textContent : 'No content available for export.';
    }

    newStudy() {
        // Reset form
        document.getElementById('topic').value = '';
        document.getElementById('industry').selectedIndex = 0;
        document.getElementById('duration').value = '';
        document.getElementById('participants').value = '';
        
        // Reset preview
        document.getElementById('preview-placeholder').style.display = 'flex';
        document.getElementById('case-study-preview').style.display = 'none';
        
        // Disable export buttons
        document.getElementById('export-pdf').disabled = true;
        document.getElementById('export-word').disabled = true;
        document.getElementById('export-html').disabled = true;
        
        this.showNotification('Ready to create new case study!', 'info');
    }

    updateStats() {
        this.studiesGenerated++;
        this.timeSaved += 2; // Assuming 2 hours saved per study
        
        document.getElementById('studies-generated').textContent = this.studiesGenerated;
        document.getElementById('time-saved').textContent = `${this.timeSaved}h`;
        
        this.saveStats();
    }

    loadStats() {
        const savedStats = localStorage.getItem('caseStudyStats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            this.studiesGenerated = stats.studiesGenerated || 0;
            this.timeSaved = stats.timeSaved || 0;
            
            document.getElementById('studies-generated').textContent = this.studiesGenerated;
            document.getElementById('time-saved').textContent = `${this.timeSaved}h`;
        }
    }

    saveStats() {
        const stats = {
            studiesGenerated: this.studiesGenerated,
            timeSaved: this.timeSaved
        };
        localStorage.setItem('caseStudyStats', JSON.stringify(stats));
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('.notification-icon');
        
        // Set icon based on type
        switch(type) {
            case 'success':
                icon.textContent = '✅';
                notification.style.background = '#10b981';
                break;
            case 'error':
                icon.textContent = '❌';
                notification.style.background = '#ef4444';
                break;
            case 'info':
                icon.textContent = 'ℹ️';
                notification.style.background = '#3b82f6';
                break;
        }
        
        notification.querySelector('.notification-text').textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CaseStudyGenerator();
});

// Add CSS for focused state
const style = document.createElement('style');
style.textContent = `
    .form-group.focused .form-label {
        color: var(--primary);
        transform: translateY(-2px);
    }
    
    .form-group.focused .form-input,
    .form-group.focused .form-select {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);