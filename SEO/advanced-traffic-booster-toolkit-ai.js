// === Advanced Traffic Booster Toolkit AI Assistant ===
document.addEventListener('DOMContentLoaded', function() {
    const aiQuestion = document.getElementById('aiQuestion');
    const askAI = document.getElementById('askAI');
    const aiMessages = document.getElementById('aiMessages');
    if (!aiQuestion || !askAI || !aiMessages) return;

    const responses = {
        'traffic': "Boost traffic with: SEO, content marketing, email lists, social ads, and guest posting.",
        'seo': "Top SEO tips: 1. Keyword research 2. Fast site speed 3. Mobile-friendly 4. Quality content 5. Backlinks",
        'social': "Post daily, use visuals, engage followers, run contests, and analyze best times.",
        'backlinks': "Get backlinks via: HARO, guest posts, infographics, broken link building, and forums.",
        'hello|hi|hey': "Hi! I'm your AI Traffic Expert. Ask me anything about growing your site!",
        'help': "I can help with: SEO, Traffic, Social Media, Backlinks, Analytics, and Content Strategy."
    };

    addMessage("Hello! Ask me how to grow your traffic!", 'ai');

    askAI.addEventListener('click', send);
    aiQuestion.addEventListener('keypress', e => e.key === 'Enter' && send());

    function send() {
        const q = aiQuestion.value.trim().toLowerCase();
        if (!q) return;
        addMessage(q, 'user');
        aiQuestion.value = '';
        const typing = addTyping();
        setTimeout(() => {
            typing.remove();
            let reply = "Ask about SEO, traffic, or backlinks!";
            for (const [key, value] of Object.entries(responses)) {
                if (new RegExp(key).test(q)) { reply = value; break; }
            }
            addMessage(reply, 'ai');
        }, 1200 + Math.random() * 800);
    }

    function addMessage(text, type) {
        const div = Object.assign(document.createElement('div'), {
            className: `ai-message ai-message-${type}`,
            textContent: text
        });
        div.style.animation = 'fadeIn 0.3s ease';
        aiMessages.appendChild(div);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function addTyping() {
        const div = Object.assign(document.createElement('div'), {
            className: 'ai-message ai-message-ai typing-indicator',
            innerHTML: 'AI is thinking<span class="typing-dots"></span>'
        });
        aiMessages.appendChild(div);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        return div;
    }

    // AI Chat CSS
    const style = document.createElement('style');
    style.textContent = `
        .ai-message { margin:12px 0; padding:12px 16px; border-radius:18px; max-width:80%; word-wrap:break-word; }
        .ai-message-user { background:var(--primary-color); color:#fff; margin-left:auto; border-bottom-right-radius:4px; }
        .ai-message-ai { background:var(--card-bg); border:1px solid var(--border-color); margin-right:auto; border-bottom-left-radius:4px; }
        .typing-dots::after { content:''; animation:typing 1.5s infinite; }
        @keyframes typing { 0%,20%{content:'.'} 40%{content:'..'} 60%,100%{content:'...'} }
        .social-link { display:inline-block; margin:5px; padding:8px 12px; background:var(--primary-color); color:#fff; border-radius:6px; text-decoration:none; font-size:0.9rem; }
    `;
    document.head.appendChild(style);
});