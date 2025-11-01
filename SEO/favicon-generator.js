document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const canvas = document.getElementById('favicon-preview');
    const ctx = canvas.getContext('2d');
    const textInput = document.getElementById('favicon-text');
    const textColor = document.getElementById('text-color');
    const textColorHex = document.getElementById('text-color-hex');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const bgType = document.getElementById('bg-type');
    const bgColor = document.getElementById('bg-color');
    const bgColorHex = document.getElementById('bg-color-hex');
    const bgGradient = document.getElementById('bg-gradient');
    const bgColor2 = document.getElementById('bg-color-2');
    const bgColor2Hex = document.getElementById('bg-color-2-hex');
    const textPadding = document.getElementById('text-padding');
    const textPaddingValue = document.getElementById('text-padding-value');
    const shadowColor = document.getElementById('shadow-color');
    const shadowColorHex = document.getElementById('shadow-color-hex');
    const shadowBlur = document.getElementById('shadow-blur');
    const shadowBlurValue = document.getElementById('shadow-blur-value');
    const shadowOffset = document.getElementById('shadow-offset');
    const shadowOffsetValue = document.getElementById('shadow-offset-value');
    const borderWidth = document.getElementById('border-width');
    const borderWidthValue = document.getElementById('border-width-value');
    const borderColor = document.getElementById('border-color');
    const borderColorHex = document.getElementById('border-color-hex');
    const toggleAdvanced = document.getElementById('toggle-advanced');
    const advancedOptions = document.getElementById('advanced-options');
    const downloadPng = document.getElementById('download-png');
    const downloadIco = document.getElementById('download-ico');
    const aiSuggestBtn = document.getElementById('ai-suggest');
    const aiSuggestions = document.getElementById('ai-suggestions');
    const suggestionsGrid = document.getElementById('suggestions-grid');
    const recentDesignsGrid = document.getElementById('recent-designs-grid');
    const themeSwitcher = document.getElementById('theme-switcher');
    const sizeOptions = document.querySelectorAll('.size-option');
    const gradientColorRow = document.getElementById('gradient-color-row');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    const charCount = document.querySelector('.char-count');
    const colorRandomButtons = document.querySelectorAll('.color-random');

    // State variables
    let showAdvanced = false;
    let currentPreviewSize = 128;
    let recentDesigns = JSON.parse(localStorage.getItem('faviconRecentDesigns')) || [];
    let isDarkTheme = localStorage.getItem('faviconDarkTheme') === 'true';

    // Initialize
    function init() {
        // Set theme
        if (isDarkTheme) {
            document.body.setAttribute('data-theme', 'dark');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Load recent designs
        renderRecentDesigns();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initial render
        updateFavicon();
        
        // Show notification
        showNotification('Favicon Generator Ready!', 'success');
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Text input
        textInput.addEventListener('input', function() {
            charCount.textContent = `${this.value.length}/3`;
            updateFavicon();
        });
        
        // Color inputs
        textColor.addEventListener('input', function() {
            textColorHex.value = textColor.value;
            updateFavicon();
        });
        
        textColorHex.addEventListener('input', function() {
            if (isValidHex(this.value)) {
                textColor.value = this.value;
                updateFavicon();
            }
        });
        
        bgColor.addEventListener('input', function() {
            bgColorHex.value = bgColor.value;
            updateFavicon();
        });
        
        bgColorHex.addEventListener('input', function() {
            if (isValidHex(this.value)) {
                bgColor.value = this.value;
                updateFavicon();
            }
        });
        
        bgColor2.addEventListener('input', function() {
            bgColor2Hex.value = bgColor2.value;
            updateFavicon();
        });
        
        bgColor2Hex.addEventListener('input', function() {
            if (isValidHex(this.value)) {
                bgColor2.value = this.value;
                updateFavicon();
            }
        });
        
        shadowColor.addEventListener('input', function() {
            shadowColorHex.value = shadowColor.value;
            updateFavicon();
        });
        
        shadowColorHex.addEventListener('input', function() {
            if (isValidHex(this.value)) {
                shadowColor.value = this.value;
                updateFavicon();
            }
        });
        
        borderColor.addEventListener('input', function() {
            borderColorHex.value = borderColor.value;
            updateFavicon();
        });
        
        borderColorHex.addEventListener('input', function() {
            if (isValidHex(this.value)) {
                borderColor.value = this.value;
                updateFavicon();
            }
        });
        
        // Font and size
        fontFamily.addEventListener('change', updateFavicon);
        
        fontSize.addEventListener('input', function() {
            fontSizeValue.value = fontSize.value;
            updateFavicon();
        });
        
        fontSizeValue.addEventListener('input', function() {
            if (fontSizeValue.value >= 10 && fontSizeValue.value <= 100) {
                fontSize.value = fontSizeValue.value;
                updateFavicon();
            }
        });
        
        // Background options
        bgType.addEventListener('change', updateFavicon);
        
        bgGradient.addEventListener('change', function() {
            gradientColorRow.style.display = this.value !== 'none' ? 'flex' : 'none';
            updateFavicon();
        });
        
        // Advanced options
        textPadding.addEventListener('input', function() {
            textPaddingValue.value = textPadding.value;
            updateFavicon();
        });
        
        textPaddingValue.addEventListener('input', function() {
            if (textPaddingValue.value >= 0 && textPaddingValue.value <= 40) {
                textPadding.value = textPaddingValue.value;
                updateFavicon();
            }
        });
        
        shadowBlur.addEventListener('input', function() {
            shadowBlurValue.value = shadowBlur.value;
            updateFavicon();
        });
        
        shadowBlurValue.addEventListener('input', function() {
            if (shadowBlurValue.value >= 0 && shadowBlurValue.value <= 20) {
                shadowBlur.value = shadowBlurValue.value;
                updateFavicon();
            }
        });
        
        shadowOffset.addEventListener('input', function() {
            shadowOffsetValue.value = shadowOffset.value;
            updateFavicon();
        });
        
        shadowOffsetValue.addEventListener('input', function() {
            if (shadowOffsetValue.value >= 0 && shadowOffsetValue.value <= 10) {
                shadowOffset.value = shadowOffsetValue.value;
                updateFavicon();
            }
        });
        
        borderWidth.addEventListener('input', function() {
            borderWidthValue.value = borderWidth.value;
            updateFavicon();
        });
        
        borderWidthValue.addEventListener('input', function() {
            if (borderWidthValue.value >= 0 && borderWidthValue.value <= 10) {
                borderWidth.value = borderWidthValue.value;
                updateFavicon();
            }
        });
        
        // Buttons
        toggleAdvanced.addEventListener('click', toggleAdvancedOptions);
        downloadPng.addEventListener('click', () => downloadImage('png'));
        downloadIco.addEventListener('click', () => downloadImage('ico'));
        aiSuggestBtn.addEventListener('click', generateAISuggestions);
        themeSwitcher.addEventListener('click', toggleTheme);
        
        // Size options
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                currentPreviewSize = parseInt(this.dataset.size);
                updateFavicon();
            });
        });
        
        // Random color buttons
        colorRandomButtons.forEach(button => {
            button.addEventListener('click', function() {
                const target = this.dataset.target;
                const randomColor = getRandomColor();
                document.getElementById(target).value = randomColor;
                document.getElementById(`${target}-hex`).value = randomColor;
                updateFavicon();
            });
        });
    }

    // Update favicon preview
    function updateFavicon() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get values
        const bgShape = bgType.value;
        const text = textInput.value.toUpperCase();
        const color = textColor.value;
        const bg = bgColor.value;
        const bg2 = bgColor2.value;
        const font = `${fontSize.value}px ${fontFamily.value}`;
        const padding = parseInt(textPadding.value);
        const shadowCol = shadowColor.value;
        const shadowBl = parseInt(shadowBlur.value);
        const shadowOff = parseInt(shadowOffset.value);
        const borderW = parseInt(borderWidth.value);
        const borderCol = borderColor.value;
        const gradientType = bgGradient.value;
        
        // Draw background
        if (bgShape !== 'transparent') {
            ctx.beginPath();
            
            // Create gradient if selected
            let gradient;
            if (gradientType !== 'none') {
                if (gradientType === 'horizontal') {
                    gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                } else if (gradientType === 'vertical') {
                    gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                } else if (gradientType === 'diagonal') {
                    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                } else if (gradientType === 'radial') {
                    gradient = ctx.createRadialGradient(
                        canvas.width/2, canvas.height/2, 0,
                        canvas.width/2, canvas.height/2, canvas.width/2
                    );
                }
                
                gradient.addColorStop(0, bg);
                gradient.addColorStop(1, bg2);
            }
            
            // Draw shape
            if (bgShape === 'circle') {
                ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - borderW, 0, Math.PI * 2);
            } else if (bgShape === 'rounded') {
                const radius = 20;
                ctx.moveTo(radius + borderW, borderW);
                ctx.lineTo(canvas.width - radius - borderW, borderW);
                ctx.quadraticCurveTo(canvas.width - borderW, borderW, canvas.width - borderW, radius + borderW);
                ctx.lineTo(canvas.width - borderW, canvas.height - radius - borderW);
                ctx.quadraticCurveTo(canvas.width - borderW, canvas.height - borderW, canvas.width - radius - borderW, canvas.height - borderW);
                ctx.lineTo(radius + borderW, canvas.height - borderW);
                ctx.quadraticCurveTo(borderW, canvas.height - borderW, borderW, canvas.height - radius - borderW);
                ctx.lineTo(borderW, radius + borderW);
                ctx.quadraticCurveTo(borderW, borderW, radius + borderW, borderW);
            } else if (bgShape === 'diamond') {
                ctx.moveTo(canvas.width/2, borderW);
                ctx.lineTo(canvas.width - borderW, canvas.height/2);
                ctx.lineTo(canvas.width/2, canvas.height - borderW);
                ctx.lineTo(borderW, canvas.height/2);
            } else if (bgShape === 'hexagon') {
                const sides = 6;
                const radius = canvas.width/2 - borderW;
                const centerX = canvas.width/2;
                const centerY = canvas.height/2;
                
                ctx.moveTo(
                    centerX + radius * Math.cos(0),
                    centerY + radius * Math.sin(0)
                );
                
                for (let i = 1; i <= sides; i++) {
                    ctx.lineTo(
                        centerX + radius * Math.cos(i * 2 * Math.PI / sides),
                        centerY + radius * Math.sin(i * 2 * Math.PI / sides)
                    );
                }
            } else {
                // Square
                ctx.rect(borderW, borderW, canvas.width - borderW*2, canvas.height - borderW*2);
            }
            
            // Fill background
            ctx.fillStyle = gradient || bg;
            ctx.fill();
            
            // Draw border
            if (borderW > 0) {
                ctx.lineWidth = borderW;
                ctx.strokeStyle = borderCol;
                ctx.stroke();
            }
        }
        
        // Draw text
        if (text) {
            ctx.font = font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Set shadow
            if (shadowBl > 0 || shadowOff > 0) {
                ctx.shadowColor = shadowCol;
                ctx.shadowBlur = shadowBl;
                ctx.shadowOffsetX = shadowOff;
                ctx.shadowOffsetY = shadowOff;
            }
            
            // Draw text
            ctx.fillStyle = color;
            ctx.fillText(text, canvas.width/2, canvas.height/2);
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        
        // Save to recent designs
        saveToRecentDesigns();
    }

    // Toggle advanced options
    function toggleAdvancedOptions() {
        showAdvanced = !showAdvanced;
        advancedOptions.style.display = showAdvanced ? 'block' : 'none';
        toggleAdvanced.innerHTML = showAdvanced ? 
            '<i class="fas fa-cogs"></i> Hide Advanced Options' : 
            '<i class="fas fa-cogs"></i> Show Advanced Options';
    }

    // Generate AI suggestions
    function generateAISuggestions() {
        // Show loading state
        aiSuggestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        aiSuggestBtn.disabled = true;
        
        // Simulate AI processing time
        setTimeout(() => {
            suggestionsGrid.innerHTML = '';
            
            // Generate 4 random suggestions
            const suggestions = [
                { text: 'MR', bg: '#3498db', color: '#ffffff', shape: 'circle' },
                { text: 'MG', bg: '#2ecc71', color: '#ffffff', shape: 'rounded' },
                { text: 'AI', bg: '#9b59b6', color: '#ffffff', shape: 'diamond' },
                { text: 'FX', bg: '#e74c3c', color: '#ffffff', shape: 'hexagon' }
            ];
            
            suggestions.forEach((suggestion, index) => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.style.background = suggestion.bg;
                suggestionItem.textContent = suggestion.text;
                
                suggestionItem.addEventListener('click', () => {
                    applySuggestion(suggestion);
                });
                
                suggestionsGrid.appendChild(suggestionItem);
            });
            
            // Show suggestions
            aiSuggestions.style.display = 'block';
            
            // Reset button
            aiSuggestBtn.innerHTML = '<i class="fas fa-robot"></i> AI Suggest';
            aiSuggestBtn.disabled = false;
            
            showNotification('AI suggestions generated!', 'success');
        }, 1500);
    }

    // Apply AI suggestion
    function applySuggestion(suggestion) {
        textInput.value = suggestion.text;
        bgColor.value = suggestion.bg;
        bgColorHex.value = suggestion.bg;
        textColor.value = suggestion.color;
        textColorHex.value = suggestion.color;
        bgType.value = suggestion.shape;
        
        updateFavicon();
        showNotification('Suggestion applied!', 'success');
    }

    // Save to recent designs
    function saveToRecentDesigns() {
        const design = {
            text: textInput.value,
            bgColor: bgColor.value,
            textColor: textColor.value,
            bgType: bgType.value,
            timestamp: Date.now()
        };
        
        // Check if design already exists
        const existingIndex = recentDesigns.findIndex(d => 
            d.text === design.text && 
            d.bgColor === design.bgColor && 
            d.textColor === design.textColor && 
            d.bgType === design.bgType
        );
        
        // Remove if exists
        if (existingIndex !== -1) {
            recentDesigns.splice(existingIndex, 1);
        }
        
        // Add to beginning
        recentDesigns.unshift(design);
        
        // Limit to 6 designs
        if (recentDesigns.length > 6) {
            recentDesigns = recentDesigns.slice(0, 6);
        }
        
        // Save to localStorage
        localStorage.setItem('faviconRecentDesigns', JSON.stringify(recentDesigns));
        
        // Update UI
        renderRecentDesigns();
    }

    // Render recent designs
    function renderRecentDesigns() {
        recentDesignsGrid.innerHTML = '';
        
        recentDesigns.forEach(design => {
            const designItem = document.createElement('div');
            designItem.className = 'design-item';
            designItem.style.background = design.bgColor;
            
            // Create a mini canvas for the design
            const miniCanvas = document.createElement('canvas');
            miniCanvas.width = 60;
            miniCanvas.height = 60;
            const miniCtx = miniCanvas.getContext('2d');
            
            // Draw background shape
            miniCtx.fillStyle = design.bgColor;
            
            if (design.bgType === 'circle') {
                miniCtx.beginPath();
                miniCtx.arc(30, 30, 28, 0, Math.PI * 2);
                miniCtx.fill();
            } else if (design.bgType === 'rounded') {
                miniCtx.beginPath();
                miniCtx.roundRect(2, 2, 56, 56, 8);
                miniCtx.fill();
            } else if (design.bgType === 'diamond') {
                miniCtx.beginPath();
                miniCtx.moveTo(30, 2);
                miniCtx.lineTo(58, 30);
                miniCtx.lineTo(30, 58);
                miniCtx.lineTo(2, 30);
                miniCtx.closePath();
                miniCtx.fill();
            } else if (design.bgType === 'hexagon') {
                miniCtx.beginPath();
                const sides = 6;
                const radius = 28;
                const centerX = 30;
                const centerY = 30;
                
                miniCtx.moveTo(
                    centerX + radius * Math.cos(0),
                    centerY + radius * Math.sin(0)
                );
                
                for (let i = 1; i <= sides; i++) {
                    miniCtx.lineTo(
                        centerX + radius * Math.cos(i * 2 * Math.PI / sides),
                        centerY + radius * Math.sin(i * 2 * Math.PI / sides)
                    );
                }
                
                miniCtx.fill();
            } else {
                // Square
                miniCtx.fillRect(2, 2, 56, 56);
            }
            
            // Draw text
            if (design.text) {
                miniCtx.font = 'bold 24px Arial';
                miniCtx.textAlign = 'center';
                miniCtx.textBaseline = 'middle';
                miniCtx.fillStyle = design.textColor;
                miniCtx.fillText(design.text, 30, 30);
            }
            
            designItem.appendChild(miniCanvas);
            
            designItem.addEventListener('click', () => {
                textInput.value = design.text;
                bgColor.value = design.bgColor;
                bgColorHex.value = design.bgColor;
                textColor.value = design.textColor;
                textColorHex.value = design.textColor;
                bgType.value = design.bgType;
                
                updateFavicon();
                showNotification('Design loaded!', 'success');
            });
            
            recentDesignsGrid.appendChild(designItem);
        });
    }

    // Download image
    function downloadImage(format) {
        // Create a temporary canvas for download
        const downloadCanvas = document.createElement('canvas');
        downloadCanvas.width = currentPreviewSize;
        downloadCanvas.height = currentPreviewSize;
        const downloadCtx = downloadCanvas.getContext('2d');
        
        // Draw the favicon on the download canvas
        downloadCtx.drawImage(canvas, 0, 0, currentPreviewSize, currentPreviewSize);
        
        // Create download link
        const link = document.createElement('a');
        
        if (format === 'png') {
            link.download = `favicon-${textInput.value || 'design'}.png`;
            link.href = downloadCanvas.toDataURL('image/png');
        } else {
            // For ICO, we would need a more complex implementation
            // For now, we'll just download as PNG with .ico extension
            link.download = `favicon-${textInput.value || 'design'}.ico`;
            link.href = downloadCanvas.toDataURL('image/png');
        }
        
        link.click();
        showNotification(`${format.toUpperCase()} downloaded!`, 'success');
    }

    // Toggle theme
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        
        if (isDarkTheme) {
            document.body.setAttribute('data-theme', 'dark');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.removeAttribute('data-theme');
            themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        localStorage.setItem('faviconDarkTheme', isDarkTheme);
    }

    // Show notification
    function showNotification(message, type) {
        notificationText.textContent = message;
        notification.className = 'notification';
        notification.classList.add('show');
        
        if (type === 'success') {
            notification.style.background = 'var(--secondary-color)';
        } else if (type === 'error') {
            notification.style.background = '#e74c3c';
        }
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Utility functions
    function isValidHex(color) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(color);
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Initialize the app
    init();
});