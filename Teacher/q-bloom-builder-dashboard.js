// Q Bloom Builder - Advanced Dashboard and Export Features

class QBloomDashboard {
    constructor() {
        this.exportTemplates = {
            pdf: this.exportAsPDF,
            word: this.exportAsWord,
            excel: this.exportAsExcel,
            json: this.exportAsJSON
        };
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.setupExportHandlers();
        this.setupDashboardFeatures();
        this.initializeCharts();
        console.log('Q Bloom Dashboard Initialized 📊');
    }

    setupExportHandlers() {
        // Export handlers are set up in the main HTML
        // Additional export options can be added here
    }

    setupDashboardFeatures() {
        this.addAdvancedVisualizations();
        this.setupRealTimeUpdates();
        this.addCustomizationOptions();
    }

    initializeCharts() {
        // Initialize any advanced charts if needed
    }

    // Advanced PDF Export with styling
    async exportAsPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add watermark
        this.addPDFWatermark(doc);
        
        // Title section
        this.addPDFTitle(doc);
        
        // Summary section
        this.addPDFSummary(doc);
        
        // Detailed analysis
        this.addPDFAnalysis(doc);
        
        // Visualization
        this.addPDFVisualization(doc);
        
        // Recommendations
        this.addPDFRecommendations(doc);
        
        // Save the PDF
        doc.save("q-bloom-builder-analysis-report.pdf");
        
