// Urdu Paper Generator DOC Exporter
class DOCExporter {
    constructor() {
        this.isInitialized = false;
    }

    exportToDOC(paperData) {
        return new Promise((resolve, reject) => {
            try {
                // Create HTML content for the document
                let docContent = `
                    <!DOCTYPE html>
                    <html dir="rtl" lang="ur">
                    <head>
                        <meta charset="UTF-8">
                        <title>${paperData.paperTitle}</title>
                        <style>
                            @font-face {
                                font-family: 'Jameel Noori Nastaleeq';
                                src: url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');
                            }
                            body {
                                font-family: 'Jameel Noori Nastaleeq', 'Segoe UI', Tahoma, sans-serif;
                                direction: rtl;
                                margin: 2cm;
                                line-height: 1.6;
                                text-align: right;
                            }
                            .header {
                                text-align: center;
                                border-bottom: 2px solid #000;
                                padding-bottom: 20px;
                                margin-bottom: 30px;
                            }
                            .school-name {
                                font-size: 24px;
                                font-weight: bold;
                                margin-bottom: 10px;
                            }
                            .paper-title {
                                font-size: 20px;
                                margin-bottom: 15px;
                            }
                            .student-info {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 10px;
                                font-size: 14px;
                                flex-wrap: wrap;
                            }
                            .section {
                                margin-bottom: 30px;
                            }
                            .section-title {
                                font-size: 18px;
                                font-weight: bold;
                                margin-bottom: 15px;
                                border-bottom: 1px solid #000;
                                padding-bottom: 5px;
                                text-align: right;
                            }
                            .question {
                                margin-bottom: 20px;
                                padding: 10px;
                                border-right: 3px solid #000;
                                background: #f9f9f9;
                            }
                            .question-text {
                                font-weight: bold;
                                margin-bottom: 10px;
                            }
                            .answer-space {
                                border-bottom: 1px solid #000;
                                margin-top: 10px;
                                min-height: 20px;
                            }
                            .instructions {
                                background: #f0f0f0;
                                padding: 15px;
                                border-radius: 5px;
                                margin-bottom: 20px;
                            }
                            .total-marks {
                                text-align: center;
                                font-weight: bold;
                                margin: 30px 0;
                                padding: 15px;
                                background: #e9e9e9;
                                border-radius: 5px;
                            }
                            .mcq-options {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 10px;
                                margin-top: 10px;
                            }
                            .mcq-option {
                                padding: 5px;
                                background: white;
                                border: 1px solid #ddd;
                                border-radius: 3px;
                                text-align: center;
                            }
                            @media print {
                                body { margin: 1cm; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                `;

                // Header
                docContent += `
                    <div class="header">
                        <div class="school-name">${paperData.schoolName}</div>
                        <div class="paper-title">${paperData.paperTitle}</div>
                        <div class="student-info">
                            <span>نام: ______________</span>
                            <span>کلاس: ___________</span>
                            <span>مضمون: ${paperData.subject}</span>
                            <span>تاریخ: __________</span>
                        </div>
                        <div class="student-info">
                            <span>ٹرم: ${paperData.term}</span>
                            <span>کل نمبر: ${paperData.totalMarks}</span>
                            <span>وقت: ${paperData.time || '_____'}</span>
                        </div>
                    </div>
                `;

                // Instructions
                if (paperData.instructions) {
                    docContent += `
                        <div class="instructions">
                            <h3>ہدایات:</h3>
                            <p>${paperData.instructions.replace(/\n/g, '<br>')}</p>
                        </div>
                    `;
                }

                // Objective Questions
                if (paperData.objectiveQuestions && paperData.objectiveQuestions.length > 0) {
                    docContent += `
                        <div class="section">
                            <div class="section-title">حصہ معروضی</div>
                            <p>درست جوابات کے گرد دائرہ لگائیں۔</p>
                    `;

                    paperData.objectiveQuestions.forEach((q, index) => {
                        docContent += `
                            <div class="question">
                                <div class="question-text">سوال نمبر ${index + 1}: ${q.text} (${q.marks} نمبر)</div>
                                ${q.options && q.options.length > 0 ? this.generateOptionsHTML(q.options) : ''}
                            </div>
                        `;
                    });

                    docContent += `</div>`;
                }

                // Subjective Questions
                if (paperData.subjectiveQuestions && paperData.subjectiveQuestions.length > 0) {
                    docContent += `
                        <div class="section">
                            <div class="section-title">حصہ انشائیہ</div>
                    `;

                    paperData.subjectiveQuestions.forEach((q, index) => {
                        const qNumber = index + 1 + (paperData.objectiveQuestions?.length || 0);
                        docContent += `
                            <div class="question">
                                <div class="question-text">سوال نمبر ${qNumber}: ${q.text} (${q.marks} نمبر)</div>
                                ${this.generateAnswerSpace(q.lines || 3)}
                            </div>
                        `;
                    });

                    docContent += `</div>`;
                }

                // Footer
                docContent += `
                    <div class="total-marks">
                        <p>کل نمبر: ${paperData.totalMarks}</p>
                        <p>حاصل کردہ نمبر: _______</p>
                    </div>
                    
                    <div class="no-print" style="text-align: center; margin-top: 50px; font-size: 12px; color: #666;">
                        <p>یہ پرچہ اردو پیپر جنریٹر کے ذریعے تیار کیا گیا</p>
                    </div>
                `;

                docContent += `</body></html>`;

                // Create and download DOC file
                const fileName = `urdu-paper-${new Date().getTime()}.doc`;
                this.downloadDOCFile(docContent, fileName);
                
                resolve(fileName);
            } catch (error) {
                reject(error);
            }
        });
    }

