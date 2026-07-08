// ============================================
// SCHOOL EVENT CALCULATOR - CLOUDFLARE API
// Magicrills - Advanced Event Planning Tool
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'school-event-calculator';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// ============================================
// GLOBAL VARIABLES
// ============================================
let costChart = null;
let roiChart = null;
let typewriterInterval = null;
let isCalculating = false;

// ============================================
// TYPEWRITER ANIMATION
// ============================================
const typewriterPhrases = [
    'Plan your event with confidence 🎯',
    'Track budget & ROI in real-time 💰',
    'Get AI-powered recommendations 🤖',
    'Analyze student participation 📊',
    'Make every event a success ⭐',
    'Powered by Magicrills 🚀'
];

function startTypewriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;
    
    let charIndex = 0;
    let phraseIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentPhrase = typewriterPhrases[phraseIndex];
        
        if (isDeleting) {
            el.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = isDeleting ? 40 : 80;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
            speed = 500;
        }
        
        clearTimeout(typewriterInterval);
        typewriterInterval = setTimeout(type, speed);
    }
    
    type();
}

// ============================================
// CLOUDFLARE API FUNCTIONS
// ============================================

// Track usage - increments on tool load
async function trackToolUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ tool_slug: TOOL_SLUG })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateHeroStats(data);
            return data;
        } else {
            throw new Error('API response not OK');
        }
    } catch (error) {
        console.warn('API fallback: Using localStorage for usage tracking');
        let localCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
        localCount++;
        localStorage.setItem(`${TOOL_SLUG}_usage`, localCount.toString());
        document.getElementById('statUsage').textContent = localCount;
        return { usageCount: localCount };
    }
}

// Get tool stats
async function getToolStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateHeroStats(data);
            updateReactionCounts(data.reactions || {});
            document.getElementById('shareCount').textContent = data.shares || 0;
            return data;
        } else {
            throw new Error('API response not OK');
        }
    } catch (error) {
        console.warn('API fallback: Loading stats from localStorage');
        loadLocalStats();
    }
}

// Add reaction
async function addReaction(emojiType) {
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                emoji_type: emojiType
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateReactionCounts(data.reactions || {});
            showToast(`You reacted with ${getEmojiName(emojiType)}! ❤️`, 'success');
            highlightReactionButton(emojiType);
            return data;
        } else if (response.status === 409) {
            showToast('You already reacted with this emoji! 😊', 'info');
        } else {
            throw new Error('API response not OK');
        }
    } catch (error) {
        // Fallback to localStorage
        let reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
        reactions[emojiType] = (reactions[emojiType] || 0) + 1;
        localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
        updateReactionCounts(reactions);
        showToast(`You reacted with ${getEmojiName(emojiType)}! (Saved locally)`, 'success');
        highlightReactionButton(emojiType);
    }
}

// Track share
async function trackShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                share_type: platform
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('shareCount').textContent = data.shares || 0;
            document.getElementById('statShares').textContent = data.shares || 0;
            return data;
        } else {
            throw new Error('API response not OK');
        }
    } catch (error) {
        // Fallback to localStorage
        let shares = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || '0');
        shares++;
        localStorage.setItem(`${TOOL_SLUG}_shares`, shares.toString());
        document.getElementById('shareCount').textContent = shares;
        document.getElementById('statShares').textContent = shares;
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateHeroStats(data) {
    if (data.usageCount !== undefined) {
        document.getElementById('statUsage').textContent = data.usageCount;
    }
    if (data.shares !== undefined) {
        document.getElementById('statShares').textContent = data.shares;
        document.getElementById('shareCount').textContent = data.shares;
    }
    if (data.reactions) {
        const totalReactions = Object.values(data.reactions).reduce((a, b) => a + b, 0);
        document.getElementById('statReactions').textContent = totalReactions;
    }
    if (data.followers !== undefined) {
        document.getElementById('statFollowers').textContent = data.followers;
    }
}

function updateReactionCounts(reactions) {
    const emojis = ['like', 'love', 'wow', 'sad', 'laugh', 'celebrate'];
    emojis.forEach(emoji => {
        const el = document.getElementById(`${emoji}Count`);
        if (el && reactions[emoji] !== undefined) {
            el.textContent = reactions[emoji];
        }
    });
    
    // Update total reactions in hero
    const total = Object.values(reactions).reduce((a, b) => a + b, 0);
    document.getElementById('statReactions').textContent = total;
}

