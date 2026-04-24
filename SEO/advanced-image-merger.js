/* ========================================
   Advanced Image Merger - Complete JavaScript
   MagicRills.com
   ======================================== */

// ========== Global Variables ==========
let images = [null, null];
let canvas = document.getElementById("finalCanvas");
let ctx = canvas.getContext("2d");
let textStyles = {
    bold1: false, italic1: false, underline1: false,
    bold2: false, italic2: false, underline2: false
};
let captionPositions = {1: "bottom-center", 2: "bottom-center"};

// Tool ID for database tracking
const TOOL_ID = "image-merger";
const TOOL_NAME = "Advanced Image Merger";

// ========== DOM Elements ==========
const imageUpload1 = document.getElementById("imageUpload1");
const imageUpload2 = document.getElementById("imageUpload2");
const preview1 = document.getElementById("preview1");
const preview2 = document.getElementById("preview2");
const mergeBtn = document.getElementById("mergeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const spacingInput = document.getElementById("spacing");
const spacingValue = document.getElementById("spacingValue");

// ========== Toast Notification System ==========
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "";
    if (type === "success") icon = '<i class="fas fa-check-circle"></i>';
    else if (type === "error") icon = '<i class="fas fa-exclamation-circle"></i>';
    else if (type === "info") icon = '<i class="fas fa-info-circle"></i>';
    
    toast.innerHTML = `
        ${icon}
        <div class="toast-content">${message}</div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = "slideInRight 0.3s ease reverse";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== Scroll Buttons ==========
const scrollTopBtn = document.getElementById("scrollTopBtn");
const scrollBottomBtn = document.getElementById("scrollBottomBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        scrollTopBtn.classList.add("visible");
    } else {
        scrollTopBtn.classList.remove("visible");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Scrolled to top", "info");
});

scrollBottomBtn.addEventListener("click", () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    showToast("Scrolled to bottom", "info");
});

// ========== Copy Page Link ==========
document.getElementById("copyPageLink")?.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "success");
        
        // Track share
        trackShare("copy-link", window.location.href);
    } catch (err) {
        showToast("Failed to copy link", "error");
    }
});

// ========== Social Share Buttons ==========
document.querySelectorAll(".social-icon[data-platform]").forEach(btn => {
    btn.addEventListener("click", () => {
        const platform = btn.dataset.platform;
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent("Advanced Image Merger - Merge images with captions");
        
        let shareUrl = "";
        switch(platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
            case "email":
                shareUrl = `mailto:?subject=${title}&body=${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400");
            trackShare(platform, window.location.href);
            showToast(`Shared on ${platform}!`, "success");
        }
    });
});

// ========== Track Share Function ==========
async function trackShare(platform, pageUrl) {
    try {
        const response = await fetch("/api/share-tool", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tool_id: TOOL_ID,
                platform: platform,
                page_url: pageUrl
            })
        });
        
        if (!response.ok) {
            console.error("Share tracking failed");
        }
    } catch (error) {
        console.error("Share tracking error:", error);
    }
}

// ========== Track Usage ==========
async function trackUsage() {
    try {
        const response = await fetch("/api/track-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tool_id: TOOL_ID, tool_name: TOOL_NAME })
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById("usageCount").textContent = data.total_uses || "0";
        }
    } catch (error) {
        console.error("Usage tracking error:", error);
    }
}

