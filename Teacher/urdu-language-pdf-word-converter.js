// ===== تھیم مینجمنٹ =====
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// تھیم سیٹ کریں
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeButton();

// تھیم ٹوگل ایونٹ
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton();
    showNotification(`تھیم ${newTheme === 'light' ? 'لائٹ' : 'ڈارک'} میں تبدیل ہو گئی`, 'success');
});

function updateThemeButton() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark ? 
        '<i class="fas fa-sun"></i><span>لائٹ موڈ</span>' : 
        '<i class="fas fa-moon"></i><span>ڈارک موڈ</span>';
}

// ===== DOM Elements =====
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const shareBtn = document.getElementById('shareBtn');
const printBtn = document.getElementById('printBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');
const previewContent = document.getElementById('previewContent');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const pageCount = document.getElementById('pageCount');
const timeElapsed = document.getElementById('timeElapsed');
const fileInfo = document.getElementById('fileInfo');
const ocrLanguage = document.getElementById('ocrLanguage');
const outputFormat = document.getElementById('outputFormat');

// ===== گلوبل ویری ایبلز =====
let currentPdfFile = null;
let convertedText = '';
let conversionStartTime = 0;

// ===== فائل اپ لوڈ ہینڈلنگ =====
browseBtn.addEventListener('click', () => fileInput.click());

// ڈریگ اینڈ ڈراپ ایونٹس
uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    if (e.dataTransfer.files[0]?.type === 'application/pdf') {
        handleFileSelection(e.dataTransfer.files[0]);
    } else {
        showNotification('صرف PDF فائلیں قبول ہیں', 'error');
    }
});

fileInput.addEventListener('change', e => {
    if (e.target.files[0]) handleFileSelection(e.target.files[0]);
});

function handleFileSelection(file) {
    // فائل والیڈیشن
    if (file.type !== 'application/pdf') {
        showNotification('صرف PDF فائلیں قبول ہیں', 'error');
        return;
    }
    
    if (file.size > 20 * 1024 * 1024) {
        showNotification('فائل 20MB سے چھوٹی ہو', 'error');
        return;
    }

    currentPdfFile = file;
    
    // اپ لوڈ ایریا اپ ڈیٹ کریں
    uploadArea.innerHTML = `
        <div class="upload-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h4>فائل منتخب ہو گئی</h4>
        <p>${file.name}</p>
        <div class="file-types">
            <span class="file-type-badge">PDF</span>
            <span class="file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
        </div>
        <button class="browse-btn" id="changeFileBtn">
            <i class="fas fa-exchange-alt"></i>
            فائل تبدیل کریں
        </button>
    `;
    
    // فائل انفورمیشن دکھائیں
    fileInfo.innerHTML = `
        <i class="fas fa-info-circle"></i>
        فائل: ${file.name} | سائز: ${(file.size / 1024 / 1024).toFixed(2)} MB
    `;
    
    // فائل تبدیل کرنے کا بٹن
    document.getElementById('changeFileBtn').onclick = () => fileInput.click();
    
    // کنورٹ بٹن فعال کریں
    convertBtn.disabled = false;
    
    // پرانی رزلٹس صاف کریں
    resultsSection.style.display = 'none';
    progressSection.style.display = 'none';
    
    showNotification('فائل کامیابی سے اپ لوڈ ہو گئی', 'success');
}

// ===== PDF کنورژن فنکشن =====
convertBtn.addEventListener('click', async () => {
    if (!currentPdfFile) {
        showNotification('براہ کرم پہلے PDF فائل اپ لوڈ کریں', 'error');
        return;
    }

    // کنورژن شروع کریں
    await convertPdfToText(currentPdfFile);
});