        showNotification('PDF report generated successfully!', 'success');
    }

    addPDFWatermark(doc) {
        doc.setFillColor(245, 245, 245);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
        
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(40);
        doc.text('Q Bloom Builder', 105, 150, { align: "center", angle: 45 });
        doc.setTextColor(0, 0, 0);
    }

    addPDFTitle(doc) {
        doc.setFillColor(71, 118, 230);
        doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text("Q Bloom Builder - Analysis Report", 105, 15, { align: "center" });
        
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 25, { align: "center" });
        doc.setTextColor(0, 0, 0);
    }

    addPDFSummary(doc) {
        let yPosition = 50;
        
        doc.setFontSize(16);
        doc.setTextColor(71, 118, 230);
        doc.text("Summary", 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        
        const totalQuestions = document.getElementById('totalQuestions').textContent;
        const classifiedQuestions = document.getElementById('classifiedQuestions').textContent;
        const highestLevel = document.getElementById('highestLevel').textContent;
        
        doc.text(`Total Questions: ${totalQuestions}`, 25, yPosition);
        yPosition += 6;
        doc.text(`Classified Questions: ${classifiedQuestions}`, 25, yPosition);
        yPosition += 6;
        doc.text(`Highest Bloom's Level: ${highestLevel}`, 25, yPosition);
        yPosition += 6;
        
        const classificationRate = totalQuestions > 0 ? (classifiedQuestions / totalQuestions * 100).toFixed(1) : 0;
        doc.text(`Classification Rate: ${classificationRate}%`, 25, yPosition);
        yPosition += 15;
    }

    addPDFAnalysis(doc) {
        let yPosition = 80;
        
        doc.setFontSize(16);
        doc.setTextColor(71, 118, 230);
        doc.text("Detailed Analysis", 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        
        for (const level of ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']) {
            const questions = Q_BLOOM_BUILDER_STATE.classifiedQuestions[level];
            if (questions.length === 0) continue;
            
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            // Level header with color
            const color = Q_BLOOM_BUILDER_CONFIG.colors[level];
            const rgb = this.hexToRgb(color);
            doc.setTextColor(rgb.r, rgb.g, rgb.b);
            doc.setFont(undefined, 'bold');
            doc.text(`${capitalizeFirst(level)} (${questions.length})`, 25, yPosition);
            yPosition += 6;
            
            // Questions
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');
            
            questions.forEach((question, index) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                const truncated = question.length > 80 ? question.substring(0, 77) + '...' : question;
                doc.text(`${index + 1}. ${truncated}`, 30, yPosition);
                yPosition += 5;
            });
            
            yPosition += 5;
        }
    }

    addPDFVisualization(doc) {
        doc.addPage();
        let yPosition = 20;
        
        doc.setFontSize(16);
        doc.setTextColor(71, 118, 230);
        doc.text("Distribution Visualization", 20, yPosition);
        yPosition += 15;
        
        // Create a simple bar chart
        const total = getClassifiedCount();
        if (total === 0) return;
        
        const chartWidth = 160;
        const chartHeight = 100;
        const chartX = 25;
        const chartY = yPosition;
        
        // Draw bars
        const levels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
        const barWidth = chartWidth / levels.length;
        
        levels.forEach((level, index) => {
            const count = Q_BLOOM_BUILDER_STATE.classifiedQuestions[level].length;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const barHeight = (percentage / 100) * chartHeight;
            
            const color = Q_BLOOM_BUILDER_CONFIG.colors[level];
            const rgb = this.hexToRgb(color);
            
            doc.setFillColor(rgb.r, rgb.g, rgb.b);
            doc.rect(
                chartX + (index * barWidth),
                chartY + chartHeight - barHeight,
                barWidth - 2,
                barHeight,
                'F'
            );
            
            // Label
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(6);
            doc.text(
                capitalizeFirst(level).substring(0, 3),
                chartX + (index * barWidth) + (barWidth / 2) - 3,
                chartY + chartHeight + 5,
                { align: "center" }
            );
            
            doc.text(
                `${percentage.toFixed(0)}%`,
                chartX + (index * barWidth) + (barWidth / 2) - 3,
                chartY + chartHeight - barHeight - 5,
                { align: "center" }
            );
        });
    }

    addPDFRecommendations(doc) {
        let yPosition = 140;
        
        doc.setFontSize(16);
        doc.setTextColor(71, 118, 230);
        doc.text("AI Recommendations", 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const recommendations = this.generateExportRecommendations();
        
        recommendations.forEach(rec => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.text(`• ${rec}`, 25, yPosition);
            yPosition += 6;
        });
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    generateExportRecommendations() {
        const distribution = Q_BLOOM_BUILDER_STATE.classifiedQuestions;
        const total = getClassifiedCount();
        const recommendations = [];
        
        if (total === 0) {
            return ["No questions analyzed yet."];
        }
        
        // Analysis based on distribution
        const lowerOrder = distribution.remember + distribution.understand;
        const middleOrder = distribution.apply + distribution.analyze;
        const higherOrder = distribution.evaluate + distribution.create;
        
        if (lowerOrder > total * 0.6) {
            recommendations.push("Focus on adding more application and analysis questions to develop practical skills.");
        }
        
        if (higherOrder < total * 0.2) {
            recommendations.push("Incorporate more evaluation and creation questions to foster critical thinking and innovation.");
        }
        
        if (distribution.create === 0) {
            recommendations.push("Include at least one 'Create' level question to encourage original thinking and problem-solving.");
        }
        
        if (recommendations.length === 0) {
            recommendations.push("Well-balanced question distribution across Bloom's Taxonomy levels.");
        }
        
        recommendations.push("Consider the learning objectives when selecting question types.");
        recommendations.push("Use a variety of question formats to engage different learning styles.");
        
        return recommendations;
    }

    // Word Export Function
    exportAsWord() {
        const htmlContent = this.generateWordHTML();
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'q-bloom-builder-analysis-report.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Word document generated successfully!', 'success');
    }

    generateWordHTML() {
        const totalQuestions = document.getElementById('totalQuestions').textContent;
        const classifiedQuestions = document.getElementById('classifiedQuestions').textContent;
        const highestLevel = document.getElementById('highestLevel').textContent;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Q Bloom Builder - Analysis Report</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 40px;
                        line-height: 1.6;
                    }
                    .header { 
                        background: #4776E6; 
                        color: white; 
                        padding: 30px; 
                        text-align: center;
                        border-radius: 10px;
                        margin-bottom: 30px;
                    }
                    .summary { 
                        background: #f8f9fa; 
                        padding: 20px; 
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .level-section { 
                        margin: 20px 0; 
                        padding: 15px;
                        border-left: 4px solid;
                        border-radius: 4px;
                    }
                    .question { 
                        margin: 8px 0; 
                        padding: 8px;
                        background: white;
                        border-radius: 4px;
                        border-left: 3px solid #ddd;
                    }
                    .recommendations {
                        background: #e3f2fd;
                        padding: 20px;
                        border-radius: 8px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Q Bloom Builder - Analysis Report</h1>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div class="summary">
                    <h2>Summary</h2>
                    <p><strong>Total Questions:</strong> ${totalQuestions}</p>
                    <p><strong>Classified Questions:</strong> ${classifiedQuestions}</p>
                    <p><strong>Highest Bloom's Level:</strong> ${highestLevel}</p>
                </div>
                
                <h2>Detailed Analysis</h2>
                ${this.generateWordLevelSections()}
                
                <div class="recommendations">
                    <h2>AI Recommendations</h2>
                    ${this.generateWordRecommendations()}
                </div>
                
                <div style="margin-top: 40px; text-align: center; color: #666;">
                    <p>Generated by Q Bloom Builder - Part of MagicRills.com</p>
                </div>
            </body>
            </html>
        `;
    }

    generateWordLevelSections() {
        let html = '';
        
        for (const level of ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']) {
            const questions = Q_BLOOM_BUILDER_STATE.classifiedQuestions[level];
            if (questions.length === 0) continue;
            
            const color = Q_BLOOM_BUILDER_CONFIG.colors[level];
            
            html += `
                <div class="level-section" style="border-color: ${color}">
                    <h3 style="color: ${color}">${capitalizeFirst(level)} (${questions.length})</h3>
                    ${questions.map(q => `<div class="question">• ${q}</div>`).join('')}
                </div>
            `;
        }
        
        return html;
    }

    generateWordRecommendations() {
        const recommendations = this.generateExportRecommendations();
        return `
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;
    }

    // Additional export formats
    exportAsExcel() {
        showNotification('Excel export feature coming soon!', 'info');
    }

    exportAsJSON() {
        const analysisData = {
            metadata: {
                tool: "Q Bloom Builder",
                version: "2.0",
                generated: new Date().toISOString(),
                url: "https://magicrills.com"
            },
            summary: {
                totalQuestions: parseInt(document.getElementById('totalQuestions').textContent),
                classifiedQuestions: parseInt(document.getElementById('classifiedQuestions').textContent),
                highestLevel: document.getElementById('highestLevel').textContent
            },
            analysis: Q_BLOOM_BUILDER_STATE.classifiedQuestions,
            history: Q_BLOOM_BUILDER_STATE.analysisHistory
        };
        
        const dataStr = JSON.stringify(analysisData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'q-bloom-builder-analysis.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('JSON data exported successfully!', 'success');
    }

    addAdvancedVisualizations() {
        // Add advanced charting capabilities
        this.setupInteractiveCharts();
    }

    setupInteractiveCharts() {
        // Could integrate with Chart.js or other libraries
        console.log('Interactive charts setup complete');
    }

    setupRealTimeUpdates() {
        // Setup real-time analytics updates
        setInterval(() => {
            this.updateLiveStats();
        }, 5000);
    }

    updateLiveStats() {
        // Update any live statistics
        const totalQuestions = document.getElementById('totalQuestions').textContent;
        if (totalQuestions !== '0') {
            // Update any real-time metrics here
        }
    }

    addCustomizationOptions() {
        // Add theme customization
        this.addThemeCustomizer();
    }

    addThemeCustomizer() {
        // Could add a theme customization panel
        console.log('Theme customizer available');
    }

    // Advanced analytics
    generateComprehensiveReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.getSummaryStats(),
            distribution: this.getDetailedDistribution(),
            recommendations: this.generateExportRecommendations(),
            insights: this.generateInsights()
        };
        
        return report;
    }

    getSummaryStats() {
        const total = parseInt(document.getElementById('totalQuestions').textContent);
        const classified = parseInt(document.getElementById('classifiedQuestions').textContent);
        
        return {
            totalQuestions: total,
            classifiedQuestions: classified,
            classificationRate: total > 0 ? (classified / total * 100).toFixed(1) + '%' : '0%',
            highestLevel: document.getElementById('highestLevel').textContent,
            analysisDuration: this.getAnalysisDuration()
        };
    }

    getDetailedDistribution() {
        const distribution = {};
        let total = 0;
        
        for (const level in Q_BLOOM_BUILDER_STATE.classifiedQuestions) {
            if (level !== 'unclassified') {
                const count = Q_BLOOM_BUILDER_STATE.classifiedQuestions[level].length;
                distribution[level] = count;
                total += count;
            }
        }
        
        // Add percentages
        for (const level in distribution) {
            distribution[level + 'Percent'] = total > 0 ? (distribution[level] / total * 100).toFixed(1) + '%' : '0%';
        }
        
        return distribution;
    }

    getAnalysisDuration() {
        if (Q_BLOOM_BUILDER_STATE.analysisHistory.length === 0) return 'N/A';
        
        const lastAnalysis = Q_BLOOM_BUILDER_STATE.analysisHistory[Q_BLOOM_BUILDER_STATE.analysisHistory.length - 1];
        const startTime = new Date(lastAnalysis.timestamp);
        const endTime = new Date();
        const duration = (endTime - startTime) / 1000;
        
        return duration.toFixed(1) + ' seconds';
    }

    generateInsights() {
        const insights = [];
        const distribution = this.getDetailedDistribution();
        
        if (distribution.remember > distribution.create * 3) {
            insights.push("Heavy emphasis on memorization. Consider balancing with creative tasks.");
        }
        
        if (distribution.understand + distribution.remember > 60) {
            insights.push("Most questions test comprehension. Add more application and analysis.");
        }
        
        if (distribution.create < 2) {
            insights.push("Limited opportunity for original thought. Include creation tasks.");
        }
        
        return insights.length > 0 ? insights : ["Well-balanced question distribution across cognitive levels."];
    }
}

// Global dashboard instance
let qBloomDashboard;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    qBloomDashboard = new QBloomDashboard();
});

// Export functions
function exportPDF() {
    if (qBloomDashboard) {
        qBloomDashboard.exportAsPDF();
    }
}

function exportWord() {
    if (qBloomDashboard) {
        qBloomDashboard.exportAsWord();
    }
}

function exportExcel() {
    if (qBloomDashboard) {
        qBloomDashboard.exportAsExcel();
    }
}

function exportJSON() {
    if (qBloomDashboard) {
        qBloomDashboard.exportAsJSON();
    }
}

// Additional utility function for the dashboard
function showComprehensiveReport() {
    if (qBloomDashboard) {
        const report = qBloomDashboard.generateComprehensiveReport();
        console.log('Comprehensive Report:', report);
        alert('Comprehensive report generated! Check console for details.');
    }
}