    generateOptionsHTML(options) {
        if (!options || options.length === 0) {
            return '<div style="margin: 10px 0;">(آپشنز)</div>';
        }
        
        let optionsHTML = '<div class="mcq-options">';
        options.forEach((opt, idx) => {
            const letters = ['الف', 'ب', 'ج', 'د', 'ہ', 'و', 'ز', 'ح', 'ط', 'ی'];
            optionsHTML += `<div class="mcq-option">(${letters[idx]}) ${opt}</div>`;
        });
        optionsHTML += '</div>';
        return optionsHTML;
    }

    generateAnswerSpace(lines) {
        let spaceHTML = '';
        for (let i = 0; i < lines; i++) {
            spaceHTML += '<div class="answer-space"></div>';
        }
        return spaceHTML;
    }

    downloadDOCFile(content, fileName) {
        // Create a Blob with HTML content
        const blob = new Blob(['\uFEFF' + content], { type: 'application/msword;charset=utf-8' });
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(link.href);
    }

    getPaperData() {
        const schoolName = document.getElementById('school-name').value || 'سکول کا نام';
        const paperTitle = document.getElementById('paper-title').value || 'پرچہ';
        const term = document.getElementById('term').value || 'پہلا';
        const subject = document.getElementById('subject').value || 'مضمون';
        const totalMarks = document.getElementById('total-marks').value || '100';
        const time = document.getElementById('time').value || '_____';
        const instructions = document.getElementById('instructions').value || '';
        
        // Collect objective questions with options
        const objectiveQuestions = [];
        document.querySelectorAll('#objective-questions-container .question').forEach((qElem, index) => {
            const textInput = qElem.querySelector('input[type="text"]');
            const marksInput = qElem.querySelector('input[type="number"]');
            
            const text = textInput?.value || `سوال نمبر ${index + 1}`;
            const marks = marksInput?.value || 1;
            
            // Extract options for MCQ questions
            const options = [];
            const optionsContainer = qElem.querySelector('.options-container');
            if (optionsContainer) {
                optionsContainer.querySelectorAll('input[type="text"]').forEach(optInput => {
                    if (optInput.value) {
                        options.push(optInput.value);
                    }
                });
            }
            
            objectiveQuestions.push({ text, marks, options });
        });
        
        // Collect subjective questions
        const subjectiveQuestions = [];
        document.querySelectorAll('#subjective-questions-container .question').forEach((qElem, index) => {
            const textInput = qElem.querySelector('input[type="text"]');
            const marksInput = qElem.querySelector('input[type="number"]');
            const linesInput = qElem.querySelector('input[type="number"][id*="lines"]');
            
            const text = textInput?.value || `سوال نمبر ${index + 1}`;
            const marks = marksInput?.value || 2;
            const lines = linesInput?.value || 3;
            
            subjectiveQuestions.push({ text, marks, lines });
        });
        
        return {
            schoolName,
            paperTitle,
            term,
            subject,
            totalMarks,
            time,
            instructions,
            objectiveQuestions,
            subjectiveQuestions
        };
    }
}

// Initialize DOC exporter
const docExporter = new DOCExporter();

// Global function for DOC export
async function exportToDOC() {
    try {
        paperGenerator.showLoading(true);
        const paperData = docExporter.getPaperData();
        const fileName = await docExporter.exportToDOC(paperData);
        paperGenerator.showNotification(`DOC فائل کامیابی کے ساتھ ڈاؤنلوڈ ہو گئی: ${fileName}`);
    } catch (error) {
        console.error('DOC export error:', error);
        paperGenerator.showNotification('DOC ڈاؤنلوڈ میں خرابی', 'error');
    } finally {
        paperGenerator.showLoading(false);
    }
}