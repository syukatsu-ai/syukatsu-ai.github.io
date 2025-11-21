// State
let isMonitoring = false;
let focusLostCount = 0;

// High-Precision Timer Variables
let startTime = 0;
let totalActiveTime = 0; // Accumulated active time (ms)
let activeSince = 0;     // Timestamp when current active session started (ms)
let lastState = true;    // true = active, false = inactive

// Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusIndicator = document.getElementById('statusIndicator');
const activeTimeEl = document.getElementById('activeTime');
const inactiveTimeEl = document.getElementById('inactiveTime');
const focusLostCountEl = document.getElementById('focusLostCount');

const focusHistoryContainer = document.getElementById('focusHistoryContainer');
const systemLogContainer = document.getElementById('systemLogContainer');
const keyLogContainer = document.getElementById('keyLogContainer');

// --- Logging Helpers ---

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    // Optional: Add milliseconds for tech demo feel? Keeping it simple MM:SS for now as per design
    return `${m}:${s}`;
}

function getTimestamp() {
    return new Date().toLocaleTimeString('ja-JP', { hour12: false });
}

function addLog(container, message, type = 'system') {
    const div = document.createElement('div');
    div.className = `log-entry ${type}`;
    div.innerHTML = `<span class="time">${getTimestamp()}</span> <span class="msg">${message}</span>`;
    container.insertBefore(div, container.firstChild);

    // Limit history
    if (container.children.length > 50) {
        container.removeChild(container.lastChild);
    }
}

// --- Core Logic ---

function checkState(source) {
    if (!isMonitoring) return;

    // Robust Check: Active only if Document is Visible AND has Focus
    const isVisible = !document.hidden;
    const hasFocus = document.hasFocus();
    const isActive = isVisible && hasFocus;

    // State Change Detection
    if (isActive !== lastState) {
        const now = Date.now();

        if (isActive) {
            // Became Active
            // Start tracking active time segment
            activeSince = now;

            addLog(focusHistoryContainer, '復帰 (Active)', 'focus-gained');
            updateStatusUI(true);
        } else {
            // Became Inactive
            // Finalize current active time segment
            if (activeSince > 0) {
                totalActiveTime += (now - activeSince);
                activeSince = 0;
            }

            let reason = '不明 (Unknown)';
            if (!isVisible) reason = 'タブ非表示 (Tab Hidden)';
            else if (!hasFocus) reason = 'フォーカス喪失 (Window Blur)';

            addLog(focusHistoryContainer, `${reason}`, 'focus-lost');
            incrementFocusLost();
            updateStatusUI(false);
        }
        lastState = isActive;
    }
}

function updateStatusUI(isActive) {
    if (isActive) {
        statusIndicator.textContent = 'ACTIVE';
        statusIndicator.className = 'status-badge active';
    } else {
        statusIndicator.textContent = 'INACTIVE';
        statusIndicator.className = 'status-badge inactive';
    }
}

function incrementFocusLost() {
    focusLostCount++;
    focusLostCountEl.textContent = focusLostCount;
}

// Timer Loop (Polling)
setInterval(() => {
    if (!isMonitoring) return;

    // 1. Poll State (Hybrid Approach)
    checkState('polling');

    // 2. Update Timers (Timestamp Math)
    const now = Date.now();
    const totalElapsed = now - startTime;

    let currentActive = totalActiveTime;
    if (lastState && activeSince > 0) {
        currentActive += (now - activeSince);
    }

    // Ensure we don't show negative numbers or weird glitches
    const currentInactive = Math.max(0, totalElapsed - currentActive);

    activeTimeEl.textContent = formatTime(currentActive);
    inactiveTimeEl.textContent = formatTime(currentInactive);

}, 100);

// --- Event Listeners ---

// 1. Visibility (Tab Switch / Minimize)
document.addEventListener('visibilitychange', () => {
    checkState('event:visibility');
});

// 2. Window Focus (Alt-Tab / Click outside)
window.addEventListener('blur', () => {
    checkState('event:blur');
});

window.addEventListener('focus', () => {
    checkState('event:focus');
});

// 3. Key Logging
document.addEventListener('keydown', (e) => {
    if (!isMonitoring) return;

    // Log to Key Log
    let displayKey = e.key;
    if (e.key === ' ') displayKey = 'Space';

    const div = document.createElement('div');
    div.className = 'log-entry key';
    div.innerHTML = `<span class="time">${getTimestamp()}</span> <span class="msg">Key: <strong>${displayKey}</strong></span>`;
    keyLogContainer.insertBefore(div, keyLogContainer.firstChild);

    // Detect suspicious keys for System Log
    if (e.key === 'PrintScreen') {
        addLog(systemLogContainer, `スクリーンショット試行 (PrintScreen)`, 'alert');
    }

    if (e.altKey && e.key === 'Tab') {
        addLog(systemLogContainer, 'Alt-Tab 操作検知', 'alert');
    }

    if (e.key === 'F12') {
        addLog(systemLogContainer, '開発者ツール起動試行 (F12)', 'alert');
    }
});

// --- Controls ---

startBtn.addEventListener('click', () => {
    // Initialize Timer Variables
    isMonitoring = true;
    startTime = Date.now();
    activeSince = startTime;
    totalActiveTime = 0;
    lastState = true; // Assume active on start

    // UI Reset
    startBtn.disabled = true;
    stopBtn.disabled = false;
    focusLostCount = 0;
    focusLostCountEl.textContent = '0';

    // Clear Logs (Optional - keeping history might be better, but let's clear for a fresh run)
    // systemLogContainer.innerHTML = ''; 
    // focusHistoryContainer.innerHTML = '';
    // keyLogContainer.innerHTML = '';

    addLog(systemLogContainer, '監視を開始しました');
    updateStatusUI(true);
    checkState('start');
});

stopBtn.addEventListener('click', () => {
    isMonitoring = false;

    // Finalize time calculation
    const now = Date.now();
    if (lastState && activeSince > 0) {
        totalActiveTime += (now - activeSince);
    }

    startBtn.disabled = false;
    stopBtn.disabled = true;

    addLog(systemLogContainer, '監視を停止しました');
    statusIndicator.textContent = 'STOPPED';
    statusIndicator.className = 'status-badge';
});
