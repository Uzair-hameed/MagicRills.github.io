// reading-dashboard-for-registers.js

// ============================================
// COMPLETE REGISTERS DATA (24 Registers)
// ============================================

const registersData = [
    { id: 1, slug: "student-attendance", name: "Student Attendance Register", nameUr: "طلبا حاضری رجسٹر", icon: "fas fa-user-graduate", desc: "Daily student attendance record", descUr: "طلبا کی روزانہ حاضری کا ریکارڈ" },
    { id: 2, slug: "teacher-attendance", name: "Staff Attendance Register", nameUr: "اسٹاف حاضری رجسٹر", icon: "fas fa-chalkboard-teacher", desc: "Teachers and staff attendance", descUr: "اساتذہ اور عملے کی حاضری" },
    { id: 3, slug: "general-register", name: "General Register (GR)", nameUr: "جنرل رجسٹر", icon: "fas fa-archive", desc: "Permanent student record", descUr: "مستقل طلبہ ریکارڈ" },
    { id: 4, slug: "cash-register", name: "Cash Register", nameUr: "کیش رجسٹر", icon: "fas fa-money-bill-wave", desc: "Financial transactions record", descUr: "مالی لین دین کا ریکارڈ" },
    { id: 5, slug: "stock-register", name: "Stock Register", nameUr: "اسٹاک رجسٹر", icon: "fas fa-boxes", desc: "School assets inventory", descUr: "اسکول کے اثاثوں کی فہرست" },
    { id: 6, slug: "punishment-register", name: "Disciplinary Register", nameUr: "تادیبی کارروائی رجسٹر", icon: "fas fa-gavel", desc: "Student disciplinary actions", descUr: "طلبا کی تادیبی کارروائیاں" },
    { id: 7, slug: "library-register", name: "Library Register", nameUr: "لائبریری رجسٹر", icon: "fas fa-book", desc: "Books circulation record", descUr: "کتب کی آمد و رفت" },
    { id: 8, slug: "movement-register", name: "Movement Register", nameUr: "آمد و رفت رجسٹر", icon: "fas fa-people-arrows", desc: "In/Out movement", descUr: "اسکول میں داخل/خارج" },
    { id: 9, slug: "visitors-register", name: "Visitors Register", nameUr: "زائرین رجسٹر", icon: "fas fa-user-friends", desc: "School visitors record", descUr: "اسکول آنے والے مہمان" },
    { id: 10, slug: "examination-register", name: "Examination Register", nameUr: "امتحانی رجسٹر", icon: "fas fa-clipboard-check", desc: "Exam results record", descUr: "امتحانی نتائج کا ریکارڈ" },
    { id: 11, slug: "scholarship-register", name: "Scholarship Register", nameUr: "اسکالرشپ رجسٹر", icon: "fas fa-award", desc: "Financial aid record", descUr: "مالی امداد کا ریکارڈ" },
    { id: 12, slug: "health-register", name: "Health Register", nameUr: "صحت رجسٹر", icon: "fas fa-heartbeat", desc: "Student health information", descUr: "طلبا کی صحت سے متعلق معلومات" },
    { id: 13, slug: "staff-register", name: "Staff Personal File Register", nameUr: "اسٹاف پرسنل فائل رجسٹر", icon: "fas fa-id-card", desc: "Staff personal information", descUr: "اسٹاف کی ذاتی معلومات" },
    { id: 14, slug: "fee-register", name: "Fee Collection Register", nameUr: "فیس وصولی رجسٹر", icon: "fas fa-receipt", desc: "Monthly fee record", descUr: "ماہانہ فیس کا ریکارڈ" },
    { id: 15, slug: "building-register", name: "Building Maintenance Register", nameUr: "عمارت مرمت رجسٹر", icon: "fas fa-building", desc: "Building maintenance record", descUr: "عمارت کی دیکھ بھال" },
    { id: 16, slug: "furniture-register", name: "Furniture Register", nameUr: "فرنیچر رجسٹر", icon: "fas fa-couch", desc: "Furniture inventory", descUr: "فرنیچر کی فہرست" },
    { id: 17, slug: "computer-lab-register", name: "Computer Lab Register", nameUr: "کمپیوٹر لیب رجسٹر", icon: "fas fa-laptop-code", desc: "Computer lab usage", descUr: "کمپیوٹر لیب کا استعمال" },
    { id: 18, slug: "science-lab-register", name: "Science Lab Register", nameUr: "سائنس لیب رجسٹر", icon: "fas fa-flask", desc: "Science lab experiments", descUr: "سائنس لیب کے تجربات" },
    { id: 19, slug: "sports-register", name: "Sports Register", nameUr: "اسپورٹس رجسٹر", icon: "fas fa-futbol", desc: "Sports equipment & activities", descUr: "کھیلوں کا سامان اور سرگرمیاں" },
    { id: 20, slug: "ptm-register", name: "Parent-Teacher Meeting Register", nameUr: "والدین اساتذہ میٹنگ رجسٹر", icon: "fas fa-handshake", desc: "PTM records", descUr: "پی ٹی ایم کا ریکارڈ" },
    { id: 21, slug: "inspection-register", name: "Inspection Register", nameUr: "معائنہ رجسٹر", icon: "fas fa-clipboard-list", desc: "DEO/EDO inspection records", descUr: "ڈی ای او / ای ڈی او معائنہ" },
    { id: 22, slug: "staff-meeting-register", name: "Staff Meeting Register", nameUr: "اسٹاف میٹنگ رجسٹر", icon: "fas fa-users", desc: "Meeting minutes", descUr: "میٹنگ کے منٹس" },
    { id: 23, slug: "cca-register", name: "Co-Curricular Register", nameUr: "ہم نصابی سرگرمیاں رجسٹر", icon: "fas fa-palette", desc: "CCA records", descUr: "سی سی اے کا ریکارڈ" },
    { id: 24, slug: "tender-register", name: "Tender Register", nameUr: "ٹینڈر رجسٹر", icon: "fas fa-file-signature", desc: "Procurement tenders", descUr: "خریداری کے ٹینڈر" }
];

