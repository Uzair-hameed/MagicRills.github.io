// Image Filter Tool - Advanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('dropArea');
    const uploadBtn = document.getElementById('uploadBtn');
    const imagePreview = document.getElementById('imagePreview');
    const imageCanvas = document.getElementById('imageCanvas');
    const ctx = imageCanvas.getContext('2d');
    const themeToggle = document.getElementById('themeToggle');
    const loading = document.getElementById('loading');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    // Filter Controls
    const brightness = document.getElementById('brightness');
    const contrast = document.getElementById('contrast');
    const saturation = document.getElementById('saturation');
    const temperature = document.getElementById('temperature');
    const exposure = document.getElementById('exposure');
    const grayscale = document.getElementById('grayscale');
    const sepia = document.getElementById('sepia');
    const hue = document.getElementById('hue');
    const invert = document.getElementById('invert');
    const vibrance = document.getElementById('vibrance');
    
    // Buttons
    const resetBtn = document.getElementById('resetBtn');
    const savePresetBtn = document.getElementById('savePresetBtn');
    const cropBtn = document.getElementById('cropBtn');
    const applyCropBtn = document.getElementById('applyCropBtn');
    const cancelCropBtn = document.getElementById('cancelCropBtn');
    const cropControls = document.getElementById('cropControls');
    const downloadBtn = document.getElementById('downloadBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const rotateBtn = document.getElementById('rotateBtn');
    const originalBtn = document.getElementById('originalBtn');
    const aiButtons = document.querySelectorAll('.ai-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const formatOptions = document.querySelectorAll('input[name="format"]');
    
    // State Variables
    let originalImage = null;
    let isCropping = false;
    let cropX = 0, cropY = 0, cropWidth = 0, cropHeight = 0;
    let startX = 0, startY = 0;
    let currentZoom = 1;
    let currentRotation = 0;
    let editHistory = [];
    let currentFilter = '';
    
    // Initialize the tool
    function init() {
        setupEventListeners();
        updateSliderValues();
        applyTheme();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // File handling
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
        
        // Drag and drop
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('active');
        });
        
        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('active');
        });
        
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('active');
            handleFiles(e.dataTransfer.files);
        });
        
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Filter controls
        brightness.addEventListener('input', () => updateSliderValue(brightness, 'brightnessValue', '%'));
        contrast.addEventListener('input', () => updateSliderValue(contrast, 'contrastValue', '%'));
        saturation.addEventListener('input', () => updateSliderValue(saturation, 'saturationValue', '%'));
        temperature.addEventListener('input', () => updateSliderValue(temperature, 'temperatureValue'));
        exposure.addEventListener('input', () => updateSliderValue(exposure, 'exposureValue'));
        grayscale.addEventListener('input', () => updateSliderValue(grayscale, 'grayscaleValue', '%'));
        sepia.addEventListener('input', () => updateSliderValue(sepia, 'sepiaValue', '%'));
        hue.addEventListener('input', () => updateSliderValue(hue, 'hueValue', '°'));
        invert.addEventListener('input', () => updateSliderValue(invert, 'invertValue', '%'));
        vibrance.addEventListener('input', () => updateSliderValue(vibrance, 'vibranceValue'));
        
        // Action buttons
        resetBtn.addEventListener('click', resetFilters);
        savePresetBtn.addEventListener('click', savePreset);
        cropBtn.addEventListener('click', startCrop);
        applyCropBtn.addEventListener('click', applyCrop);
        cancelCropBtn.addEventListener('click', cancelCrop);
        downloadBtn.addEventListener('click', downloadImage);
        
        // Preview controls
        zoomInBtn.addEventListener('click', () => adjustZoom(0.1));
        zoomOutBtn.addEventListener('click', () => adjustZoom(-0.1));
        rotateBtn.addEventListener('click', rotateImage);
        originalBtn.addEventListener('click', toggleOriginal);
        
        // AI and preset buttons
        aiButtons.forEach(btn => {
            btn.addEventListener('click', () => applyAISuggestion(btn.dataset.ai));
        });
        
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
        });
        
        // Canvas events for cropping
        imageCanvas.addEventListener('mousedown', startCropSelection);
    }
    
    // Handle file selection
    function handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.onload = function() {
                resetFilters();
                imageCanvas.width = originalImage.width;
                imageCanvas.height = originalImage.height;
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                redrawCanvas();
                addToHistory('Original Image');
                showNotification('Image loaded successfully');
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // Update slider value display
    function updateSliderValue(slider, valueId, suffix = '') {
        document.getElementById(valueId).textContent = slider.value + suffix;
        applyFilters();
    }
    
    // Update all slider values
    function updateSliderValues() {
        updateSliderValue(brightness, 'brightnessValue', '%');
        updateSliderValue(contrast, 'contrastValue', '%');
        updateSliderValue(saturation, 'saturationValue', '%');
        updateSliderValue(temperature, 'temperatureValue');
        updateSliderValue(exposure, 'exposureValue');
        updateSliderValue(grayscale, 'grayscaleValue', '%');
        updateSliderValue(sepia, 'sepiaValue', '%');
        updateSliderValue(hue, 'hueValue', '°');
        updateSliderValue(invert, 'invertValue', '%');
        updateSliderValue(vibrance, 'vibranceValue');
    }
    
    // Apply all filters to the image
    function applyFilters() {
        if (!originalImage) return;
        
        // Save current state to history
        saveStateToHistory();
        
        // Clear canvas
        ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        
        // Apply transformations
        ctx.save();
        
        // Apply rotation
        if (currentRotation !== 0) {
            ctx.translate(imageCanvas.width / 2, imageCanvas.height / 2);
            ctx.rotate(currentRotation * Math.PI / 180);
            ctx.translate(-imageCanvas.width / 2, -imageCanvas.height / 2);
        }
        
        // Draw the image
        ctx.drawImage(originalImage, 0, 0, imageCanvas.width, imageCanvas.height);
        
        // Apply filters
        let filterString = '';
        
        // Basic adjustments
        filterString += `brightness(${brightness.value}%) `;
        filterString += `contrast(${contrast.value}%) `;
        filterString += `saturate(${saturation.value}%) `;
        
        // Color filters
        filterString += `grayscale(${grayscale.value}%) `;
        filterString += `sepia(${sepia.value}%) `;
        filterString += `hue-rotate(${hue.value}deg) `;
        filterString += `invert(${invert.value}%) `;
        
        // Apply the filter
        ctx.filter = filterString;
        
        // Redraw with filters
        ctx.drawImage(originalImage, 0, 0, imageCanvas.width, imageCanvas.height);
        
        // Apply temperature and exposure (these require more complex processing)
        applyTemperatureAndExposure();
        
        ctx.restore();
        
        // Update the preview
        imagePreview.src = imageCanvas.toDataURL();
    }
    
    // Apply temperature and exposure adjustments
    function applyTemperatureAndExposure() {
        // This is a simplified implementation
        // In a real application, you would use more complex algorithms
        const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
        const data = imageData.data;
        
        // Temperature adjustment (warm/cool)
        const tempValue = temperature.value / 100;
        for (let i = 0; i < data.length; i += 4) {
            // Red channel (warmth)
            data[i] = clamp(data[i] * (1 + tempValue * 0.3), 0, 255);
            // Blue channel (coolness)
            data[i + 2] = clamp(data[i + 2] * (1 - tempValue * 0.3), 0, 255);
        }
        
        // Exposure adjustment
        const expValue = exposure.value / 100;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = clamp(data[i] * (1 + expValue), 0, 255);
            data[i + 1] = clamp(data[i + 1] * (1 + expValue), 0, 255);
            data[i + 2] = clamp(data[i + 2] * (1 + expValue), 0, 255);
        }
        
        // Vibrance adjustment
        const vibValue = vibrance.value / 100;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const max = Math.max(r, g, b);
            if (max > 128) {
                data[i] = clamp(r * (1 + vibValue), 0, 255);
                data[i + 1] = clamp(g * (1 + vibValue), 0, 255);
                data[i + 2] = clamp(b * (1 + vibValue), 0, 255);
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    // Clamp value between min and max
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    // Reset all filters to default
    function resetFilters() {
        brightness.value = 100;
        contrast.value = 100;
        saturation.value = 100;
        temperature.value = 0;
        exposure.value = 0;
        grayscale.value = 0;
        sepia.value = 0;
        hue.value = 0;
        invert.value = 0;
        vibrance.value = 0;
        currentZoom = 1;
        currentRotation = 0;
        
        updateSliderValues();
        redrawCanvas();
        showNotification('Filters reset');
    }
    
    // Redraw the canvas
    function redrawCanvas() {
        if (!originalImage) return;
        
        imageCanvas.width = originalImage.width;
        imageCanvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);
        applyFilters();
    }
    
    // Apply AI suggestion
    function applyAISuggestion(type) {
        showLoading();
        
        // Simulate AI processing
        setTimeout(() => {
            switch(type) {
                case 'enhance':
                    brightness.value = 110;
                    contrast.value = 115;
                    saturation.value = 105;
                    vibrance.value = 10;
                    break;
                case 'portrait':
                    brightness.value = 105;
                    contrast.value = 110;
                    saturation.value = 95;
                    temperature.value = 5;
                    break;
                case 'landscape':
                    brightness.value = 105;
                    saturation.value = 120;
                    vibrance.value = 15;
                    temperature.value = -5;
                    break;
                case 'vintage':
                    saturation.value = 85;
                    sepia.value = 30;
                    temperature.value = 15;
                    break;
            }
            
            updateSliderValues();
            applyFilters();
            hideLoading();
            showNotification(`AI ${type} filter applied`);
        }, 1000);
    }
    
    // Apply preset filter
    function applyPreset(preset) {
        switch(preset) {
            case 'vintage':
                brightness.value = 95;
                contrast.value = 90;
                saturation.value = 80;
                sepia.value = 40;
                temperature.value = 20;
                break;
            case 'blackWhite':
                grayscale.value = 100;
                contrast.value = 120;
                break;
            case 'cool':
                temperature.value = -30;
                saturation.value = 110;
                break;
            case 'warm':
                temperature.value = 30;
                saturation.value = 110;
                break;
            case 'dramatic':
                brightness.value = 90;
                contrast.value = 130;
                saturation.value = 85;
                break;
            case 'cinematic':
                brightness.value = 85;
                contrast.value = 120;
                saturation.value = 95;
                vibrance.value = 10;
                break;
        }
        
        updateSliderValues();
        applyFilters();
        showNotification(`${preset} preset applied`);
    }
    
    // Save current filter settings as a preset
    function savePreset() {
        const presetName = prompt('Enter a name for your preset:');
        if (presetName) {
            // In a real application, you would save this to localStorage or a database
            showNotification(`Preset "${presetName}" saved`);
        }
    }
    
    // Start cropping mode
    function startCrop() {
        isCropping = true;
        cropControls.style.display = 'block';
        showNotification('Click and drag to select crop area');
    }
    
    // Start crop selection
    function startCropSelection(e) {
        if (!isCropping) return;
        
        const rect = imageCanvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        imageCanvas.addEventListener('mousemove', updateCropSelection);
        imageCanvas.addEventListener('mouseup', endCropSelection);
    }
    
    // Update crop selection
    function updateCropSelection(e) {
        const rect = imageCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        cropX = Math.min(startX, currentX);
        cropY = Math.min(startY, currentY);
        cropWidth = Math.abs(currentX - startX);
        cropHeight = Math.abs(currentY - startY);
        
        // Draw selection rectangle
        redrawCanvas();
        ctx.strokeStyle = '#4285f4';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);
        ctx.setLineDash([]);
    }
    
    // End crop selection
    function endCropSelection() {
        imageCanvas.removeEventListener('mousemove', updateCropSelection);
        imageCanvas.removeEventListener('mouseup', endCropSelection);
    }
    
    // Apply the crop
    function applyCrop() {
        if (cropWidth > 0 && cropHeight > 0) {
            // Create a new canvas with the cropped dimensions
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = cropWidth;
            croppedCanvas.height = cropHeight;
            const croppedCtx = croppedCanvas.getContext('2d');
            
            // Draw the cropped portion
            croppedCtx.drawImage(
                imageCanvas, 
                cropX, cropY, cropWidth, cropHeight,
                0, 0, cropWidth, cropHeight
            );
            
            // Update the original image and canvas
            originalImage = new Image();
            originalImage.onload = function() {
                imageCanvas.width = cropWidth;
                imageCanvas.height = cropHeight;
                redrawCanvas();
                addToHistory('Crop Applied');
            };
            originalImage.src = croppedCanvas.toDataURL();
        }
        
        cancelCrop();
    }
    
    // Cancel cropping
    function cancelCrop() {
        isCropping = false;
        cropControls.style.display = 'none';
        redrawCanvas();
    }
    
    // Adjust zoom level
    function adjustZoom(amount) {
        currentZoom = Math.max(0.1, Math.min(5, currentZoom + amount));
        updateZoomDisplay();
        showNotification(`Zoom: ${Math.round(currentZoom * 100)}%`);
    }
    
    // Update zoom display
    function updateZoomDisplay() {
        document.getElementById('zoomInfo').textContent = `${Math.round(currentZoom * 100)}%`;
        imagePreview.style.transform = `scale(${currentZoom})`;
    }
    
    // Rotate image
    function rotateImage() {
        currentRotation = (currentRotation + 90) % 360;
        redrawCanvas();
        showNotification(`Image rotated ${currentRotation}°`);
    }
    
    // Toggle original image view
    function toggleOriginal() {
        if (imagePreview.style.display === 'block') {
            imagePreview.style.display = 'none';
            imageCanvas.style.display = 'block';
            originalBtn.innerHTML = '<i class="fas fa-eye"></i> Filtered';
        } else {
            imagePreview.style.display = 'block';
            imageCanvas.style.display = 'none';
            originalBtn.innerHTML = '<i class="fas fa-eye"></i> Original';
        }
    }
    
    // Download the processed image
    function downloadImage() {
        if (!originalImage) {
            showNotification('Please upload an image first', 'error');
            return;
        }
        
        // Get selected format
        let format = 'jpg';
        formatOptions.forEach(option => {
            if (option.checked) format = option.value;
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = `filtered-image.${format}`;
        link.href = imageCanvas.toDataURL(`image/${format}`);
        link.click();
        
        showNotification('Image downloaded successfully');
    }
    
    // Add action to history
    function addToHistory(action) {
        const historyItem = {
            action,
            timestamp: new Date().toLocaleTimeString(),
            preview: imageCanvas.toDataURL()
        };
        
        editHistory.push(historyItem);
        updateHistoryDisplay();
    }
    
    // Save current state to history
    function saveStateToHistory() {
        // Limit history to 10 items
        if (editHistory.length > 10) {
            editHistory.shift();
        }
    }
    
    // Update history display
    function updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (editHistory.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-clock"></i>
                    <p>Your edit history will appear here</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = editHistory.map(item => `
            <div class="history-item">
                <img src="${item.preview}" alt="${item.action}">
                <div class="history-info">
                    <p>${item.action}</p>
                    <span>${item.timestamp}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme button icon
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        showNotification(`${newTheme === 'dark' ? 'Dark' : 'Light'} theme activated`);
    }
    
    // Apply saved theme
    function applyTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update theme button icon
        const icon = themeToggle.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Show loading indicator
    function showLoading() {
        loading.style.display = 'flex';
    }
    
    // Hide loading indicator
    function hideLoading() {
        loading.style.display = 'none';
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        notificationText.textContent = message;
        
        // Set color based on type
        if (type === 'error') {
            notification.style.background = 'var(--accent-color)';
        } else if (type === 'warning') {
            notification.style.background = 'var(--warning-color)';
            notification.style.color = '#333';
        } else {
            notification.style.background = 'var(--secondary-color)';
        }
        
        notification.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // Initialize the tool
    init();
});