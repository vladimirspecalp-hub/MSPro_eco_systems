import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

console.log('Testing Telegram Bot...');
console.log('Token:', token ? 'Found' : 'Missing');
console.log('Chat ID:', chatId);

if (!token || !chatId) {
    console.error('Missing credentials');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: false });

bot.sendMessage(chatId, '🔔 Test message from MSPRO Local Dev')
    .then(() => {
        console.log('✅ Message sent successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Failed to send message:');
        console.error(err.message);
        if (err.response && err.response.body) {
            console.error('Telegram API response:', err.response.body);
        }
        process.exit(1);
    });