async function convertPdfToText(pdfFile) {
    conversionStartTime = Date.now();
    
    // UI اپ ڈیٹ کریں
    convertBtn.disabled = true;
    loadingSpinner.classList.add('active');
    convertBtn.querySelector('.btn-text').textContent = 'تبدیل ہو رہا ہے...';
    progressSection.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    
    try {
        showNotification('PDF فائل کو پراسیس کیا جا رہا ہے...', 'info');
        
        // PDF.js کے ساتھ PDF کو امیجز میں تبدیل کریں
        const pdfData = await readFileAsArrayBuffer(pdfFile);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        
        updateProgress(10, 'PDF لوڈ ہو رہی ہے...');
        
        const numPages = pdf.numPages;
        pageCount.textContent = numPages;
        
        let fullText = '';
        
        // ہر صفحہ پراسیس کریں
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const progress = 10 + (pageNum / numPages) * 80;
            updateProgress(progress, `صفحہ ${pageNum} پراسیس ہو رہا ہے...`);
            
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });
            
            // کینوس تیار کریں
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // صفحہ رینڈر کریں
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            // کینوس سے امیج ڈیٹا حاصل کریں
            const imageData = canvas.toDataURL('image/png');
            
            // Tesseract OCR کے ساتھ متن نکالیں
            const text = await performOCR(imageData, ocrLanguage.value);
            fullText += `\n\n=== صفحہ ${pageNum} ===\n\n${text}`;
            
            // وقت اپ ڈیٹ کریں
            updateTimeElapsed();
        }
        
        updateProgress(95, 'متن کو صاف کیا جا رہا ہے...');
        
        // متن کو صاف کریں
        convertedText = cleanExtractedText(fullText, outputFormat.value);
        
        updateProgress(100, 'مکمل!');
        
        // رزلٹس دکھائیں
        showResults(convertedText);
        
        showNotification('PDF کامیابی سے متن میں تبدیل ہو گئی', 'success');
        
    } catch (error) {
        console.error('کنورژن میں خرابی:', error);
        showNotification('کنورژن ناکام ہوا۔ براہ کرم دوبارہ کوشش کریں۔', 'error');
        
        // فال بیک: صرف متن دکھائیں
        convertedText = "معذرت، کنورژن فی الحال دستیاب نہیں ہے۔ براہ کرم درج ذیل طریقہ استعمال کریں:\n\nGoogle Docs استعمال کرنے کے لیے:\n1. PDF فائل Google Drive پر اپ لوڈ کریں\n2. فائل پر رائٹ کلک کریں اور 'Open with Google Docs' منتخب کریں\n3. تمام متن کو کاپی کریں اور کسی بھی ٹیکسٹ ایڈیٹر میں پیسٹ کریں";
        showResults(convertedText);
        
    } finally {
        // UI ری سیٹ کریں
        convertBtn.disabled = false;
        loadingSpinner.classList.remove('active');
        convertBtn.querySelector('.btn-text').textContent = 'تبدیل کریں';
    }
}

// ===== OCR فنکشن =====
async function performOCR(imageData, language) {
    try {
        const worker = Tesseract.createWorker();
        
        await worker.load();
        await worker.loadLanguage(getTesseractLanguageCode(language));
        await worker.initialize(getTesseractLanguageCode(language));
        
        const { data: { text } } = await worker.recognize(imageData);
        
        await worker.terminate();
        
        return text;
    } catch (error) {
        console.error('OCR میں خرابی:', error);
        return "متن نکالنے میں مسئلہ آیا۔";
    }
}

function getTesseractLanguageCode(lang) {
    const languageMap = {
        'urd': 'urd',
        'eng': 'eng',
        'urd+eng': 'urd+eng',
        'arb': 'ara',
        'fas': 'fas'
    };
    return languageMap[lang] || 'urd';
}

