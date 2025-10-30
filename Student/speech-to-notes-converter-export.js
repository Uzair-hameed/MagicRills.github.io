function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const summary = document.getElementById('summaryContent').innerText;
  const transcription = document.getElementById('transcription').value;

  doc.setFontSize(20);
  doc.text('Speech-to-Notes Summary', 20, 20);

  doc.setFontSize(12);
  doc.text(`Transcription: ${transcription.substring(0, 100)}...`, 20, 40);

  doc.setFontSize(14);
  doc.text('AI Notes:', 20, 60);

  const split = doc.splitTextToSize(summary, 170);
  doc.text(split, 20, 80);

  doc.setFontSize(10);
  doc.text(`MagicRills AI Tool #47 | ${new Date().toLocaleString()}`, 20, 280);

  doc.save('magicrills-speech-notes.pdf');
}

function exportDOCX() {
  const { Document, Packer, Paragraph, TextRun } = docx;
  const summary = document.getElementById('summaryContent').innerText;
  const transcription = document.getElementById('transcription').value;

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ children: [new TextRun({ text: 'Speech-to-Notes Summary', bold: true, size: 32 })] }),
        new Paragraph({ children: [new TextRun(`Transcription: ${transcription}`)] }),
        new Paragraph({ children: [new TextRun(summary)] }),
        new Paragraph({ children: [new TextRun({ text: `MagicRills AI #47 | ${new Date().toLocaleString()}`, italics: true, size: 20 })] })
      ]
    }]
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, 'magicrills-speech-notes.docx');
  });
}

function copySummary() {
  const text = document.getElementById('summaryContent').innerText;
  navigator.clipboard.writeText(text).then(() => alert('Copied!'));
}