// Province-specific policy content
const provincePolicyContent = {
    sindh: {
        name: "Sindh",
        nameUr: "سندھ",
        attendanceRules: "Daily attendance must be recorded before 9:00 AM. Monthly report to DEO by 5th.",
        retentionPeriod: "5 years minimum retention",
        specialNotes: "Sindh Education Act 2013 applies"
    },
    punjab: {
        name: "Punjab",
        nameUr: "پنجاب",
        attendanceRules: "Biometric attendance mandatory. Monthly report by 3rd of each month.",
        retentionPeriod: "7 years minimum retention",
        specialNotes: "Punjab Schools Reforms Roadmap 2025"
    },
    balochistan: {
        name: "Balochistan",
        nameUr: "بلوچستان",
        attendanceRules: "Manual register with daily verification. Quarterly audit required.",
        retentionPeriod: "5 years minimum retention",
        specialNotes: "Balochistan Education Sector Plan"
    },
    kpk: {
        name: "Khyber Pakhtunkhwa",
        nameUr: "خیبرپختونخواہ",
        attendanceRules: "Digital tracking encouraged. Weekly principal verification.",
        retentionPeriod: "6 years minimum retention",
        specialNotes: "KP Education Policy 2020"
    }
};

// Global state
let currentProvince = "sindh";
let currentView = "grid";
let darkMode = localStorage.getItem("darkMode") === "true";
let isEnglish = true;
let currentRegister = null;
let reactionsData = {};
let usageCounts = {};

// Reactions emojis
const REACTIONS = [
    { emoji: "👍", type: "like", label: "Like" },
    { emoji: "❤️", type: "love", label: "Love" },
    { emoji: "😮", type: "wow", label: "Wow" },
    { emoji: "😢", type: "sad", label: "Sad" },
    { emoji: "😠", type: "angry", label: "Angry" },
    { emoji: "😂", type: "laugh", label: "Laugh" },
    { emoji: "🎉", type: "celebrate", label: "Celebrate" }
];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    if (darkMode) document.body.classList.add("dark");
    renderRegisters();
    loadGlobalStats();
    setupEventListeners();
    initParticles();
    updateUILanguage();
    showToast(isEnglish ? "Welcome! Register Policy Dashboard Loaded" : "خوش آمدید! رجسٹر پالیسی ڈیش بورڈ لوڈ ہو گیا", "success");
});