// ===== ہیلپر فنکشنز =====
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function updateProgress(percent, message = '') {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${Math.round(percent)}%`;
    if (message) {
        progressText.textContent += ` - ${message}`;
    }
}

function updateTimeElapsed() {
    const elapsed = Math.floor((Date.now() - conversionStartTime) / 1000);
    timeElapsed.textContent = `${elapsed}s`;
}

function cleanExtractedText(text, format) {
    // بنیادی صفائی
    let cleaned = text
        .replace(/\n{3,}/g, '\n\n') // زیادہ نئی لائنیں ہٹائیں
        .replace(/\s+\./g, '.') // فاصلے ڈاٹ سے پہلے ہٹائیں
        .replace(/\s+,/g, ',') // فاصلے کاما سے پہلے ہٹائیں
        .replace(/\s+:/g, ':') // فاصلے کولن سے پہلے ہٹائیں
        .replace(/\s+;/g, ';') // فاصلے سیمی کولن سے پہلے ہٹائیں
        .replace(/\s+\)/g, ')') // فاصلے بند قوسین سے پہلے ہٹائیں
        .replace(/\(\s+/g, '(') // فاصلے کھلی قوسین کے بعد ہٹائیں
        .replace(/\s+-/g, '-') // فاصلے ڈیش سے پہلے ہٹائیں
        .replace(/-\s+/g, '-') // فاصلے ڈیش کے بعد ہٹائیں
        .replace(/^\s+|\s+$/g, '') // شروع اور آخر کے فاصلے ہٹائیں
        .trim();

    // فارمیٹ کے مطابق مزید صفائی
    if (format === 'formatted') {
        cleaned = cleaned
            .replace(/([.!?])\s*(?=[A-Za-z])/g, '$1\n\n') // جملوں کے درمیان فاصلہ
            .replace(/(\d+)\.\s+/g, '$1.\n') // نمبروں والی لسٹنگ
            .replace(/\n\s*\n/g, '\n\n'); // زیادہ خالی لائنیں ہٹائیں
    }

    return cleaned;
}

// ===== رزلٹس ڈسپلے =====
function showResults(text) {
    previewContent.textContent = text;
    resultsSection.style.display = 'block';
    
    // اعداد و شمار اپ ڈیٹ کریں
    updateTextStats(text);
    
    // ایکشن بٹنز فعال کریں
    copyBtn.disabled = false;
    downloadBtn.disabled = false;
    
    // سکرول ٹو رزلٹس
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function updateTextStats(text) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const chars = text.replace(/\s/g, '').length;
    
    wordCount.textContent = words.length.toLocaleString();
    charCount.textContent = chars.toLocaleString();
}

// ===== ایکشن بٹنز =====
// کاپی بٹن
copyBtn.addEventListener('click', async () => {
    if (!convertedText) {
        showNotification('کاپی کرنے کے لیے کوئی متن نہیں', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(convertedText);
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i> کاپی ہو گیا';
        copyBtn.classList.add('copied');
        showNotification('متن کلپ بورڈ میں کاپی ہو گیا!', 'success');
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> متن کاپی کریں';
            copyBtn.classList.remove('copied');
        }, 3000);
    } catch (err) {
        // فال بیک طریقہ
        const textArea = document.createElement('textarea');
        textArea.value = convertedText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i> کاپی ہو گیا';
        copyBtn.classList.add('copied');
        showNotification('متن کلپ بورڈ میں کاپی ہو گیا!', 'success');
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> متن کاپی کریں';
            copyBtn.classList.remove('copied');
        }, 3000);
    }
});

// ڈاؤن لوڈ بٹن
downloadBtn.addEventListener('click', () => {
    if (!convertedText) {
        showNotification('ڈاؤن لوڈ کرنے کے لیے کوئی متن نہیں', 'error');
        return;
    }

    const blob = new Blob([convertedText], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-text-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('متن ڈاؤن لوڈ ہو گیا', 'success');
});

// صاف کریں بٹن
clearBtn.addEventListener('click', () => {
    currentPdfFile = null;
    convertedText = '';
    
    // UI ری سیٹ کریں
    uploadArea.innerHTML = `
        <div class="upload-icon">
            <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <h4>PDF فائل ڈریگ اینڈ ڈراپ کریں</h4>
        <p>یا براؤز کر کے فائل منتخب کریں</p>
        <div class="file-types">
            <span class="file-type-badge">PDF</span>
            <span class="file-size">(20MB تک)</span>
        </div>
        <button class="browse-btn" id="browseBtn">
            <i class="fas fa-folder-open"></i>
            فائل منتخب کریں
        </button>
    `;
    
    fileInfo.innerHTML = '';
    previewContent.textContent = '';
    resultsSection.style.display = 'none';
    progressSection.style.display = 'none';
    convertBtn.disabled = true;
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
    
    // براؤز بٹن دوبارہ سیٹ کریں
    document.getElementById('browseBtn').onclick = () => fileInput.click();
    
    showNotification('سب کچھ صاف ہو گیا', 'info');
});

// شیئر بٹن
shareBtn.addEventListener('click', async () => {
    if (!convertedText) {
        showNotification('شیئر کرنے کے لیے کوئی متن نہیں', 'error');
        return;
    }

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'تبدیل شدہ اردو متن',
                text: convertedText.substring(0, 100) + '...',
                url: window.location.href
            });
        } catch (err) {
            console.log('شیئر کینسل کیا گیا');
        }
    } else {
        showNotification('شیئر فیچر آپ کے براؤزر میں سپورٹڈ نہیں', 'warning');
    }
});

// پرنٹ بٹن
printBtn.addEventListener('click', () => {
    if (!convertedText) {
        showNotification('پرنٹ کرنے کے لیے کوئی متن نہیں', 'error');
        return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html dir="rtl">
            <head>
                <title>تبدیل شدہ اردو متن</title>
                <style>
                    body { 
                        font-family: 'Noto Nastaliq Urdu', serif; 
                        line-height: 2; 
                        direction: rtl; 
                        text-align: right; 
                        padding: 20px;
                        white-space: pre-wrap;
                    }
                    @media print {
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>${convertedText}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
});

// ===== نوٹیفکیشن سسٹم =====
function showNotification(message, type = 'info') {
    // پرانی نوٹیفکیشنز ہٹائیں
    document.querySelectorAll('.notification').forEach(notification => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // نئی نوٹیفکیشن بنائیں
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // کلوز بٹن کے لیے ایونٹ
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // خود کار طریقے سے ہٹائیں
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== لینگویج سلیکٹر =====
document.getElementById('languageSelect').addEventListener('change', (e) => {
    const lang = e.target.value;
    // یہاں آپ زبان تبدیل کرنے کا منطق شامل کر سکتے ہیں
    showNotification(`زبان ${e.target.options[e.target.selectedIndex].text} میں تبدیل ہو گئی`, 'info');
});

// ===== initialization =====
document.addEventListener('DOMContentLoaded', () => {
    // ابتدائی سیٹنگز
    convertBtn.disabled = true;
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
    
    // PDF.js ورکر پاتھ سیٹ کریں
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    
    showNotification('اردو PDF کنورٹر میں خوش آمدید!', 'info');
});

// ===== پرفارمنس اور رسپانسیو نیس کے لیے اضافی فیچرز =====
// رسائیز ایونٹ
window.addEventListener('resize', () => {
    // یہاں آپ رسپانسیو ایڈجسٹمنٹس شامل کر سکتے ہیں
});

// کی بورڈ شارٹ کٹس
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        fileInput.click();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !convertBtn.disabled) {
        e.preventDefault();
        convertBtn.click();
    }
});

// آف لائن سپورٹ
window.addEventListener('online', () => {
    showNotification('انٹرنیٹ کنکشن بحال ہو گیا', 'success');
});

window.addEventListener('offline', () => {
    showNotification('انٹرنیٹ کنکشن منقطع ہو گیا', 'warning');
});

// سروس ورکر رجسٹریشن (اختیاری)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW رجسٹرڈ: ', registration);
            })
            .catch(registrationError => {
                console.log('SW رجسٹریشن فیلڈ: ', registrationError);
            });
    });
}