// ========== Load Usage Count ==========
async function loadUsageCount() {
    try {
        const response = await fetch(`/api/tool-stats/${TOOL_ID}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById("usageCount").textContent = data.usage_count || "0";
        }
    } catch (error) {
        console.error("Load usage error:", error);
    }
}

// ========== Load Reactions ==========
async function loadReactions() {
    try {
        const response = await fetch(`/api/get-reactions/${TOOL_ID}`);
        if (response.ok) {
            const data = await response.json();
            for (const [reaction, count] of Object.entries(data)) {
                const countSpan = document.getElementById(`${reaction}Count`);
                if (countSpan) countSpan.textContent = count;
            }
        }
    } catch (error) {
        console.error("Load reactions error:", error);
    }
}

// ========== Add Reaction ==========
async function addReaction(reactionType) {
    try {
        const response = await fetch("/api/add-reaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tool_id: TOOL_ID,
                reaction_type: reactionType
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const countSpan = document.getElementById(`${reactionType}Count`);
            if (countSpan) countSpan.textContent = data.count;
            showToast(`Reaction added! 👍`, "success");
        } else if (response.status === 409) {
            showToast(`You already reacted with ${reactionType}!`, "info");
        }
    } catch (error) {
        console.error("Add reaction error:", error);
    }
}

// ========== Reaction Button Listeners ==========
document.querySelectorAll(".reaction-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const reaction = btn.dataset.reaction;
        if (reaction) addReaction(reaction);
    });
});

// ========== Image Load Functions ==========
function loadImage(e, index) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    const preview = document.getElementById(`preview${index + 1}`);
    preview.innerHTML = '<div class="loading"></div><span>Loading...</span>';
    
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            images[index] = img;
            preview.innerHTML = "";
            const previewImg = document.createElement("img");
            previewImg.src = event.target.result;
            preview.appendChild(previewImg);
            showToast(`Image ${index + 1} loaded successfully!`, "success");
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

imageUpload1.addEventListener("change", (e) => loadImage(e, 0));
imageUpload2.addEventListener("change", (e) => loadImage(e, 1));

// ========== Style Toggle ==========
function toggleStyle(styleId) {
    textStyles[styleId] = !textStyles[styleId];
    const btn = document.getElementById(styleId);
    if (btn) btn.classList.toggle("active");
}

document.querySelectorAll(".style-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const styleId = btn.id;
        if (styleId) toggleStyle(styleId);
    });
});

// ========== Caption Position ==========
function setCaptionPos(btn, imgNum) {
    const pos = btn.getAttribute("data-pos");
    captionPositions[imgNum] = pos;
    
    const container = btn.parentElement;
    container.querySelectorAll(".pos-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

document.querySelectorAll(".caption-position").forEach(container => {
    const imgNum = container.getAttribute("data-img");
    container.querySelectorAll(".pos-btn").forEach(btn => {
        btn.addEventListener("click", () => setCaptionPos(btn, imgNum));
    });
});

// ========== Spacing Display ==========
spacingInput.addEventListener("input", () => {
    spacingValue.textContent = spacingInput.value + "px";
});

// ========== Apply Crop ==========
function applyCrop(img, ratio) {
    if (ratio === "none") return img;
    
    const ratios = {"1:1": 1, "4:3": 4/3, "16:9": 16/9, "3:4": 3/4};
    const targetRatio = ratios[ratio];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const imgRatio = img.width / img.height;
    
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    
    if ((ratio === "3:4" && imgRatio > targetRatio) || (ratio !== "3:4" && imgRatio > targetRatio)) {
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
    } else if ((ratio === "3:4" && imgRatio < targetRatio) || (ratio !== "3:4" && imgRatio < targetRatio)) {
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
    }
    
    canvas.width = ratio === "3:4" ? img.height * targetRatio : img.width;
    canvas.height = ratio === "3:4" ? img.height : img.width / targetRatio;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    
    const newImg = new Image();
    newImg.src = canvas.toDataURL();
    return newImg;
}

// ========== Resize Image ==========
function resizeImage(img, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    const newImg = new Image();
    newImg.src = canvas.toDataURL();
    return newImg;
}

// ========== Apply Filter ==========
function applyFilter(ctx, canvas, filter) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    if (filter === "grayscale") {
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
    } else if (filter === "sepia") {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
    } else if (filter === "brightness") {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] = Math.min(255, data[i + 1] * 1.2);
            data[i + 2] = Math.min(255, data[i + 2] * 1.2);
        }
    } else if (filter === "contrast") {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, 128 + (data[i] - 128) * 1.5);
            data[i + 1] = Math.min(255, 128 + (data[i + 1] - 128) * 1.5);
            data[i + 2] = Math.min(255, 128 + (data[i + 2] - 128) * 1.5);
        }
    } else if (filter === "invert") {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// ========== Draw Image with Border ==========
function drawImageWithBorder(img, filter, borderStyle, borderColor, x, y) {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0);
    
    if (filter !== "none") {
        applyFilter(tempCtx, tempCanvas, filter);
    }
    
    if (borderStyle !== "none") {
        tempCtx.strokeStyle = borderColor;
        tempCtx.lineWidth = 3;
        
        if (borderStyle === "dashed") {
            tempCtx.setLineDash([8, 8]);
        } else if (borderStyle === "shadow") {
            tempCtx.shadowColor = "rgba(0,0,0,0.5)";
            tempCtx.shadowBlur = 10;
            tempCtx.shadowOffsetX = 5;
            tempCtx.shadowOffsetY = 5;
        }
        
        tempCtx.strokeRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        if (borderStyle === "shadow") {
            tempCtx.shadowColor = "transparent";
        }
    }
    
    ctx.drawImage(tempCanvas, x, y);
}

// ========== Draw Caption ==========
function drawCaption(imgNum, imgWidth, imgHeight, offsetX, offsetY) {
    const caption = document.getElementById(`caption${imgNum}`).value;
    if (!caption) return;
    
    const fontFamily = document.getElementById(`font${imgNum}`).value;
    const fontSize = parseInt(document.getElementById(`size${imgNum}`).value);
    const color = document.getElementById(`color${imgNum}`).value;
    const textBgColor = document.getElementById(`textBgColor${imgNum}`).value;
    const textBgOpacity = parseFloat(document.getElementById(`textBgOpacity${imgNum}`)?.value || 0.5);
    const bold = textStyles[`bold${imgNum}`];
    const italic = textStyles[`italic${imgNum}`];
    const underline = textStyles[`underline${imgNum}`];
    const pos = captionPositions[imgNum];
    
    let fontStyle = "";
    if (bold) fontStyle += "bold ";
    if (italic) fontStyle += "italic ";
    fontStyle += `${fontSize}px ${fontFamily}`;
    
    ctx.font = fontStyle;
    ctx.fillStyle = color;
    
    const textMetrics = ctx.measureText(caption);
    const textWidth = textMetrics.width;
    
    let x, y, textAlign, textBaseline;
    
    switch(pos) {
        case "top-left":
            x = offsetX + 15;
            y = offsetY + fontSize + 10;
            textAlign = "left";
            textBaseline = "top";
            break;
        case "top-center":
            x = offsetX + imgWidth / 2;
            y = offsetY + fontSize + 10;
            textAlign = "center";
            textBaseline = "top";
            break;
        case "top-right":
            x = offsetX + imgWidth - 15;
            y = offsetY + fontSize + 10;
            textAlign = "right";
            textBaseline = "top";
            break;
        case "middle-left":
            x = offsetX + 15;
            y = offsetY + imgHeight / 2;
            textAlign = "left";
            textBaseline = "middle";
            break;
        case "middle-right":
            x = offsetX + imgWidth - 15;
            y = offsetY + imgHeight / 2;
            textAlign = "right";
            textBaseline = "middle";
            break;
        case "bottom-left":
            x = offsetX + 15;
            y = offsetY + imgHeight - 10;
            textAlign = "left";
            textBaseline = "bottom";
            break;
        case "bottom-center":
            x = offsetX + imgWidth / 2;
            y = offsetY + imgHeight - 10;
            textAlign = "center";
            textBaseline = "bottom";
            break;
        case "bottom-right":
            x = offsetX + imgWidth - 15;
            y = offsetY + imgHeight - 10;
            textAlign = "right";
            textBaseline = "bottom";
            break;
        default:
            x = offsetX + imgWidth / 2;
            y = offsetY + imgHeight - 10;
            textAlign = "center";
            textBaseline = "bottom";
    }
    
    // Draw background with opacity
    if (textBgColor !== "#ffffff00") {
        const padding = 8;
        const bgHeight = fontSize + padding * 2;
        let bgY = y;
        
        if (textBaseline === "top") {
            bgY = y - padding;
        } else if (textBaseline === "middle") {
            bgY = y - fontSize/2 - padding;
        } else if (textBaseline === "bottom") {
            bgY = y - fontSize - padding;
        }
        
        ctx.save();
        ctx.globalAlpha = textBgOpacity;
        ctx.fillStyle = textBgColor;
        
        if (textAlign === "left") {
            ctx.fillRect(x - padding, bgY, textWidth + padding * 2, bgHeight);
        } else if (textAlign === "center") {
            ctx.fillRect(x - textWidth/2 - padding, bgY, textWidth + padding * 2, bgHeight);
        } else if (textAlign === "right") {
            ctx.fillRect(x - textWidth - padding, bgY, textWidth + padding * 2, bgHeight);
        }
        
        ctx.restore();
    }
    
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(caption, x, y);
    
    // Draw underline
    if (underline) {
        const underlineY = y + 3;
        let underlineX1 = x, underlineX2 = x;
        
        if (textAlign === "left") {
            underlineX1 = x;
            underlineX2 = x + textWidth;
        } else if (textAlign === "center") {
            underlineX1 = x - textWidth/2;
            underlineX2 = x + textWidth/2;
        } else if (textAlign === "right") {
            underlineX1 = x - textWidth;
            underlineX2 = x;
        }
        
        ctx.beginPath();
        ctx.moveTo(underlineX1, underlineY);
        ctx.lineTo(underlineX2, underlineY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// ========== Merge Images ==========
async function mergeImages() {
    if (!images[0] || !images[1]) {
        showToast("Please upload both images first!", "error");
        return;
    }
    
    // Track usage when merge is performed
    await trackUsage();
    
    const layout = document.querySelector("input[name='layout']:checked").value;
    const ratio = document.getElementById("cropRatio").value;
    const bgColor = document.getElementById("bgColor").value;
    const filter = document.getElementById("imageFilter").value;
    const borderStyle = document.getElementById("imageBorder").value;
    const borderColor = document.getElementById("borderColor").value;
    const spacing = parseInt(document.getElementById("spacing").value);
    const equalSize = document.getElementById("equalSize").checked;
    
    let img1 = applyCrop(images[0], ratio);
    let img2 = applyCrop(images[1], ratio);
    let width, height;
    
    if (equalSize) {
        const maxWidth = Math.max(img1.width, img2.width);
        const maxHeight = Math.max(img1.height, img2.height);
        img1 = resizeImage(img1, maxWidth, maxHeight);
        img2 = resizeImage(img2, maxWidth, maxHeight);
    }
    
    if (layout === "horizontal") {
        width = img1.width + img2.width + spacing;
        height = Math.max(img1.height, img2.height);
    } else {
        width = Math.max(img1.width, img2.width);
        height = img1.height + img2.height + spacing;
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    if (layout === "horizontal") {
        drawImageWithBorder(img1, filter, borderStyle, borderColor, 0, (height - img1.height) / 2);
        drawImageWithBorder(img2, filter, borderStyle, borderColor, img1.width + spacing, (height - img2.height) / 2);
        drawCaption(1, img1.width, img1.height, 0, (height - img1.height) / 2);
        drawCaption(2, img2.width, img2.height, img1.width + spacing, (height - img2.height) / 2);
    } else {
        drawImageWithBorder(img1, filter, borderStyle, borderColor, (width - img1.width) / 2, 0);
        drawImageWithBorder(img2, filter, borderStyle, borderColor, (width - img2.width) / 2, img1.height + spacing);
        drawCaption(1, img1.width, img1.height, (width - img1.width) / 2, 0);
        drawCaption(2, img2.width, img2.height, (width - img2.width) / 2, img1.height + spacing);
    }
    
    downloadBtn.disabled = false;
    showToast("Images merged successfully!", "success");
}

// ========== Download Image ==========
function downloadImage() {
    const link = document.createElement("a");
    link.download = `merged-image-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Image downloaded successfully!", "success");
}

// ========== Clear All ==========
function clearAll() {
    images = [null, null];
    
    // Clear previews
    preview1.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>';
    preview2.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>';
    
    // Clear file inputs
    imageUpload1.value = "";
    imageUpload2.value = "";
    
    // Clear captions
    document.getElementById("caption1").value = "";
    document.getElementById("caption2").value = "";
    
    // Reset text styles
    textStyles = {
        bold1: false, italic1: false, underline1: false,
        bold2: false, italic2: false, underline2: false
    };
    document.querySelectorAll(".style-btn").forEach(btn => btn.classList.remove("active"));
    
    // Reset caption positions
    captionPositions = {1: "bottom-center", 2: "bottom-center"};
    document.querySelectorAll(".pos-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-pos") === "bottom-center") {
            btn.classList.add("active");
        }
    });
    
    // Reset text background
    document.getElementById("textBgColor1").value = "#ffffff";
    document.getElementById("textBgColor2").value = "#ffffff";
    if (document.getElementById("textBgOpacity1")) document.getElementById("textBgOpacity1").value = 0.5;
    if (document.getElementById("textBgOpacity2")) document.getElementById("textBgOpacity2").value = 0.5;
    
    // Reset merge options
    document.getElementById("layoutHorizontal").checked = true;
    spacingInput.value = 10;
    spacingValue.textContent = "10px";
    document.getElementById("equalSize").checked = true;
    document.getElementById("cropRatio").value = "none";
    document.getElementById("bgColor").value = "#ffffff";
    document.getElementById("imageFilter").value = "none";
    document.getElementById("imageBorder").value = "none";
    document.getElementById("borderColor").value = "#000000";
    
    // Reset fonts
    document.getElementById("font1").value = "Arial";
    document.getElementById("font2").value = "Arial";
    document.getElementById("size1").value = "24";
    document.getElementById("size2").value = "24";
    document.getElementById("color1").value = "#000000";
    document.getElementById("color2").value = "#000000";
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
    
    // Disable download button
    downloadBtn.disabled = true;
    
    showToast("All data cleared!", "info");
}

// ========== Event Listeners ==========
mergeBtn.addEventListener("click", mergeImages);
downloadBtn.addEventListener("click", downloadImage);
clearBtn.addEventListener("click", clearAll);

// ========== Initialize ==========
async function init() {
    await loadUsageCount();
    await loadReactions();
    
    // Preview click to upload
    preview1.addEventListener("click", () => imageUpload1.click());
    preview2.addEventListener("click", () => imageUpload2.click());
    
    showToast("Welcome to Advanced Image Merger! 🎨", "info");
}

init();
