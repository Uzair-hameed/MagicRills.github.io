// PDF Export functionality - Pure jsPDF solution
function exportToPdf() {
    const resumeMaker = window.resumeMaker;
    const data = resumeMaker.getFormData();
    
    // Show loading state
    resumeMaker.showMessage('Generating PDF...', 'info');
    
    try {
        // Use jsPDF directly - much more reliable than html2pdf
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        let yPosition = 20;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - (2 * margin);
        
        // Set default font
        doc.setFont('helvetica');
        
        // Add Name
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text(data.personal.fullName || 'Your Name', margin, yPosition);
        yPosition += 10;
        
        // Add Job Title
        doc.setFontSize(16);
        doc.setFont(undefined, 'normal');
        doc.text(data.personal.jobTitle || 'Professional Title', margin, yPosition);
        yPosition += 15;
        
        // Add Contact Information
        const contactInfo = [];
        if (data.personal.email) contactInfo.push(data.personal.email);
        if (data.personal.phone) contactInfo.push(data.personal.phone);
        if (data.personal.location) contactInfo.push(data.personal.location);
        
        if (contactInfo.length > 0) {
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(contactInfo.join(' | '), margin, yPosition);
            yPosition += 10;
        }
        
        // Add separator line
        doc.setDrawColor(200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;
        
        // Professional Summary
        if (data.personal.summary) {
            yPosition = addSectionHeading(doc, 'PROFESSIONAL SUMMARY', margin, yPosition);
            
            doc.setFontSize(11);
            doc.setTextColor(0);
            const splitSummary = doc.splitTextToSize(data.personal.summary, contentWidth);
            doc.text(splitSummary, margin, yPosition);
            yPosition += (splitSummary.length * 5) + 10;
        }
        
        // Check page break
        yPosition = checkPageBreak(doc, yPosition, pageHeight, margin);
        
        // Work Experience
        if (data.experiences.filter(exp => exp.jobTitle || exp.company).length > 0) {
            yPosition = addSectionHeading(doc, 'WORK EXPERIENCE', margin, yPosition);
            
            data.experiences.filter(exp => exp.jobTitle || exp.company).forEach(exp => {
                yPosition = checkPageBreak(doc, yPosition, pageHeight, margin, 20);
                
                // Job Title and Company
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                let titleText = [];
                if (exp.jobTitle) titleText.push(exp.jobTitle);
                if (exp.company) titleText.push('- ' + exp.company);
                
                if (titleText.length > 0) {
                    doc.text(titleText.join(' '), margin, yPosition);
                    yPosition += 6;
                }
                
                // Duration
                if (exp.duration) {
                    doc.setFontSize(10);
                    doc.setFont(undefined, 'italic');
                    doc.setTextColor(100);
                    doc.text(exp.duration, margin, yPosition);
                    yPosition += 5;
                }
                
                // Description
                if (exp.description) {
                    doc.setFontSize(10);
                    doc.setFont(undefined, 'normal');
                    doc.setTextColor(0);
                    const splitDesc = doc.splitTextToSize(exp.description, contentWidth);
                    doc.text(splitDesc, margin, yPosition);
                    yPosition += (splitDesc.length * 4) + 8;
                } else {
                    yPosition += 8;
                }
            });
        }
        
        // Check page break
        yPosition = checkPageBreak(doc, yPosition, pageHeight, margin);
        
        // Education
        if (data.education.filter(edu => edu.degree || edu.institution).length > 0) {
            yPosition = addSectionHeading(doc, 'EDUCATION', margin, yPosition);
            
            data.education.filter(edu => edu.degree || edu.institution).forEach(edu => {
                yPosition = checkPageBreak(doc, yPosition, pageHeight, margin, 20);
                
                // Degree and Institution
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                let eduText = [];
                if (edu.degree) eduText.push(edu.degree);
                if (edu.institution) eduText.push('- ' + edu.institution);
                
                if (eduText.length > 0) {
                    doc.text(eduText.join(' '), margin, yPosition);
                    yPosition += 6;
                }
                
                // Duration
                if (edu.duration) {
                    doc.setFontSize(10);
                    doc.setFont(undefined, 'italic');
                    doc.setTextColor(100);
                    doc.text(edu.duration, margin, yPosition);
                    yPosition += 5;
                }
                
                // Description
                if (edu.description) {
                    doc.setFontSize(10);
                    doc.setFont(undefined, 'normal');
                    doc.setTextColor(0);
                    const splitDesc = doc.splitTextToSize(edu.description, contentWidth);
                    doc.text(splitDesc, margin, yPosition);
                    yPosition += (splitDesc.length * 4) + 8;
                } else {
                    yPosition += 8;
                }
            });
        }
        
        // Check page break
        yPosition = checkPageBreak(doc, yPosition, pageHeight, margin);
        
        // Skills
        if (data.skills.filter(skill => skill.name).length > 0) {
            yPosition = addSectionHeading(doc, 'SKILLS', margin, yPosition);
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            const skillsText = data.skills
                .filter(skill => skill.name)
                .map(skill => skill.level ? `${skill.name} (${skill.level})` : skill.name)
                .join(', ');
            
            const splitSkills = doc.splitTextToSize(skillsText, contentWidth);
            doc.text(splitSkills, margin, yPosition);
            yPosition += (splitSkills.length * 4) + 10;
        }
        
        // Check page break
        yPosition = checkPageBreak(doc, yPosition, pageHeight, margin);
        
        // Additional Information
        if (data.personal.languages || data.personal.certifications || data.personal.projects || data.personal.interests) {
            yPosition = addSectionHeading(doc, 'ADDITIONAL INFORMATION', margin, yPosition);
            
            doc.setFontSize(10);
            let additionalY = yPosition;
            
            if (data.personal.languages) {
                doc.text(`Languages: ${data.personal.languages}`, margin, additionalY);
                additionalY += 5;
            }
            
            if (data.personal.certifications) {
                doc.text(`Certifications: ${data.personal.certifications}`, margin, additionalY);
                additionalY += 5;
            }
            
            if (data.personal.projects) {
                const projectsText = `Projects: ${data.personal.projects}`;
                const splitProjects = doc.splitTextToSize(projectsText, contentWidth);
                doc.text(splitProjects, margin, additionalY);
                additionalY += (splitProjects.length * 4) + 2;
            }
            
            if (data.personal.interests) {
                const interestsText = `Interests: ${data.personal.interests}`;
                const splitInterests = doc.splitTextToSize(interestsText, contentWidth);
                doc.text(splitInterests, margin, additionalY);
            }
        }
        
        // Add page numbers
        addPageNumbers(doc);
        
        // Save the PDF
        const fileName = `${data.personal.fullName || 'resume'}.pdf`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        doc.save(fileName);
        
        resumeMaker.showMessage('PDF downloaded successfully!');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        resumeMaker.showMessage('Error generating PDF. Please try again.', 'error');
        
        // Ultimate fallback - try simple text-based PDF
        setTimeout(() => generateSimplePdf(data), 500);
    }
}

function addSectionHeading(doc, title, margin, yPosition) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text(title, margin, yPosition);
    yPosition += 8;
    
    // Add underline
    doc.setDrawColor(0);
    doc.line(margin, yPosition, margin + 30, yPosition);
    yPosition += 12;
    
    return yPosition;
}

