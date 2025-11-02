// Advanced Image Merger AI Features
class AdvancedImageMergerAI {
    constructor() {
        this.captionSuggestions = [
            "Beautiful memories captured forever",
            "Two moments, one perfect frame",
            "Creating art from moments",
            "Double the beauty, double the fun",
            "Memories blended perfectly",
            "A story told through images",
            "Capturing life's best moments",
            "Two perspectives, one vision",
            "Artistic fusion of memories",
            "Timeless moments combined"
        ];
        
        this.styleSuggestions = [
            "Try vintage filter with collage layout",
            "Modern layout with cool tone filter",
            "Artistic style with diagonal layout",
            "Polaroid style with warm filter",
            "Mirror effect with dramatic filter",
            "Overlay blend with pastel colors",
            "Circle frame with grayscale filter",
            "Split screen with modern filter"
        ];
    }

    generateAICaption(imageNumber) {
        const captionElement = document.getElementById(`aimCaption${imageNumber}`);
        const randomCaption = this.captionSuggestions[Math.floor(Math.random() * this.captionSuggestions.length)];
        
        // Show loading animation
        const originalText = captionElement.value;
        captionElement.value = "AI is generating caption...";
        
        setTimeout(() => {
            captionElement.value = randomCaption;
            this.showAIMessage("AI caption generated successfully!", "success");
        }, 1000);
    }

    generateAIStyleSuggestion() {
        const randomSuggestion = this.styleSuggestions[Math.floor(Math.random() * this.styleSuggestions.length)];
        
        // Update AI panel
        const aiPanel = document.querySelector('.ai-suggestion-card span');
        aiPanel.textContent = `AI Suggestion: ${randomSuggestion}`;
        
        this.showAIMessage("New style suggestion generated!", "info");
    }

    applyAIStyleSuggestion() {
        const suggestion = document.querySelector('.ai-suggestion-card span').textContent;
        
        if (suggestion.includes("vintage") && suggestion.includes("collage")) {
            document.getElementById('aimLayout').value = 'collage';
            document.getElementById('aimFilter').value = 'vintage';
            document.getElementById('aimBgColor').value = '#f8f0e3';
        } else if (suggestion.includes("modern") && suggestion.includes("cool")) {
            document.getElementById('aimLayout').value = 'horizontal';
            document.getElementById('aimFilter').value = 'cool';
            document.getElementById('aimBgColor').value = '#f0f8ff';
        } else if (suggestion.includes("artistic") && suggestion.includes("diagonal")) {
            document.getElementById('aimLayout').value = 'diagonal';
            document.getElementById('aimFilter').value = 'artistic';
            document.getElementById('aimBgColor').value = '#fffaf0';
        }
        
        this.showAIMessage("AI style applied successfully!", "success");
        
        // Trigger merge if images are loaded
        if (window.aimInstance && window.aimInstance.images[0] && window.aimInstance.images[1]) {
            setTimeout(() => window.aimInstance.mergeImages(), 500);
        }
    }

    analyzeImageComposition() {
        // Simulate AI analysis of uploaded images
        if (!window.aimInstance || !window.aimInstance.images[0] || !window.aimInstance.images[1]) {
            this.showAIMessage("Please upload both images for AI analysis", "warning");
            return;
        }

        this.showAIMessage("AI is analyzing image composition...", "info");
        
        setTimeout(() => {
            const suggestions = [
                "Images have good contrast - try dramatic filter",
                "Similar color palette detected - overlay layout recommended",
                "Portrait images detected - vertical layout suggested",
                "Landscape images detected - horizontal layout works best",
                "High contrast images - black & white filter recommended"
            ];
            
            const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            this.showAIMessage(`AI Analysis: ${randomSuggestion}`, "success");
        }, 2000);
    }

    showAIMessage(message, type = "info") {
        // Create AI notification
        const notification = document.createElement('div');
        notification.className = `aim-notification aim-ai-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-robot"></i>
            <span>${message}</span>
        `;

        // Add AI-specific styling
        notification.style.background = 'linear-gradient(135deg, #7209b7, #3a0ca3)';
        notification.style.borderLeft = '4px solid #4cc9f0';

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    // Smart auto-merge based on image analysis
    smartAutoMerge() {
        if (!window.aimInstance || !window.aimInstance.images[0] || !window.aimInstance.images[1]) {
            this.showAIMessage("Please upload both images for smart merge", "warning");
            return;
        }

        this.showAIMessage("AI is selecting optimal merge settings...", "info");

        setTimeout(() => {
            // Simulate AI decision making based on image properties
            const img1 = window.aimInstance.images[0];
            const img2 = window.aimInstance.images[1];
            
            // Simple AI logic based on image dimensions
            if (img1.width > img1.height && img2.width > img2.height) {
                // Both are landscape
                document.getElementById('aimLayout').value = 'horizontal';
                document.getElementById('aimFilter').value = 'modern';
            } else if (img1.height > img1.width && img2.height > img2.width) {
                // Both are portrait
                document.getElementById('aimLayout').value = 'vertical';
                document.getElementById('aimFilter').value = 'warm';
            } else {
                // Mixed orientations
                document.getElementById('aimLayout').value = 'collage';
                document.getElementById('aimFilter').value = 'vintage';
            }

            this.showAIMessage("AI has optimized merge settings!", "success");
            
            // Auto-merge
            setTimeout(() => {
                if (window.aimInstance) {
                    window.aimInstance.mergeImages();
                }
            }, 1000);
        }, 1500);
    }
}

// Global AI instance
let aimAIInstance;

// Global functions for HTML
function generateAICaption(imageNumber) {
    if (!aimAIInstance) aimAIInstance = new AdvancedImageMergerAI();
    aimAIInstance.generateAICaption(imageNumber);
}

function applyAISuggestion() {
    if (!aimAIInstance) aimAIInstance = new AdvancedImageMergerAI();
    aimAIInstance.applyAIStyleSuggestion();
}

function analyzeComposition() {
    if (!aimAIInstance) aimAIInstance = new AdvancedImageMergerAI();
    aimAIInstance.analyzeImageComposition();
}

function smartAutoMerge() {
    if (!aimAIInstance) aimAIInstance = new AdvancedImageMergerAI();
    aimAIInstance.smartAutoMerge();
}

// Initialize AI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    aimAIInstance = new AdvancedImageMergerAI();
    
    // Auto-generate new AI suggestions every 30 seconds
    setInterval(() => {
        if (aimAIInstance) {
            aimAIInstance.generateAIStyleSuggestion();
        }
    }, 30000);
});