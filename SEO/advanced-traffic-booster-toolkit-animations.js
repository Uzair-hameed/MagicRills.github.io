// === Advanced Traffic Booster Toolkit Advanced Animations ===
document.addEventListener('DOMContentLoaded', function() {
    // Parallax Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.traffic-booster-header');
        if (header) header.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
    });

    // Page Load Animation
    setTimeout(() => {
        document.querySelectorAll('.stat-card, .tab-btn, .traffic-booster-btn').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'all 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, i * 100);
        });
    }, 300);

    // Confetti
    window.createConfetti = function() {
        const colors = ['#3498db','#2ecc71','#e74c3c','#f39c12','#9b59b6'];
        const container = Object.assign(document.createElement('div'), {
            style: 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;'
        });
        for (let i = 0; i < 60; i++) {
            const c = Object.assign(document.createElement('div'), {
                style: `position:absolute;width:10px;height:10px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:50%;left:${Math.random()*100}vw;animation:confettiFall ${2+Math.random()*2}s linear forwards;`
            });
            container.appendChild(c);
        }
        document.body.appendChild(container);
        setTimeout(() => container.remove(), 4000);
    };

    // Add Confetti CSS
    const style = document.createElement('style');
    style.textContent = `@keyframes confettiFall{0%{transform:translateY(-100px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(360deg);opacity:0}}`;
    document.head.appendChild(style);
});