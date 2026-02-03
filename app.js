// --- CONFIGURATION ---
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1468271554755428377/jeRj7K7xv3KXHkiFGIWanUSPBaXmxTR-Xcc3agxVSlRzTE6Sd0F-g6Krv3Si4jUWJ1F1";

const video = document.getElementById('video');
const statusEl = document.getElementById('status');
const nameInput = document.getElementById('visitor-name');
const ringBtn = document.getElementById('ringButton');

// 1. Initialize Camera
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        if ('wakeLock' in navigator) await navigator.wakeLock.request('screen');
    } catch (err) {
        statusEl.innerText = "Error: Please enable camera.";
    }
}

// 2. Ring Logic
async function ringDoorbell() {
    const visitorName = nameInput.value.trim() || "Someone";
    statusEl.innerText = `Sending alert for ${visitorName}...`;
    ringBtn.disabled = true;

    // Capture Frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'visitor.png');
       
        // Custom message using the Name Box
        const discordMessage = `🔔 **DOORBELL:** ${visitorName} is at the door!`;
        formData.append('content', discordMessage);

        try {
            const res = await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', body: formData });
            if (res.ok) {
                statusEl.innerText = "✅ Alert Sent!";
                nameInput.value = ""; // Clear name after successful ring
            }
        } catch (err) {
            statusEl.innerText = "❌ Connection Error.";
        }

        setTimeout(() => {
            statusEl.innerText = "System Online";
            ringBtn.disabled = false;
        }, 5000);
    }, 'image/png');
}

ringBtn.addEventListener('click', ringDoorbell);
init();