// Advanced Export Functionality
class ResumeExporter {
    constructor(app) {
        this.app = app;
    }

    async downloadPDF() {
        this.app.showLoading();
        
        try {
            const previewElement = document.getElementById('resume-preview');
            
            // Store original styles
            const originalBackground = previewElement.style.background;
            const originalWidth = previewElement.style.width;
            const originalHeight = previewElement.style.height;
            
            // Set print styles
            previewElement.style.background = 'white';
            previewElement.style.width = '210mm';
            previewElement.style.height = '297mm';
            
            const canvas = await html2canvas(previewElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: previewElement.scrollWidth,
                height: previewElement.scrollHeight
            });
            
            // Restore original styles
            previewElement.style.background = originalBackground;
            previewElement.style.width = originalWidth;
            previewElement.style.height = originalHeight;
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add image to PDF
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Add watermark
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text('Created with MagicRills Resume Maker', 10, 290);
            
            pdf.save(`${this.getFileName()}.pdf`);
            this.app.hideLoading();
            
        } catch (error) {
            console.error('PDF Generation Error:', error);
            this.app.hideLoading();
            alert('Error generating PDF. Please try again.');
        }
    }

    downloadDOC() {
        this.app.showLoading();
        
        try {
            const personal = this.app.resumeData.personal;
            const experience = this.app.resumeData.experience;
            const education = this.app.resumeData.education;
            const skills = this.app.resumeData.skills;
            
            const htmlContent = this.generateDOCContent();
            const blob = new Blob([htmlContent], { 
                type: 'application/msword' 
            });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${this.getFileName()}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.app.hideLoading();
            
        } catch (error) {
            console.error('DOC Generation Error:', error);
            this.app.hideLoading();
            alert('Error generating DOC file. Please try again.');
        }
    }

    generateDOCContent() {
        const personal = this.app.resumeData.personal;
        const experience = this.app.resumeData.experience;
        const education = this.app.resumeData.education;
        const skills = this.app.resumeData.skills;
        
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Resume - ${personal.name || 'Your Name'}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid ${this.getThemeColor()};
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 { 
            color: #2c3e50; 
            font-size: 28pt; 
            margin: 0 0 5px 0;
        }
        .title { 
            color: ${this.getThemeColor()}; 
            font-size: 14pt; 
            font-weight: bold;
            margin-bottom: 10px;
        }
        .contact-info { 
            display: flex; 
            justify-content: center; 
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }
        .section { 
            margin-bottom: 25px; 
        }
        h2 { 
            color: ${this.getThemeColor()}; 
            font-size: 16pt; 
            border-bottom: 2px solid ${this.getThemeColor()};
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .item { 
            margin-bottom: 20px; 
        }
        .item-header { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 5px;
        }
        .item-title { 
            font-weight: bold; 
            font-size: 12pt;
        }
        .item-date { 
            color: #666; 
            font-size: 10pt;
        }
        .item-subtitle { 
            font-style: italic; 
            color: #666; 
            margin-bottom: 8px;
        }
        .skills { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 8px; 
        }
        .skill-tag { 
            background: ${this.getThemeColor()}; 
            color: white; 
            padding: 4px 12px; 
            border-radius: 15px; 
            font-size: 9pt;
        }
        .summary {
            font-size: 11pt;
            line-height: 1.8;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 9pt;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${personal.name || 'Your Name'}</h1>
        <div class="title">${personal.title || 'Professional Title'}</div>
        <div class="contact-info">
            ${personal.email ? `<div>📧 ${personal.email}</div>` : ''}
            ${personal.phone ? `<div>📱 ${personal.phone}</div>` : ''}
            ${personal.location ? `<div>📍 ${personal.location}</div>` : ''}
        </div>
    </div>
    
    ${personal.summary ? `
        <div class="section">
            <h2>Professional Summary</h2>
            <div class="summary">${personal.summary}</div>
        </div>
    ` : ''}
    
    ${experience.length > 0 ? `
        <div class="section">
            <h2>Work Experience</h2>
            ${experience.map(exp => `
                <div class="item">
                    <div class="item-header">
                        <div class="item-title">${exp.position || 'Position'}</div>
                        <div class="item-date">${exp.startDate || ''} ${exp.endDate ? ' - ' + exp.endDate : ''}</div>
                    </div>
                    <div class="item-subtitle">${exp.company || 'Company'}</div>
                    ${exp.description ? `<div style="margin-top: 8px;">${exp.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
    ` : ''}
    
    ${education.length > 0 ? `
        <div class="section">
            <h2>Education</h2>
            ${education.map(edu => `
                <div class="item">
                    <div class="item-header">
                        <div class="item-title">${edu.degree || 'Degree'}</div>
                        <div class="item-date">${edu.startDate || ''} ${edu.endDate ? ' - ' + edu.endDate : ''}</div>
                    </div>
                    <div class="item-subtitle">
                        ${edu.institution || 'Institution'}${edu.field ? ` - ${edu.field}` : ''}
                    </div>
                    ${edu.description ? `<div style="margin-top: 8px;">${edu.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
    ` : ''}
    
    ${skills.length > 0 ? `
        <div class="section">
            <h2>Skills</h2>
            <div class="skills">
                ${skills.map(skill => `
                    <div class="skill-tag">
                        ${skill.name}${skill.level ? ` (${skill.level})` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    ` : ''}
    
    <div class="footer">
        Generated with MagicRills Resume Maker • ${new Date().toLocaleDateString()}
    </div>
</body>
</html>`;
    }

    getFileName() {
        const name = this.app.resumeData.personal.name || 'resume';
        return name.toLowerCase().replace(/\s+/g, '-') + '-resume';
    }

    getThemeColor() {
        const themes = {
            blue: '#3498db',
            green: '#27ae60',
            purple: '#9b59b6',
            dark: '#2c3e50'
        };
        return themes[this.app.resumeData.settings.theme] || '#3498db';
    }

    // Additional export formats can be added here
    async downloadTXT() {
        // Text format export implementation
    }

    async downloadJSON() {
        // JSON format export for data backup
    }
}