function setupEventListeners() {
    // Province buttons
    document.querySelectorAll(".province-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".province-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentProvince = btn.dataset.province;
            renderRegisters();
            showToast(isEnglish ? `${provincePolicyContent[currentProvince].name} policies loaded` : `${provincePolicyContent[currentProvince].nameUr} کی پالیسیاں لوڈ ہو گئیں`, "success");
        });
    });
    
    // Search
    const searchEn = document.getElementById("searchInput");
    const searchUr = document.getElementById("searchInputUr");
    
    searchEn.addEventListener("input", (e) => renderRegisters(e.target.value));
    searchUr.addEventListener("input", (e) => renderRegisters(e.target.value));
    
    // Dark mode
    document.getElementById("darkModeToggle").addEventListener("click", () => {
        darkMode = !darkMode;
        localStorage.setItem("darkMode", darkMode);
        document.body.classList.toggle("dark", darkMode);
        showToast(darkMode ? "Dark Mode ON" : "Light Mode ON", "info");
    });
    
    // View toggle
    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentView = btn.dataset.view;
            renderRegisters();
        });
    });
    
    // Scroll buttons
    document.getElementById("scrollUpBtn").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.getElementById("scrollDownBtn").addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
    
    // Share page
    document.getElementById("sharePageBtn").addEventListener("click", sharePage);
    
    // Compare button
    document.getElementById("compareBtn").addEventListener("click", openCompareModal);
    
    // Language toggle
    document.getElementById("langToggle").addEventListener("click", () => {
        isEnglish = !isEnglish;
        updateUILanguage();
        renderRegisters();
        showToast(isEnglish ? "Switched to English" : "اردو موڈ میں تبدیل", "info");
    });
    
    // Voice search
    document.getElementById("voiceSearchBtn").addEventListener("click", startVoiceSearch);
    
    // Modal close
    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
        });
    });
    
    // Close modal on outside click
    window.addEventListener("click", (e) => {
        document.querySelectorAll(".modal").forEach(modal => {
            if (e.target === modal) modal.style.display = "none";
        });
    });
}

function updateUILanguage() {
    // Toggle visibility of English/Urdu elements
    document.querySelectorAll(".sub-en, .label-en, .lang-text-en, .btn-text-en, .header-title-en, .export-txt-en, .export-pdf-en, .ai-sum-en, .ai-title-en, .copy-en, .compare-title-en").forEach(el => {
        el.style.display = isEnglish ? "block" : "none";
    });
    document.querySelectorAll(".sub-ur, .label-ur, .lang-text-ur, .btn-text-ur, .header-title-ur, .export-txt-ur, .export-pdf-ur, .ai-sum-ur, .ai-title-ur, .copy-ur, .compare-title-ur").forEach(el => {
        el.style.display = isEnglish ? "none" : "block";
    });
    
    // Update search inputs
    document.getElementById("searchInput").style.display = isEnglish ? "block" : "none";
    document.getElementById("searchInputUr").style.display = isEnglish ? "none" : "block";
    
    // Update province names
    document.querySelectorAll(".province-btn").forEach(btn => {
        const province = btn.dataset.province;
        const nameSpan = btn.querySelector(".province-name");
        if (nameSpan) {
            nameSpan.textContent = isEnglish ? provincePolicyContent[province]?.name || province : provincePolicyContent[province]?.nameUr || province;
        }
    });
    
    // Update badge text
    const badgeText = document.querySelector(".badge-text");
    if (badgeText) {
        badgeText.textContent = isEnglish ? "Govt of Pakistan - Education Reforms 2026" : "حکومت پاکستان - تعلیمی اصلاحات 2026";
    }
}

