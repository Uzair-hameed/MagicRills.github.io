// Working Word Export functionality with HTML method
class WordExporter {
    constructor() {
        this.exportFormats = {
            'formatted': 'Formatted Word Document',
            'simple': 'Simple Word Document'
        };
    }

    exportRoster(rosterData, format = 'formatted') {
        try {
            switch (format) {
                case 'simple':
                    this.exportSimpleWord(rosterData);
                    break;
                case 'formatted':
                default:
                    this.exportFormattedWord(rosterData);
            }
        } catch (error) {
            console.error('Word export error:', error);
            rosterGenerator.showNotification('Word export failed: ' + error.message, 'error');
            // Fallback to simple export
            this.exportSimpleWord(rosterData);
        }
    }

    exportFormattedWord(rosterData) {
        const htmlContent = this.generateFormattedHTML(rosterData);
        this.downloadAsDoc(htmlContent, rosterData, 'formatted');
        rosterGenerator.showNotification('Formatted Word document downloaded!', 'success');
    }

    exportSimpleWord(rosterData) {
        const htmlContent = this.generateSimpleHTML(rosterData);
        this.downloadAsDoc(htmlContent, rosterData, 'simple');
        rosterGenerator.showNotification('Simple Word document downloaded!', 'success');
    }

    generateFormattedHTML(rosterData) {
        return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="UTF-8">
    <meta name="ProgId" content="Word.Document">
    <title>Morning Assembly Roster - ${this.escapeHtml(rosterData.schoolName)}</title>
    <style>
        /* Word-compatible styles */
        body {
            font-family: Arial, sans-serif;
            margin: 1in;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            color: #2E7D32;
            font-size: 28px;
            margin-bottom: 10px;
        }
        h2 {
            color: #666;
            font-size: 20px;
            margin-bottom: 5px;
        }
        h3 {
            color: #4CAF50;
            font-size: 18px;
            font-style: italic;
        }
        .details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #4CAF50;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        th {
            background: #4CAF50;
            color: white;
            padding: 12px;
            text-align: left;
            border: 1px solid #45a049;
        }
        td {
            padding: 10px;
            border: 1px solid #ddd;
            vertical-align: top;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .activity-name {
            font-weight: bold;
            color: #2E7D32;
        }
        .activity-desc {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
        .total-time {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            margin: 20px 0;
            font-weight: bold;
            color: #1976d2;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>MORNING ASSEMBLY ROSTER</h1>
        <h2>${this.escapeHtml(rosterData.schoolName)}</h2>
        <h3>"${this.escapeHtml(rosterData.theme)}"</h3>
    </div>
    
    <div class="details">
        <p><strong>Date:</strong> ${this.formatDate(rosterData.date)}</p>
        <p><strong>Grade:</strong> ${this.escapeHtml(rosterData.grade)}</p>
        <p><strong>Total Time:</strong> ${rosterData.totalTime} minutes</p>
        <p><strong>Language:</strong> ${this.escapeHtml(rosterData.language)}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="8%">Order</th>
                <th width="47%">Activity</th>
                <th width="25%">Lead By</th>
                <th width="20%">Time</th>
            </tr>
        </thead>
        <tbody>
            ${rosterData.activities.map(activity => `
            <tr>
                <td>${activity.order}</td>
                <td>
                    <div class="activity-name">${this.escapeHtml(activity.name)}</div>
                    <div class="activity-desc">${this.escapeHtml(activity.description)}</div>
                </td>
                <td>${this.escapeHtml(activity.leadBy)}</td>
                <td>${activity.time}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="total-time">
        Total Assembly Time: ${this.calculateTotalTime(rosterData.activities)} minutes
    </div>
    
    <div class="footer">
        <p>Generated by Morning Assembly Roster Generator - Advanced Edition</p>
        <p>Created on ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>`;
    }

    generateSimpleHTML(rosterData) {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Assembly Roster - ${this.escapeHtml(rosterData.schoolName)}</title>
    <style>
        body { font-family: Arial; margin: 0.5in; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background: #CCC; }
    </style>
</head>
<body>
    <h1>Morning Assembly Roster</h1>
    <h2>${this.escapeHtml(rosterData.schoolName)}</h2>
    <p><strong>Date:</strong> ${this.formatDate(rosterData.date)}</p>
    <p><strong>Grade:</strong> ${rosterData.grade}</p>
    <p><strong>Theme:</strong> ${this.escapeHtml(rosterData.theme)}</p>
    <p><strong>Total Time:</strong> ${rosterData.totalTime} minutes</p>
    
    <table>
        <tr>
            <th>#</th>
            <th>Activity</th>
            <th>Lead By</th>
            <th>Time</th>
        </tr>
        ${rosterData.activities.map(activity => `
        <tr>
            <td>${activity.order}</td>
            <td>${this.escapeHtml(activity.name)}</td>
            <td>${this.escapeHtml(activity.leadBy)}</td>
            <td>${activity.time}</td>
        </tr>
        `).join('')}
    </table>
    
    <p><em>Total Time: ${this.calculateTotalTime(rosterData.activities)} minutes</em></p>
    <p><em>Generated on ${new Date().toLocaleString()}</em></p>
</body>
</html>`;
    }

    downloadAsDoc(htmlContent, rosterData, format) {
        // Create a Blob with the HTML content
        const blob = new Blob([htmlContent], { 
            type: 'application/msword' 
        });
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Assembly_Roster_${rosterData.grade}_${rosterData.date.replace(/-/g, '_')}_${format}.doc`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
        }, 100);
    }

    showExportOptions(rosterData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; align-items: center;
            justify-content: center; z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 500px; width: 90%;">
                <h3 style="color: #2E7D32; margin-bottom: 15px;">Export to Word - Choose Format</h3>
                <p style="color: #666; margin-bottom: 20px;">Select the Word format that best suits your needs:</p>
                <div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">
                    <button class="word-format-btn" data-format="formatted" 
                            style="padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; text-align: left; transition: all 0.3s;">
                        <strong style="color: #2E7D32;">Formatted Word Document</strong>
                        <br><small style="color: #666;">Professional layout with styling and descriptions</small>
                    </button>
                    <button class="word-format-btn" data-format="simple" 
                            style="padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; background: white; cursor: pointer; text-align: left; transition: all 0.3s;">
                        <strong style="color: #2E7D32;">Simple Word Document</strong>
                        <br><small style="color: #666;">Clean, minimal format for quick reference</small>
                    </button>
                </div>
                <button id="copyToClipboardBtn" style="padding: 12px; border: 2px solid #4CAF50; border-radius: 8px; background: #4CAF50; color: white; cursor: pointer; width: 100%; font-weight: bold; margin-top: 10px;">
                    📋 Copy to Clipboard (Plain Text)
                </button>
                <button id="closeWordModal" style="margin-top: 10px; padding: 10px; border: 2px solid #ccc; border-radius: 8px; background: white; cursor: pointer; width: 100%;">
                    Cancel
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add hover effects
        modal.querySelectorAll('.word-format-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.borderColor = '#4CAF50';
                btn.style.background = '#f1f8e9';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.borderColor = '#e0e0e0';
                btn.style.background = 'white';
            });
        });

        // Add event listeners
        modal.querySelectorAll('.word-format-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.exportRoster(rosterData, btn.dataset.format);
                document.body.removeChild(modal);
            });
        });

        modal.querySelector('#copyToClipboardBtn').addEventListener('click', () => {
            this.copyToClipboard(rosterData);
            document.body.removeChild(modal);
        });

        modal.querySelector('#closeWordModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    copyToClipboard(rosterData) {
        const plainText = this.generatePlainText(rosterData);
        
        navigator.clipboard.writeText(plainText).then(() => {
            rosterGenerator.showNotification('Roster copied to clipboard! Paste into any document.', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = plainText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            rosterGenerator.showNotification('Roster copied to clipboard!', 'success');
        });
    }

    generatePlainText(rosterData) {
        let text = `MORNING ASSEMBLY ROSTER\n`;
        text += `========================\n\n`;
        text += `School: ${rosterData.schoolName}\n`;
        text += `Date: ${this.formatDate(rosterData.date)}\n`;
        text += `Grade: ${rosterData.grade}\n`;
        text += `Theme: ${rosterData.theme}\n`;
        text += `Total Time: ${rosterData.totalTime} minutes\n`;
        text += `Language: ${rosterData.language}\n\n`;
        
        text += `ACTIVITIES:\n`;
        text += `-----------\n`;
        
        rosterData.activities.forEach(activity => {
            text += `${activity.order}. ${activity.name} (${activity.time})\n`;
            text += `   Lead by: ${activity.leadBy}\n`;
            text += `   ${activity.description}\n\n`;
        });
        
        text += `Total Assembly Time: ${this.calculateTotalTime(rosterData.activities)} minutes\n\n`;
        text += `Generated on ${new Date().toLocaleString()}\n`;
        text += `Created with Morning Assembly Roster Generator - Advanced Edition\n`;
        
        return text;
    }

    calculateTotalTime(activities) {
        return activities.reduce((total, activity) => {
            const timeMatch = activity.time.match(/(\d+)/);
            return total + (timeMatch ? parseInt(timeMatch[1]) : 0);
        }, 0);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize Word Exporter
const wordExporter = new WordExporter();