function checkPageBreak(doc, yPosition, pageHeight, margin, requiredSpace = 50) {
    if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        addPageNumbers(doc); // Add page numbers to new page
        return margin;
    }
    return yPosition;
}

function addPageNumbers(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }
}

// Ultimate fallback PDF generator
function generateSimplePdf(data) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        let y = 20;
        
        // Simple header
        doc.setFontSize(20);
        doc.text(data.personal.fullName || 'Resume', 20, y);
        y += 10;
        
        doc.setFontSize(12);
        doc.text(data.personal.jobTitle || '', 20, y);
        y += 15;
        
        // Contact info
        if (data.personal.email || data.personal.phone || data.personal.location) {
            const contact = [];
            if (data.personal.email) contact.push(data.personal.email);
            if (data.personal.phone) contact.push(data.personal.phone);
            if (data.personal.location) contact.push(data.personal.location);
            doc.text(contact.join(' | '), 20, y);
            y += 20;
        }
        
        // Simple content
        if (data.personal.summary) {
            doc.text('Summary:', 20, y);
            y += 7;
            doc.setFontSize(10);
            const lines = doc.splitTextToSize(data.personal.summary, 170);
            doc.text(lines, 20, y);
            y += (lines.length * 5) + 10;
        }
        
        // Save simple PDF
        doc.save('resume_simple.pdf');
        window.resumeMaker.showMessage('Simple PDF generated as fallback!');
        
    } catch (error) {
        window.resumeMaker.showMessage('PDF generation completely failed. Please try printing the page instead.', 'error');
    }
}