function renderRegisters(searchTerm = "") {
    const grid = document.getElementById("registersGrid");
    const term = (searchTerm || "").toLowerCase();
    
    let filtered = registersData.filter(r => {
        const nameMatch = isEnglish ? r.name.toLowerCase().includes(term) : r.nameUr.includes(term);
        const descMatch = isEnglish ? r.desc.toLowerCase().includes(term) : r.descUr.includes(term);
        return nameMatch || descMatch;
    });
    
    grid.className = currentView === "grid" ? "registers-grid" : "registers-grid list-view";
    
    grid.innerHTML = filtered.map(register => `
        <div class="register-card" onclick="openRegisterDetail('${register.slug}')">
            <div class="register-icon">
                <i class="${register.icon}"></i>
            </div>
            <h3>${isEnglish ? register.name : register.nameUr}</h3>
            <p class="register-desc">${isEnglish ? register.desc : register.descUr}</p>
            <div class="reactions-bar" id="reactions-${register.id}">
                ${REACTIONS.map(r => `
                    <button class="reaction-btn" data-register="${register.slug}" data-reaction="${r.type}" onclick="event.stopPropagation(); addReaction('${register.slug}', '${r.type}')">
                        ${r.emoji} <span class="reaction-count" id="react-${register.slug}-${r.type}">0</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `);
    
    // Load reactions for each register
    registersData.forEach(reg => loadReactions(reg.slug));
}

function openRegisterDetail(slug) {
    currentRegister = registersData.find(r => r.slug === slug);
    if (!currentRegister) return;
    
    incrementUsage(slug);
    
    const modal = document.getElementById("detailModal");
    const content = document.getElementById("detailContent");
    const policy = provincePolicyContent[currentProvince];
    
    content.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <div class="register-icon" style="width: 60px; height: 60px;">
                <i class="${currentRegister.icon}" style="font-size: 2rem;"></i>
            </div>
            <div>
                <h2>${isEnglish ? currentRegister.name : currentRegister.nameUr}</h2>
                <p style="color: var(--gray);">${isEnglish ? currentRegister.desc : currentRegister.descUr}</p>
            </div>
        </div>
        
        <div class="policy-section">
            <h4><i class="fas fa-building"></i> ${isEnglish ? "Province" : "صوبہ"}: ${isEnglish ? policy.name : policy.nameUr}</h4>
        </div>
        
        <div class="pros-cons">
            <div class="pros-box">
                <h4><i class="fas fa-check-circle" style="color: #10b981;"></i> ${isEnglish ? "Benefits" : "فوائد"}</h4>
                <div class="policy-item">${isEnglish ? "Ensures accurate record keeping" : "درست ریکارڈ کیپنگ کو یقینی بناتا ہے"}</div>
                <div class="policy-item">${isEnglish ? "Legal documentation for audit" : "آڈٹ کے لیے قانونی دستاویز"}</div>
                <div class="policy-item">${isEnglish ? "Improves accountability" : "احتساب کو بہتر بناتا ہے"}</div>
            </div>
            <div class="cons-box">
                <h4><i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i> ${isEnglish ? "Challenges" : "چیلنجز"}</h4>
                <div class="policy-item">${isEnglish ? "Time-consuming manual entry" : "وقت طلب دستی اندراج"}</div>
                <div class="policy-item">${isEnglish ? "Potential for human error" : "انسانی غلطی کا امکان"}</div>
                <div class="policy-item">${isEnglish ? "Requires regular verification" : "باقاعدہ تصدیق کی ضرورت"}</div>
            </div>
        </div>
        
        <div class="policy-section">
            <h4><i class="fas fa-clipboard-list"></i> ${isEnglish ? "Policy Guidelines" : "پالیسی گائیڈ لائنز"}</h4>
            <div class="policy-item">${policy.attendanceRules}</div>
            <div class="policy-item">${isEnglish ? "Principal must verify weekly" : "پرنسپل کو ہفتہ وار تصدیق کرنی ہوگی"}</div>
            <div class="policy-item">${isEnglish ? `Retention: ${policy.retentionPeriod}` : `ریکارڈ رکھنے کی مدت: ${policy.retentionPeriod}`}</div>
            <div class="policy-item">${policy.specialNotes}</div>
        </div>
        
        <div class="policy-section">
            <h4><i class="fas fa-shoe-prints"></i> ${isEnglish ? "Step-by-Step Procedure" : "مرحلہ وار طریقہ کار"}</h4>
            <div class="policy-item">1. ${isEnglish ? "Open register to current date" : "رجسٹر کو موجودہ تاریخ پر کھولیں"}</div>
            <div class="policy-item">2. ${isEnglish ? "Record all required information" : "تمام مطلوبہ معلومات درج کریں"}</div>
            <div class="policy-item">3. ${isEnglish ? "Get authorized signature" : "مجاز دستخط حاصل کریں"}</div>
            <div class="policy-item">4. ${isEnglish ? "Submit monthly report to DEO" : "ماہانہ رپورٹ ڈی ای او کو جمع کروائیں"}</div>
        </div>
    `;
    
    modal.style.display = "flex";
    
    // Setup export buttons
    document.getElementById("exportTxtBtn").onclick = () => exportContent("txt");
    document.getElementById("exportPdfBtn").onclick = () => exportContent("pdf");
    document.getElementById("aiSummarizeBtn").onclick = () => openAISummary();
}

function incrementUsage(slug) {
    usageCounts[slug] = (usageCounts[slug] || 0) + 1;
    updateGlobalStats();
}

function loadReactions(slug) {
    // Simulate loading from TiDB
    REACTIONS.forEach(r => {
        const countSpan = document.getElementById(`react-${slug}-${r.type}`);
        if (countSpan) {
            const count = reactionsData[`${slug}_${r.type}`] || 0;
            countSpan.textContent = count;
        }
    });
}

function addReaction(slug, type) {
    const key = `${slug}_${type}`;
    reactionsData[key] = (reactionsData[key] || 0) + 1;
    loadReactions(slug);
    updateGlobalStats();
    showToast(isEnglish ? `Reaction added: ${type}` : `ری ایکشن شامل کر دیا: ${type}`, "success");
}

function sharePage() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast(isEnglish ? "Page URL copied to clipboard!" : "پیج یو آر ایل کلپ بورڈ پر کاپی ہو گیا!", "success");
}

