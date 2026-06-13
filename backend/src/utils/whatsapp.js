// backend/src/utils/whatsapp.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// LocalAuth use karne se session save rahega, baar-baar scan nahi karna padega
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './whatsapp-session' }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Crucial for Linux/Render hosting later
    }
});

// Jab QR code generate hoga, terminal me dikhega
client.on('qr', (qr) => {
    console.log('▼ Scan this QR code with your WhatsApp App to link your gateway:');
    qrcode.generate(qr, { small: true });
});

// Jab link ho jayega
client.on('ready', () => {
    console.log('🟢 WhatsApp Gateway is Ready and Connected!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp Authentication failure:', msg);
});

// Initialize client
client.initialize();

module.exports = client;