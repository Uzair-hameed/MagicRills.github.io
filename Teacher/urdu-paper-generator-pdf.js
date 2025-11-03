// Urdu Paper Generator PDF Exporter
class PDFExporter {
    constructor() {
        this.isInitialized = false;
        this.initializePDFLibrary();
    }

    async initializePDFLibrary() {
        if (typeof window.jspdf !== 'undefined') {
            this.isInitialized = true;
            return;
        }

        try {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                this.isInitialized = true;
                console.log('PDF library loaded successfully');
            };
            document.head.appendChild(script);
        } catch (error) {
            console.error('PDF library loading failed:', error);
        }
    }

    async exportToPDF(paperData) {
        if (!this.isInitialized) {
            await this.initializePDFLibrary();
        }

        return new Promise((resolve, reject) => {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Set RTL direction
                doc.setR2L(true);
                
                let yPosition = 20;
                const pageWidth = doc.internal.pageSize.width;
                const margin = 20;
                const contentWidth = pageWidth - 2 * margin;
                
                // Header
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text(paperData.schoolName, pageWidth - margin, yPosition, { align: 'right' });
                yPosition += 10;
                
                doc.setFontSize(14);
                doc.text(paperData.paperTitle, pageWidth - margin, yPosition, { align: 'right' });
                yPosition += 15;
                
                // Student Info
                doc.setFontSize(10);
                doc.text(`نام: ______________`, pageWidth - margin, yPosition, { align: 'right' });
                doc.text(`کلاس: ___________`, margin, yPosition, { align: 'left' });
                yPosition += 5;
                doc.text(`مضمون: ${paperData.subject}`, pageWidth - margin, yPosition, { align: 'right' });
                doc.text(`تاریخ: __________`, margin, yPosition, { align: 'left' });
                yPosition += 5;
                doc.text(`ٹرم: ${paperData.term}`, pageWidth - margin, yPosition, { align: 'right' });
                doc.text(`کل نمبر: ${paperData.totalMarks}`, margin, yPosition, { align: 'left' });
                yPosition += 10;
                
                // Instructions
                if (paperData.instructions) {
                    doc.setFontSize(11);
                    doc.text('ہدایات:', pageWidth - margin, yPosition, { align: 'right' });
                    yPosition += 5;
                    doc.setFontSize(10);
                    const instructions = this.splitText(doc, paperData.instructions, contentWidth);
                    instructions.forEach(line => {
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        doc.text(line, pageWidth - margin, yPosition, { align: 'right' });
                        yPosition += 5;
                    });
                    yPosition += 5;
                }
                
                // Questions
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                
                // Objective Questions
                if (paperData.objectiveQuestions && paperData.objectiveQuestions.length > 0) {
                    doc.text('حصہ معروضی', pageWidth - margin, yPosition, { align: 'right' });
                    yPosition += 10;
                    
                    paperData.objectiveQuestions.forEach((q, index) => {
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        
                        doc.setFontSize(10);
                        doc.setFont('helvetica', 'normal');
                        const questionText = `سوال نمبر ${index + 1}: ${q.text} (${q.marks} نمبر)`;
                        const lines = this.splitText(doc, questionText, contentWidth);
                        
                        lines.forEach(line => {
                            if (yPosition > 270) {
                                doc.addPage();
                                yPosition = 20;
                            }
                            doc.text(line, pageWidth - margin, yPosition, { align: 'right' });
                            yPosition += 5;
                        });
                        
                        // Add options for MCQ
                        if (q.options && q.options.length > 0) {
                            q.options.forEach((opt, optIndex) => {
                                if (yPosition > 270) {
                                    doc.addPage();
                                    yPosition = 20;
                                }
                                const optionText = `(${['الف', 'ب', 'ج', 'د'][optIndex]}) ${opt}`;
                                doc.text(optionText, pageWidth - margin - 20, yPosition, { align: 'right' });
                                yPosition += 5;
                            });
                        }
                        
                        yPosition += 3;
                    });
                }
                
                // Subjective Questions
                if (paperData.subjectiveQuestions && paperData.subjectiveQuestions.length > 0) {
                    if (yPosition > 250) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text('حصہ انشائیہ', pageWidth - margin, yPosition, { align: 'right' });
                    yPosition += 10;
                    
                    paperData.subjectiveQuestions.forEach((q, index) => {
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        
                        doc.setFontSize(10);
                        doc.setFont('helvetica', 'normal');
                        const questionText = `سوال نمبر ${index + 1 + (paperData.objectiveQuestions?.length || 0)}: ${q.text} (${q.marks} نمبر)`;
                        const lines = this.splitText(doc, questionText, contentWidth);
                        
                        lines.forEach(line => {
                            if (yPosition > 270) {
                                doc.addPage();
                                yPosition = 20;
                            }
                            doc.text(line, pageWidth - margin, yPosition, { align: 'right' });
                            yPosition += 5;
                        });
                        
                        // Add answer space
                        for (let i = 0; i < (q.lines || 3); i++) {
                            if (yPosition > 270) {
                                doc.addPage();
                                yPosition = 20;
                            }
                            doc.line(margin, yPosition, pageWidth - margin, yPosition);
                            yPosition += 8;
                        }
                        
                        yPosition += 5;
                    });
                }
                
                // Footer
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(`کل نمبر: ${paperData.totalMarks}`, pageWidth - margin, yPosition, { align: 'right' });
                yPosition += 8;
                doc.text('حاصل کردہ نمبر: _______', pageWidth - margin, yPosition, { align: 'right' });
                
                // Save the PDF
                const fileName = `urdu-paper-${new Date().getTime()}.pdf`;
                doc.save(fileName);
                
                resolve(fileName);
            } catch (error) {
                reject(error);
            }
        });
    }

    splitText(doc, text, maxWidth) {
        const lines = [];
        const words = text.split(' ');
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = doc.getTextWidth(testLine);
            
            if (testWidth <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    getPaperData() {
        const schoolName = document.getElementById('school-name').value || 'سکول کا نام';
        const paperTitle = document.getElementById('paper-title').value || 'پرچہ';
        const term = document.getElementById('term').value || 'پہلا';
        const subject = document.getElementById('subject').value || 'مضمون';
        const totalMarks = document.getElementById('total-marks').value || '100';
        const instructions = document.getElementById('instructions').value || '';
        
        // Collect objective questions
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
            instructions,
            objectiveQuestions,
            subjectiveQuestions
        };
    }
}

// Initialize PDF exporter
const pdfExporter = new PDFExporter();

// Global function for PDF export
async function exportToPDF() {
    try {
        paperGenerator.showLoading(true);
        const paperData = pdfExporter.getPaperData();
        const fileName = await pdfExporter.exportToPDF(paperData);
        paperGenerator.showNotification(`PDF کامیابی کے ساتھ ڈاؤنلوڈ ہو گیا: ${fileName}`);
    } catch (error) {
        console.error('PDF export error:', error);
        paperGenerator.showNotification('PDF ڈاؤنلوڈ میں خرابی', 'error');
    } finally {
        paperGenerator.showLoading(false);
    }
}