function openCompareModal() {
    const modal = document.getElementById("compareModal");
    const content = document.getElementById("compareContent");
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
            ${Object.keys(provincePolicyContent).map(province => `
                <div style="padding: 1rem; border-radius: 12px; background: var(--light);">
                    <h4 style="color: var(--primary);">${isEnglish ? provincePolicyContent[province].name : provincePolicyContent[province].nameUr}</h4>
                    <div class="policy-item"><strong>${isEnglish ? "Attendance:" : "حاضری:"}</strong> ${provincePolicyContent[province].attendanceRules}</div>
                    <div class="policy-item"><strong>${isEnglish ? "Retention:" : "ریکارڈ مدت:"}</strong> ${provincePolicyContent[province].retentionPeriod}</div>
                    <div class="policy-item"><strong>${isEnglish ? "Notes:" : "خصوصی نوٹ:"}</strong> ${provincePolicyContent[province].specialNotes}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.style.display = "flex";
}

function openAISummary() {
    const modal = document.getElementById("aiModal");
    const content = document.getElementById("aiSummaryContent");
    
    content.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-pulse" style="font-size: 2rem; color: var(--primary);"></i>
            <p>${isEnglish ? "Generating AI summary..." : "اے آئی خلاصہ تیار کر رہا ہے..."}</p>
        </div>
    `;
    modal.style.display = "flex";
    
    setTimeout(() => {
        content.innerHTML = `
            <p>${isEnglish ? "This register is essential for maintaining accurate school records. Regular updates ensure compliance with government policies and facilitate smooth audits." : "یہ رجسٹر اسکول کے درست ریکارڈ کو برقرار رکھنے کے لیے ضروری ہے۔ باقاعدہ اپ ڈیٹس حکومتی پالیسیوں کی تعمیل کو یقینی بناتی ہیں اور آڈٹ کو آسان بناتی ہیں۔"}</p>
            <br>
            <p><strong>${isEnglish ? "Key Recommendation:" : "اہم سفارش:"}</strong> ${isEnglish ? "Digitize records where possible for better accessibility and security." : "بہتر رسائی اور حفاظت کے لیے جہاں ممکن ہو ریکارڈ کو ڈیجیٹل بنائیں۔"}</p>
        `;
    }, 1500);
    
    document.getElementById("copySummaryBtn").onclick = () => {
        const summaryText = document.getElementById("aiSummaryContent").innerText;
        navigator.clipboard.writeText(summaryText);
        showToast(isEnglish ? "Summary copied!" : "خلاصہ کاپی ہو گیا!", "success");
    };
}

function exportContent(type) {
    if (!currentRegister) return;
    
    const content = `
${isEnglish ? currentRegister.name : currentRegister.nameUr}
${isEnglish ? "=".repeat(50) : "=".repeat(50)}

${isEnglish ? "Province" : "صوبہ"}: ${isEnglish ? provincePolicyContent[currentProvince].name : provincePolicyContent[currentProvince].nameUr}

${isEnglish ? "Policy Guidelines" : "پالیسی گائیڈ لائنز"}:
- ${provincePolicyContent[currentProvince].attendanceRules}
- ${isEnglish ? "Principal verification required" : "پرنسپل کی تصدیق ضروری"}
- ${isEnglish ? `Retention: ${provincePolicyContent[currentProvince].retentionPeriod}` : `ریکارڈ مدت: ${provincePolicyContent[currentProvince].retentionPeriod}`}

${isEnglish ? "Generated by Registers Policy Dashboard - Govt of Pakistan" : "ریجسٹرز پالیسی ڈیش بورڈ - حکومت پاکستان"}
    `.trim();
    
    if (type === "txt") {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${currentRegister.slug}_policy.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(isEnglish ? "TXT exported!" : "ٹیکسٹ ڈاؤنلوڈ ہو گیا!", "success");
    } else if (type === "pdf") {
        // Simple print simulation for PDF
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html><head><title>${currentRegister.name} Policy</title></head>
            <body style="font-family: Arial; padding: 2rem;"><pre>${content}</pre></body>
            </html>
        `);
        printWindow.print();
        showToast(isEnglish ? "PDF export initiated" : "پی ڈی ایف ڈاؤنلوڈ شروع ہو گیا", "info");
    }
}

function loadGlobalStats() {
    document.getElementById("globalUsage").textContent = Object.values(usageCounts).reduce((a,b) => a+b, 0);
    document.getElementById("globalReactions").textContent = Object.values(reactionsData).reduce((a,b) => a+b, 0);
}

function updateGlobalStats() {
    loadGlobalStats();
}

function startVoiceSearch() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        showToast(isEnglish ? "Voice search not supported in this browser" : "اس براؤزر میں آواز سے تلاش کی سہولت موجود نہیں", "error");
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = isEnglish ? "en-US" : "ur-PK";
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const searchInput = isEnglish ? document.getElementById("searchInput") : document.getElementById("searchInputUr");
        searchInput.value = transcript;
        renderRegisters(transcript);
        showToast(isEnglish ? `Searching for: ${transcript}` : `تلاش کر رہے ہیں: ${transcript}`, "info");
    };
    
    recognition.onerror = () => {
        showToast(isEnglish ? "Voice recognition failed" : "آواز کی شناخت ناکام ہو گئی", "error");
    };
    
    recognition.start();
    showToast(isEnglish ? "Listening... Speak now" : "سن رہے ہیں... اب بولیں", "info");
}

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function initParticles() {
    const canvas = document.getElementById("particlesCanvas");
    if (!canvas) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3,
            alpha: Math.random() * 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }
    
    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

function setupParticles() {
    initParticles();
    window.addEventListener("resize", () => {
        const canvas = document.getElementById("particlesCanvas");
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
    });
}
