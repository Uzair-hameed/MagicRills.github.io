// research-proposal-generator-word.js
window.exportToWord = function() {
  const output = document.getElementById('proposalOutput');
  if (output.querySelector('.placeholder-content')) {
    alert('Generate proposal first');
    return;
  }

  const content = output.innerHTML;
  
  // Create Word document HTML structure
  const wordHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Research Proposal</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 2cm; }
        h1 { color: #2c5aa0; text-align: center; }
        h2 { color: #2c5aa0; border-bottom: 1px solid #2c5aa0; }
        h3 { color: #2c5aa0; }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

  // Convert to Blob and download
  const blob = new Blob([wordHTML], { type: 'application/msword' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `research_proposal_${Date.now()}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Update stats
  if (window.stats) {
    window.stats.exports++;
    window.updateStats();
    window.saveStats();
  }
  
  window.notify('Word document exported!');
};