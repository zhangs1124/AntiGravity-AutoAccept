// daemon.js (UTF-8 BOM)
const { ConnectionManager } = require('./src/cdp/ConnectionManager');
const WebSocket = require('ws'); // ⚡ 強迫 pkg 打包 WebSocket 模組
const fs = require('fs');
const path = require('path');

// 讀取 settings.json 中的自訂按鈕
function getCustomTexts() {
    try {
        const settingsPath = path.join(process.env.APPDATA, 'Antigravity IDE', 'User', 'settings.json');
        if (fs.existsSync(settingsPath)) {
            const raw = fs.readFileSync(settingsPath, 'utf8').replace(/^\uFEFF/, '');
            const settings = JSON.parse(raw);
            return settings['autoAcceptV2.customButtonTexts'] || [];
        }
    } catch (e) {
        console.error('讀取 settings.json 失敗:', e.message);
    }
    return [];
}

// 實作與 VS Code 解耦的 ConnectionManager
const manager = new ConnectionManager({
    log: (msg) => {
        console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
    },
    getPort: () => 9333, // 預設 Port，ConnectionManager 會自動掃描 9333 與 9222
    getCustomTexts: getCustomTexts,
    getLastUserActivity: () => Date.now() - 60000 // 假設目前無用戶活動衝突，讓背景可隨時點擊
});

console.log('🚀 AutoAccept 獨立背景服務啟動中 (同時監控 IDE: 9333 與 2.0: 9222)...');
manager.start();

// 監聽結束信號
process.on('SIGINT', () => {
    manager.stop();
    console.log('👋 服務已停止。');
    process.exit();
});