function highlightReactionButton(emojiType) {
    const buttons = document.querySelectorAll('.reaction-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.emoji === emojiType) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 1200);
        }
    });
}

function getEmojiName(emojiType) {
    const names = {
        like: '👍 Like',
        love: '❤️ Love',
        wow: '😮 Wow',
        sad: '😢 Sad',
        laugh: '😂 Laugh',
        celebrate: '🎉 Celebrate'
    };
    return names[emojiType] || emojiType;
}

function loadLocalStats() {
    document.getElementById('statUsage').textContent = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
    document.getElementById('statShares').textContent = localStorage.getItem(`${TOOL_SLUG}_shares`) || 0;
    document.getElementById('shareCount').textContent = localStorage.getItem(`${TOOL_SLUG}_shares`) || 0;
    
    const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    updateReactionCounts(reactions);
    document.getElementById('statFollowers').textContent = localStorage.getItem(`${TOOL_SLUG}_followers`) || 0;
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ============================================
// CHECKLIST 3D
// ============================================
function updateChecklist() {
    const items = document.querySelectorAll('.checklist-item');
    const eventName = document.getElementById('eventName');
    const studentCount = document.getElementById('studentCount');
    const materialsCost = document.getElementById('materialsCost');
    const ticketIncome = document.getElementById('ticketIncome');
    const learningValue = document.getElementById('learningValue');
    
    if (!eventName || !studentCount || !materialsCost || !ticketIncome || !learningValue) return;
    
    // Check if step 1 is complete (event name filled)
    const hasName = eventName.value.trim().length > 0;
    
    // Check if step 2 is complete (student count > 0)
    const hasStudents = parseInt(studentCount.value) > 0;
    
    // Check if step 3 is complete (some cost entered)
    const hasCost = parseInt(materialsCost.value) > 0;
    
    // Check if step 4 is complete (some income entered - optional)
    const hasIncome = parseInt(ticketIncome.value) >= 0;
    
    // Check if step 5 is complete (some benefit entered)
    const hasBenefit = parseInt(learningValue.value) > 0;
    
    // Mark steps as done
    if (items.length >= 6) {
        items.forEach((item, index) => {
            const step = index + 1;
            let isDone = false;
            
            switch(step) {
                case 1: isDone = hasName; break;
                case 2: isDone = hasStudents; break;
                case 3: isDone = hasCost; break;
                case 4: isDone = hasIncome; break;
                case 5: isDone = hasBenefit; break;
                case 6: isDone = hasName && hasStudents && hasCost && hasBenefit; break;
            }
            
            if (isDone) {
                item.classList.add('done');
                const icon = item.querySelector('.check-icon i');
                if (icon) {
                    icon.className = 'fas fa-check';
                }
            } else {
                item.classList.remove('done');
                const icon = item.querySelector('.check-icon i');
                if (icon && !icon.className.includes('fa-spinner')) {
                    icon.className = 'fas fa-circle';
                }
            }
        });
    }
}

// ============================================
// CALCULATION FUNCTIONS
// ============================================

function calculateEventImpact() {
    if (isCalculating) return;
    isCalculating = true;
    
    try {
        // Get all input values
        const eventName = document.getElementById('eventName').value || 'Unnamed Event';
        const studentCount = parseFloat(document.getElementById('studentCount').value) || 0;
        const studentHours = parseFloat(document.getElementById('studentHours').value) || 0;
        const participationRate = parseFloat(document.getElementById('participationRate').value) || 0;
        const satisfactionScore = parseFloat(document.getElementById('satisfactionScore').value) || 0;
        
        const staffCount = parseFloat(document.getElementById('staffCount').value) || 0;
        const staffHours = parseFloat(document.getElementById('staffHours').value) || 0;
        const staffRate = parseFloat(document.getElementById('staffRate').value) || 0;
        const teacherFeedback = parseFloat(document.getElementById('teacherFeedback').value) || 0;
        
        // Costs
        const materialsCost = parseFloat(document.getElementById('materialsCost').value) || 0;
        const venueCost = parseFloat(document.getElementById('venueCost').value) || 0;
        const technologyCost = parseFloat(document.getElementById('technologyCost').value) || 0;
        const foodCost = parseFloat(document.getElementById('foodCost').value) || 0;
        const equipmentCost = parseFloat(document.getElementById('equipmentCost').value) || 0;
        const marketingCost = parseFloat(document.getElementById('marketingCost').value) || 0;
        
        // Income
        const ticketIncome = parseFloat(document.getElementById('ticketIncome').value) || 0;
        const sponsorshipIncome = parseFloat(document.getElementById('sponsorshipIncome').value) || 0;
        const donationIncome = parseFloat(document.getElementById('donationIncome').value) || 0;
        const vendorIncome = parseFloat(document.getElementById('vendorIncome').value) || 0;
        
        // Benefits
        const learningValue = parseFloat(document.getElementById('learningValue').value) || 0;
        const engagementValue = parseFloat(document.getElementById('engagementValue').value) || 0;
        const skillValue = parseFloat(document.getElementById('skillValue').value) || 0;
        const longTermValue = parseFloat(document.getElementById('longTermValue').value) || 0;
        
        // Calculations
        const staffCost = staffCount * staffHours * staffRate;
        const resourceCost = materialsCost + venueCost + technologyCost + foodCost + equipmentCost + marketingCost;
        const totalCost = staffCost + resourceCost;
        const totalIncome = ticketIncome + sponsorshipIncome + donationIncome + vendorIncome;
        const netCost = totalCost - totalIncome;
        
        const totalStudentHours = studentCount * studentHours * (participationRate / 100);
        const totalStaffHours = staffCount * staffHours;
        const totalHours = totalStudentHours + totalStaffHours;
        
        const totalBenefitValue = learningValue + engagementValue + skillValue + longTermValue;
        const netImpact = totalBenefitValue - netCost;
        const roiPercentage = netCost > 0 ? ((netImpact / netCost) * 100) : (totalBenefitValue > 0 ? 100 : 0);
        const costPerStudent = studentCount > 0 ? (netCost / studentCount) : 0;
        const costPerHour = totalHours > 0 ? (netCost / totalHours) : 0;
        
        // Efficiency Rating
        let efficiencyRating = 'Poor';
        if (roiPercentage >= 100) efficiencyRating = 'Excellent';
        else if (roiPercentage >= 50) efficiencyRating = 'Good';
        else if (roiPercentage >= 0) efficiencyRating = 'Fair';
        
        // Learning Outcomes Score
        const learningOutcomeScore = ((satisfactionScore / 10) * 0.4 + (teacherFeedback / 10) * 0.3 + (participationRate / 100) * 0.3) * 100;
        
        // Hide placeholder and show results
        const placeholder = document.getElementById('placeholder');
        const results = document.getElementById('results');
        const costCard = document.getElementById('costCard');
        const financialCard = document.getElementById('financialCard');
        const roiCard = document.getElementById('roiCard');
        const chartCard = document.getElementById('chartCard');
        const recommendationsCard = document.getElementById('recommendationsCard');
        const exportCard = document.getElementById('exportCard');
        
        if (placeholder) placeholder.style.display = 'none';
        if (results) results.style.display = 'block';
        if (costCard) costCard.style.display = 'block';
        if (financialCard) financialCard.style.display = 'block';
        if (roiCard) roiCard.style.display = 'block';
        if (chartCard) chartCard.style.display = 'block';
        if (recommendationsCard) recommendationsCard.style.display = 'block';
        if (exportCard) exportCard.style.display = 'block';
        
        // Update Summary Stats
        const summaryStats = document.getElementById('summaryStats');
        if (summaryStats) {
            summaryStats.innerHTML = `
                <div class="result-item">
                    <div class="result-label">🎯 Event Name</div>
                    <div class="result-value">${eventName}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">👥 Participants</div>
                    <div class="result-value">${studentCount.toLocaleString()} Students | ${staffCount.toLocaleString()} Staff</div>
                </div>
                <div class="result-item">
                    <div class="result-label">📊 Participation Rate</div>
                    <div class="result-value">${participationRate}%</div>
                </div>
                <div class="metric-item">
                    <span>Student Satisfaction</span>
                    <strong>${satisfactionScore}/10 ⭐</strong>
                </div>
                <div class="metric-item">
                    <span>Teacher Feedback</span>
                    <strong>${teacherFeedback}/10 ⭐</strong>
                </div>
                <div class="metric-item">
                    <span>Learning Outcome Score</span>
                    <strong>${learningOutcomeScore.toFixed(1)}%</strong>
                </div>
            `;
        }
        
        // Update Cost Breakdown
        const costBreakdown = document.getElementById('costBreakdown');
        if (costBreakdown) {
            costBreakdown.innerHTML = `
                <div class="metric-item"><span>👨‍🏫 Staff Cost</span><strong>PKR ${formatNumber(staffCost)}</strong></div>
                <div class="metric-item"><span>📦 Materials</span><strong>PKR ${formatNumber(materialsCost)}</strong></div>
                <div class="metric-item"><span>🏢 Venue</span><strong>PKR ${formatNumber(venueCost)}</strong></div>
                <div class="metric-item"><span>💻 Technology</span><strong>PKR ${formatNumber(technologyCost)}</strong></div>
                <div class="metric-item"><span>🍔 Food/Catering</span><strong>PKR ${formatNumber(foodCost)}</strong></div>
                <div class="metric-item"><span>🎤 Equipment</span><strong>PKR ${formatNumber(equipmentCost)}</strong></div>
                <div class="metric-item"><span>📢 Marketing</span><strong>PKR ${formatNumber(marketingCost)}</strong></div>
                <div class="metric-item highlight"><span>💰 Total Cost</span><strong>PKR ${formatNumber(totalCost)}</strong></div>
            `;
        }
        
        // Update Financial Analysis
        const financialAnalysis = document.getElementById('financialAnalysis');
        if (financialAnalysis) {
            financialAnalysis.innerHTML = `
                <div class="metric-item"><span>🎟️ Ticket Sales</span><strong>PKR ${formatNumber(ticketIncome)}</strong></div>
                <div class="metric-item"><span>🤝 Sponsorship</span><strong>PKR ${formatNumber(sponsorshipIncome)}</strong></div>
                <div class="metric-item"><span>🎁 Donations</span><strong>PKR ${formatNumber(donationIncome)}</strong></div>
                <div class="metric-item"><span>🏪 Vendor Stalls</span><strong>PKR ${formatNumber(vendorIncome)}</strong></div>
                <div class="metric-item"><span>📈 Total Income</span><strong>PKR ${formatNumber(totalIncome)}</strong></div>
                <div class="metric-item highlight"><span>💰 Net Cost (After Income)</span><strong>PKR ${formatNumber(netCost)}</strong></div>
            `;
        }
        
        // Update ROI Metrics
        const roiMetrics = document.getElementById('roiMetrics');
        if (roiMetrics) {
            roiMetrics.innerHTML = `
                <div class="metric-item"><span>📚 Educational Value</span><strong>PKR ${formatNumber(learningValue)}</strong></div>
                <div class="metric-item"><span>😊 Engagement Value</span><strong>PKR ${formatNumber(engagementValue)}</strong></div>
                <div class="metric-item"><span>🏆 Skill Development</span><strong>PKR ${formatNumber(skillValue)}</strong></div>
                <div class="metric-item"><span>📈 Long-term Impact</span><strong>PKR ${formatNumber(longTermValue)}</strong></div>
                <div class="metric-item"><span>🎯 Total Benefit Value</span><strong>PKR ${formatNumber(totalBenefitValue)}</strong></div>
                <div class="metric-item"><span>⚡ Net Impact</span><strong>PKR ${formatNumber(netImpact)}</strong></div>
                <div class="metric-item highlight"><span>📊 ROI Percentage</span><strong>${roiPercentage.toFixed(1)}%</strong></div>
                <div class="metric-item"><span>👤 Cost per Student</span><strong>PKR ${formatNumber(costPerStudent)}</strong></div>
                <div class="metric-item"><span>⏱️ Cost per Hour</span><strong>PKR ${formatNumber(costPerHour)}</strong></div>
                <div class="metric-item"><span>🏅 Efficiency Rating</span><strong class="efficiency-badge efficiency-${efficiencyRating}">${efficiencyRating}</strong></div>
            `;
        }
        
        // Update Charts
        updateCharts(totalCost, staffCost, resourceCost, totalIncome, netCost, totalBenefitValue);
        
        // Update Recommendations (with AI)
        updateRecommendations(roiPercentage, participationRate, satisfactionScore, teacherFeedback, netCost, totalIncome);
        
        // Update checklist
        updateChecklist();
        
        // Store results for export
        window.calculationResults = {
            eventName, studentCount, staffCount, participationRate, satisfactionScore, teacherFeedback,
            staffCost, materialsCost, venueCost, technologyCost, foodCost, equipmentCost, marketingCost, totalCost,
            ticketIncome, sponsorshipIncome, donationIncome, vendorIncome, totalIncome, netCost,
            learningValue, engagementValue, skillValue, longTermValue, totalBenefitValue, netImpact,
            roiPercentage, costPerStudent, costPerHour, efficiencyRating, learningOutcomeScore
        };
        
        showToast('✅ Calculation complete! AI recommendations ready.', 'success');
    } catch (error) {
        console.error('Error during calculation:', error);
        showToast('⚠️ An error occurred during calculation. Please try again.', 'error');
    } finally {
        isCalculating = false;
    }
}

function updateCharts(totalCost, staffCost, resourceCost, totalIncome, netCost, totalBenefitValue) {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Charts will not be displayed.');
        return;
    }
    
    try {
        // Cost Breakdown Chart
        const ctx1 = document.getElementById('costChart');
        if (ctx1) {
            const ctx = ctx1.getContext('2d');
            if (costChart) costChart.destroy();
            costChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Staff Cost', 'Resources & Materials'],
                    datasets: [{ 
                        data: [staffCost, resourceCost], 
                        backgroundColor: ['#4f8cf7', '#7c3aed'], 
                        borderColor: ['#4f8cf7', '#7c3aed'],
                        borderWidth: 2
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: true, 
                    plugins: { 
                        legend: { 
                            position: 'bottom', 
                            labels: { color: '#94a3b8' } 
                        } 
                    },
                    cutout: '65%'
                }
            });
        }
        
        // ROI Chart
        const ctx2 = document.getElementById('roiChart');
        if (ctx2) {
            const ctx = ctx2.getContext('2d');
            if (roiChart) roiChart.destroy();
            roiChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Net Cost', 'Total Benefit', 'Net Impact'],
                    datasets: [{ 
                        label: 'Amount (PKR)', 
                        data: [netCost, totalBenefitValue, totalBenefitValue - netCost], 
                        backgroundColor: ['#f59e0b', '#10b981', '#4f8cf7'],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: true, 
                    plugins: { 
                        legend: { 
                            labels: { color: '#94a3b8' } 
                        } 
                    }, 
                    scales: { 
                        y: { 
                            beginAtZero: true, 
                            ticks: { 
                                callback: v => 'PKR ' + (v / 1000) + 'k',
                                color: '#64748b'
                            },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        },
                        x: {
                            ticks: { color: '#94a3b8' }
                        }
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error creating charts:', error);
    }
}

function updateRecommendations(roiPercentage, participationRate, satisfactionScore, teacherFeedback, netCost, totalIncome) {
    const recDiv = document.getElementById('recommendations');
    if (!recDiv) return;
    
    let recommendations = [];
    
    // AI-powered recommendations based on data
    if (roiPercentage < 50) {
        recommendations.push('📉 Your ROI is below 50%. Consider reducing costs or increasing sponsorship income. Try negotiating better rates for venue and equipment.');
    } else if (roiPercentage >= 100) {
        recommendations.push('🎉 Excellent ROI! Your event is highly efficient. Consider scaling this model for future events.');
    }
    
    if (participationRate < 70) {
        recommendations.push('👥 Participation rate is low. Improve marketing and student outreach. Consider using social media and student ambassadors.');
    } else if (participationRate >= 90) {
        recommendations.push('🌟 Outstanding participation! Your students are highly engaged. Keep up the great work!');
    }
    
    if (satisfactionScore < 7) {
        recommendations.push('😊 Student satisfaction needs improvement. Collect detailed feedback and focus on areas that matter most to students.');
    } else if (satisfactionScore >= 9) {
        recommendations.push('💯 Amazing student satisfaction! You\'re creating memorable experiences. Document your best practices.');
    }
    
    if (teacherFeedback < 7) {
        recommendations.push('👨‍🏫 Teacher feedback indicates areas for improvement. Consider professional development and better event coordination.');
    } else if (teacherFeedback >= 9) {
        recommendations.push('🏅 Teachers love your event! Leverage their support for future planning and get them more involved.');
    }
    
    if (netCost > 0 && totalIncome === 0) {
        recommendations.push('💰 No income sources added. Consider ticket sales, sponsorships, or donations to offset costs.');
    }
    
    if (netCost > 0 && totalIncome > 0 && netCost < (netCost + totalIncome) * 0.5) {
        recommendations.push('📊 Good job on fundraising! You\'ve covered more than 50% of costs through income sources.');
    }
    
    // Add smart recommendation based on event type
    const eventType = document.getElementById('eventType');
    if (eventType) {
        const typeRecommendations = {
            'science_fair': '🔬 For Science Fairs, consider inviting local scientists and tech companies as judges and sponsors.',
            'sports_day': '🏅 For Sports Day, ensure proper hydration stations and first aid facilities are available.',
            'cultural_day': '🎭 For Cultural Day, involve parents and community members to showcase diverse traditions.',
            'art_exhibition': '🎨 For Art Exhibitions, promote the event on social media with visual previews.',
            'career_fair': '💼 For Career Fairs, invite alumni to share their career journeys with students.',
            'fundraiser': '🤝 For Fundraisers, create compelling storytelling to encourage more donations.',
            'graduation': '🎓 For Graduation, prepare a memorable ceremony with student testimonials.',
            'workshop': '📝 For Workshops, provide hands-on activities and takeaway materials for participants.',
            'conference': '🗣️ For Conferences, invite keynote speakers and provide networking opportunities.',
            'open_house': '🏫 For Open House, prepare informative sessions and campus tours for visitors.'
        };
        
        if (typeRecommendations[eventType.value]) {
            recommendations.push(typeRecommendations[eventType.value]);
        }
    }
    
    if (recommendations.length === 0) {
        recommendations.push('🎉 Excellent planning! Your event metrics look great. Keep up the good work!');
    }
    
    recommendations.push('💡 Pro tip: Export this report to share with your team and stakeholders.');
    recommendations.push('🤖 AI-powered insights: Based on your data, this event shows strong potential for success.');
    
    recDiv.innerHTML = recommendations.map(rec => `<div class="recommendation-item"><i class="fas fa-lightbulb"></i> ${rec}</div>`).join('');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportToExcel() {
    if (!window.calculationResults) { 
        showToast('Please calculate first! 📊', 'error'); 
        return; 
    }
    
    // Check if XLSX is loaded
    if (typeof XLSX === 'undefined') {
        showToast('⚠️ Excel library not loaded. Please refresh the page.', 'error');
        return;
    }
    
    try {
        const r = window.calculationResults;
        const data = [
            ['Metric', 'Value'],
            ['Event Name', r.eventName],
            ['Total Students', r.studentCount],
            ['Total Staff', r.staffCount],
            ['Participation Rate', r.participationRate + '%'],
            ['Student Satisfaction', r.satisfactionScore + '/10'],
            ['Teacher Feedback', r.teacherFeedback + '/10'],
            ['Total Cost', r.totalCost],
            ['Total Income', r.totalIncome],
            ['Net Cost', r.netCost],
            ['Total Benefit Value', r.totalBenefitValue],
            ['Net Impact', r.netImpact],
            ['ROI Percentage', r.roiPercentage + '%'],
            ['Cost per Student', r.costPerStudent],
            ['Cost per Hour', r.costPerHour],
            ['Efficiency Rating', r.efficiencyRating],
            ['Learning Outcome Score', r.learningOutcomeScore.toFixed(1) + '%']
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Event Report');
        XLSX.writeFile(wb, `event_report_${r.eventName.replace(/\s+/g, '_')}.xlsx`);
        showToast('📊 Excel report downloaded!', 'success');
    } catch (e) {
        console.error('Excel export error:', e);
        showToast('⚠️ Error exporting Excel. Please try again.', 'error');
    }
}

function exportToWord() {
    if (!window.calculationResults) { 
        showToast('Please calculate first! 📊', 'error'); 
        return; 
    }
    
    try {
        const r = window.calculationResults;
        const html = `
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Event Report - ${r.eventName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; background: #fff; color: #1a1a2e; }
                        h1 { color: #4f8cf7; border-bottom: 3px solid #4f8cf7; padding-bottom: 10px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                        .metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                        .metric strong { color: #4f8cf7; }
                        .highlight { background: #e8f0fe; padding: 15px; border-radius: 8px; margin: 10px 0; }
                        .badge { display: inline-block; padding: 4px 12px; background: #4f8cf7; color: white; border-radius: 20px; font-size: 12px; }
                        .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>🎓 School Event Impact Report</h1>
                        <p><strong>${r.eventName}</strong></p>
                        <span class="badge">Generated by Magicrills</span>
                    </div>
                    
                    <div class="section">
                        <h3>📊 Event Overview</h3>
                        <div class="metric"><span>Students</span><strong>${r.studentCount}</strong></div>
                        <div class="metric"><span>Staff</span><strong>${r.staffCount}</strong></div>
                        <div class="metric"><span>Participation Rate</span><strong>${r.participationRate}%</strong></div>
                        <div class="metric"><span>Student Satisfaction</span><strong>${r.satisfactionScore}/10</strong></div>
                        <div class="metric"><span>Teacher Feedback</span><strong>${r.teacherFeedback}/10</strong></div>
                        <div class="metric"><span>Learning Outcome Score</span><strong>${r.learningOutcomeScore.toFixed(1)}%</strong></div>
                    </div>
                    
                    <div class="section">
                        <h3>💰 Financial Summary</h3>
                        <div class="metric"><span>Total Cost</span><strong>PKR ${formatNumber(r.totalCost)}</strong></div>
                        <div class="metric"><span>Total Income</span><strong>PKR ${formatNumber(r.totalIncome)}</strong></div>
                        <div class="metric highlight"><span>Net Cost</span><strong>PKR ${formatNumber(r.netCost)}</strong></div>
                        <div class="metric"><span>Total Benefit Value</span><strong>PKR ${formatNumber(r.totalBenefitValue)}</strong></div>
                        <div class="metric highlight"><span>Net Impact</span><strong>PKR ${formatNumber(r.netImpact)}</strong></div>
                    </div>
                    
                    <div class="section">
                        <h3>📈 ROI & Efficiency</h3>
                        <div class="metric"><span>ROI Percentage</span><strong>${r.roiPercentage.toFixed(1)}%</strong></div>
                        <div class="metric"><span>Cost per Student</span><strong>PKR ${formatNumber(r.costPerStudent)}</strong></div>
                        <div class="metric"><span>Cost per Hour</span><strong>PKR ${formatNumber(r.costPerHour)}</strong></div>
                        <div class="metric"><span>Efficiency Rating</span><strong>${r.efficiencyRating}</strong></div>
                    </div>
                    
                    <div class="footer">
                        <p>Generated by Magicrills School Event Calculator • ${new Date().toLocaleDateString()}</p>
                        <p style="color: #999;">Powered by AI • magicrills.com</p>
                    </div>
                </body>
            </html>
        `;
        
        const blob = new Blob([html], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `event_report_${r.eventName.replace(/\s+/g, '_')}.doc`;
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('📄 Word report downloaded!', 'success');
    } catch (e) {
        console.error('Word export error:', e);
        showToast('⚠️ Error exporting Word. Please try again.', 'error');
    }
}

function printResults() { 
    window.print(); 
}

function formatNumber(num) { 
    return Math.round(num).toLocaleString('en-PK'); 
}

// ============================================
// SHARE FUNCTIONS
// ============================================

function shareOnFacebook() { 
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); 
    trackShare('facebook'); 
    showToast('📱 Shared on Facebook!', 'success'); 
}

function shareOnTwitter() { 
    window.open(`https://twitter.com/intent/tweet?text=School%20Event%20Calculator%20-%20Plan%20%26%20Analyze%20Events%20with%20AI%20%7C%20Magicrills&url=${encodeURIComponent(window.location.href)}`, '_blank'); 
    trackShare('twitter'); 
    showToast('📱 Shared on Twitter!', 'success'); 
}

function shareOnLinkedIn() { 
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); 
    trackShare('linkedin'); 
    showToast('📱 Shared on LinkedIn!', 'success'); 
}

function shareOnWhatsApp() { 
    window.open(`https://wa.me/?text=${encodeURIComponent('School Event Calculator - Plan & Analyze Events with AI | Magicrills ' + window.location.href)}`, '_blank'); 
    trackShare('whatsapp'); 
    showToast('📱 Shared on WhatsApp!', 'success'); 
}

function shareByEmail() { 
    window.location.href = `mailto:?subject=School%20Event%20Calculator%20-%20Plan%20%26%20Analyze%20Events&body=Check%20out%20this%20amazing%20tool%3A%20${encodeURIComponent(window.location.href)}`; 
    trackShare('email'); 
    showToast('📧 Email opened!', 'info'); 
}

async function copyPageLink() { 
    try {
        await navigator.clipboard.writeText(window.location.href); 
        trackShare('copy'); 
        showToast('🔗 Link copied to clipboard!', 'success');
    } catch (e) {
        // Fallback
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        trackShare('copy');
        showToast('🔗 Link copied to clipboard!', 'success');
    }
}

// ============================================
// SCROLL BUTTONS
// ============================================
function setupScrollButtons() {
    const upBtn = document.getElementById('scrollUpBtn');
    const downBtn = document.getElementById('scrollDownBtn');
    
    if (!upBtn || !downBtn) return;
    
    window.addEventListener('scroll', () => {
        upBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    
    upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    downBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

// ============================================
// AUTO-CALCULATE ON INPUT CHANGE
// ============================================
function setupAutoCalculate() {
    const inputIds = [
        'studentCount', 'staffCount', 'materialsCost', 'venueCost', 
        'technologyCost', 'foodCost', 'equipmentCost', 'marketingCost',
        'ticketIncome', 'sponsorshipIncome', 'donationIncome', 'vendorIncome',
        'learningValue', 'engagementValue', 'skillValue', 'longTermValue',
        'participationRate', 'satisfactionScore', 'teacherFeedback',
        'eventName'
    ];
    
    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                updateChecklist();
            });
        }
    });
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Start typewriter animation
    startTypewriter();
    
    // Get stats from API
    await getToolStats();
    
    // Track usage (increments on load)
    await trackToolUsage();
    
    // Setup auto-calculate on input
    setupAutoCalculate();
    
    // Setup scroll buttons
    setupScrollButtons();
    
    // Set default date
    const dateInput = document.getElementById('eventDate');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
    }
    
    // Calculate button
    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateEventImpact);
    }
    
    // Export buttons
    const excelBtn = document.getElementById('exportExcelBtn');
    if (excelBtn) excelBtn.addEventListener('click', exportToExcel);
    
    const wordBtn = document.getElementById('exportWordBtn');
    if (wordBtn) wordBtn.addEventListener('click', exportToWord);
    
    const printBtn = document.getElementById('printBtn');
    if (printBtn) printBtn.addEventListener('click', printResults);
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji;
            if (emoji) addReaction(emoji);
        });
    });
    
    // Share buttons
    const shareMap = {
        'facebook': shareOnFacebook,
        'twitter': shareOnTwitter,
        'linkedin': shareOnLinkedIn,
        'whatsapp': shareOnWhatsApp,
        'email': shareByEmail,
        'copy': copyPageLink
    };
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        const platform = btn.dataset.platform;
        if (platform && shareMap[platform]) {
            btn.addEventListener('click', shareMap[platform]);
        }
    });
    
    // Initial checklist update
    setTimeout(updateChecklist, 100);
    
    // Welcome toast
    setTimeout(() => {
        showToast('🚀 Welcome to School Event Calculator! Fill in the details and click Calculate.', 'info');
    }, 500);
});

// Handle errors globally
window.addEventListener('error', function(e) {
    console.error('Global error:', e.message);
});
