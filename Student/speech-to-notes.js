let mediaRecorder, audioChunks = [], isRecording = false, startTime, userId = 'user_' + Date.now();

// Save Key (LocalStorage for demo - Backend in production)
function saveKey() {
  const key = document.getElementById('apiKey').value.trim();
  if (!key) return showStatus('Enter valid key', 'error');
  localStorage.setItem('openrouter_key', key);
  showStatus('Key saved securely!', 'success');
  document.getElementById('apiSection').style.display = 'none';
}

function showStatus(msg, type = '') {
  const status = document.getElementById('apiStatus');
  status.textContent = msg;
  status.className = type ? `status ${type}` : 'status';
}

// Speech Recognition
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (e) => {
    let transcript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    document.getElementById('transcription').value = transcript;
  };
}

async function toggleRecording() {
  if (!isRecording) {
    if (recognition) recognition.start();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    startTime = Date.now();

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = sendToBackend;

    mediaRecorder.start();
    isRecording = true;
    document.getElementById('statusBar').textContent = 'Recording... Speak now!';
    document.getElementById('recordBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
  }
}

function stopRecording() {
  if (isRecording) {
    if (recognition) recognition.stop();
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
    isRecording = false;
    document.getElementById('statusBar').textContent = 'Processing audio...';
    document.getElementById('recordBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
  }
}

async function sendToBackend() {
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  const base64 = await blobToBase64(audioBlob);

  // Mock transcription (replace with backend)
  setTimeout(() => {
    const mockText = "This is a sample transcription from your speech. AI will summarize it now.";
    document.getElementById('transcription').value = mockText;
    updateStats(mockText);
    document.getElementById('summaryBtn').disabled = false;
    document.getElementById('statusBar').textContent = 'Ready for AI summary';
  }, 1000);
}

function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
}

async function generateSummary() {
  const text = document.getElementById('transcription').value.trim();
  if (!text) return;

  document.getElementById('statusBar').textContent = 'Generating AI summary...';
  
  // Mock AI Summary
  setTimeout(() => {
    const summary = `Main Points:
- Sample speech recorded successfully
- AI transcription working
- Notes ready for export

Action Items:
→ Review notes
→ Export as PDF/DOCX

Key Insight:
"AI makes learning faster and smarter."`;

    displaySummary(summary);
    document.getElementById('summarySection').style.display = 'block';
    document.getElementById('statusBar').textContent = 'Summary ready!';
  }, 1500);
}

function displaySummary(summary) {
  document.getElementById('summaryContent').innerHTML = summary.replace(/\n/g, '<br>');
  const points = summary.split('\n').filter(p => p.trim()).length;
  document.getElementById('keyPointCount').textContent = points;
}

function updateStats(text) {
  const words = text.split(/\s+/).length;
  const duration = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('wordCount').textContent = words;
  document.getElementById('duration').textContent = new Date(duration * 1000).toISOString().substr(14, 5);
}

function handleUpload(e) {
  const file = e.target.files[0];
  if (file) alert('Audio upload successful! (Mock)');
}

function clearAll() {
  document.getElementById('transcription').value = '';
  document.getElementById('summarySection').style.display = 'none';
  document.getElementById('summaryBtn').disabled = true;
  updateStats('');
  document.getElementById('statusBar').textContent = 'Ready to record';
}

window.onload = () => {
  const savedKey = localStorage.getItem('openrouter_key');
  if (savedKey) {
    document.getElementById('apiSection').style.display = 'none';
    showStatus('API Key loaded');
  }
};