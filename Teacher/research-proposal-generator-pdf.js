// research-proposal-generator-pdf.js
window.exportToPDF = function() {
  const output = document.getElementById('proposalOutput');
  if (output.querySelector('.placeholder-content')) {
    alert('Generate proposal first');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const title = document.querySelector('.proposal-main-title')?.textContent || 'Research Proposal';
  const subtitle = document.querySelector('.proposal-subtitle')?.textContent || '';
  
  doc.setFontSize(20);
  doc.text(title, 105, 20, { align: 'center' });
  
  if (subtitle) {
    doc.setFontSize(16);
    doc.text(subtitle, 105, 30, { align: 'center' });
  }
  
  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Generated: ${date}`, 105, 40, { align: 'center' });
  
  let yPos = 60;
  const content = output.querySelector('.proposal-content');
  
  if (content) {
    const elements = content.querySelectorAll('h3, p, li, strong');
    
    elements.forEach(el => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const tag = el.tagName;
      const text = el.textContent.trim();
      
      if (!text) return;
      
      if (tag === 'H3') {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(text, 20, yPos);
        yPos += 10;
      } 
      else if (tag === 'P') {
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, 20, yPos);
        yPos += lines.length * 7;
      }
      else if (tag === 'LI') {
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text('• ' + text, 25, yPos);
        yPos += 7;
      }
      else if (tag === 'STRONG') {
        doc.setFont(undefined, 'bold');
      }
      
      yPos += 5;
    });
  }
  
  doc.save(`research_proposal_${Date.now()}.pdf`);
  
  // Update stats
  if (window.stats) {
    window.stats.exports++;
    window.updateStats();
    window.saveStats();
  }
  
  window.notify('PDF exported successfully!');
};