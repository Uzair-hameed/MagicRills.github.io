// API Key - OpenRouter (Grammar Check)
const API_KEY = "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";

document.addEventListener('DOMContentLoaded', function () {
  const elements = {
    inputText: document.getElementById('inputText'),
    grammarInput: document.getElementById('grammarInput'),
    fromLang: document.getElementById('fromLang'),
    toLang: document.getElementById('toLang'),
    fromLangDisplay: document.getElementById('fromLangDisplay'),
    toLangDisplay: document.getElementById('toLangDisplay'),
    outputBox: document.getElementById('outputBox'),
    grammarOutput: document.getElementById('grammarOutput'),
    grammarSuggestions: document.getElementById('grammarSuggestions'),
    charCount: document.getElementById('charCount'),
    grammarCharCount: document.getElementById('grammarCharCount'),
    translationLoader: document.getElementById('translationLoader'),
    grammarLoader: document.getElementById('grammarLoader'),
    themeToggle: document.getElementById('themeToggle')
  };

  // Character Count
  elements.inputText.addEventListener('input', () => elements.charCount.textContent = elements.inputText.value.length);
  elements.grammarInput.addEventListener('input', () => elements.grammarCharCount.textContent = elements.grammarInput.value.length);

  // Language Display Update
  const updateLangDisplay = () => {
    elements.fromLangDisplay.textContent = elements.fromLang.options[elements.fromLang.selectedIndex].text;
    elements.toLangDisplay.textContent = elements.toLang.options[elements.toLang.selectedIndex].text;
  };
  elements.fromLang.addEventListener('change', updateLangDisplay);
  elements.toLang.addEventListener('change', updateLangDisplay);

  // Swap Languages
  document.getElementById('swapBtn').addEventListener('click', () => {
    [elements.fromLang.value, elements.toLang.value] = [elements.toLang.value, elements.fromLang.value];
    updateLangDisplay();
  });

  // Tab Switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
    });
  });

  // Translate
  document.getElementById('translateBtn').addEventListener('click', () => {
    const text = elements.inputText.value.trim();
    if (!text) return alert("Please enter text to translate.");

    elements.translationLoader.style.display = 'block';
    elements.outputBox.textContent = 'Translating...';

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${elements.fromLang.value}&tl=${elements.toLang.value}&dt=t&q=${encodeURIComponent(text)}`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        const translated = data[0].map(item => item[0]).join('');
        elements.outputBox.textContent = translated;
        elements.translationLoader.style.display = 'none';
      })
      .catch(() => {
        elements.outputBox.textContent = "Translation failed.";
        elements.translationLoader.style.display = 'none';
      });
  });

  // Grammar Check
  document.getElementById('checkGrammarBtn').addEventListener('click', () => {
    const text = elements.grammarInput.value.trim();
    if (!text) return alert("Please enter text to check.");

    elements.grammarLoader.style.display = 'block';
    elements.grammarOutput.textContent = 'Checking...';
    elements.grammarSuggestions.innerHTML = '';

    fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a grammar expert. Return JSON with 'corrected_text' and 'suggestions' array." },
          { role: "user", content: `Check: "${text}"` }
        ]
      })
    })
    .then(r => r.json())
    .then(data => {
      elements.grammarLoader.style.display = 'none';
      const result = JSON.parse(data.choices[0].message.content);
      elements.grammarOutput.textContent = result.corrected_text || text;
      if (result.suggestions?.length) {
        elements.grammarSuggestions.innerHTML = '<h4>Suggestions:</h4>' + result.suggestions.map(s => `
          <div class="suggestion-item">
            <strong>Issue:</strong> ${s.original}<br>
            <strong>Fix:</strong> ${s.corrected}<br>
            <strong>Why:</strong> ${s.explanation}
          </div>
        `).join('');
      } else {
        elements.grammarSuggestions.innerHTML = '<p>No issues found!</p>';
      }
    })
    .catch(() => {
      elements.grammarOutput.textContent = "Grammar check failed.";
      elements.grammarLoader.style.display = 'none';
    });
  });

  // Copy, Speak, Download
  window.copyText = (id) => {
    navigator.clipboard.writeText(document.getElementById(id).textContent).then(() => alert("Copied!"));
  };

  window.speakText = (id) => {
    const text = document.getElementById(id).textContent;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = elements.toLang.value === 'ur' ? 'ur-PK' : 'en-US';
    speechSynthesis.speak(utterance);
  };

  window.downloadText = (id) => {
    const text = document.getElementById(id).textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    a.click();
  };

  // Dark Mode Toggle
  elements.themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    elements.themeToggle.textContent = isDark ? 'Dark Mode' : 'Light Mode';
  });

  // Initialize
  updateLangDisplay();
});