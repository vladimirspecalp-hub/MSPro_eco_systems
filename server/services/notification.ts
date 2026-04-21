
import { InsertLead } from "@shared/schema";
import TelegramBot from 'node-telegram-bot-api';
import { createReadStream } from 'fs';
import { resolve } from 'path';
import nodemailer from 'nodemailer';

// Load bot only if token exists
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_ADMIN_ID = process.env.TELEGRAM_ADMIN_ID;

const bot = TELEGRAM_TOKEN ? new TelegramBot(TELEGRAM_TOKEN, {
    polling: false,
    request: {
        timeout: 10000 // 10 seconds timeout
    } as any
}) : null;

// Email setup
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

const mailer = (SMTP_HOST && SMTP_USER && SMTP_PASS) ? nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
}) : null;

// Helper to prevent hanging promises
const withTimeout = <T>(promise: Promise<T>, ms: number = 10000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Telegram operation timed out after ${ms}ms`)), ms)
        )
    ]);
};

export async function sendLeadNotification(lead: InsertLead, files: Express.Multer.File[] = []) {
    if (!bot || !TELEGRAM_ADMIN_ID) {
        console.warn('Telegram bot not configured, skipping notification');
        return;
    }

    const message = `
<b>🔔 Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${lead.name}
📞 <b>Телефон:</b> ${lead.phone}
📧 <b>Email:</b> ${lead.email || 'Не указан'}
🛠 <b>Услуга:</b> ${lead.serviceType}
📝 <b>Сообщение:</b>
${lead.message || 'Нет сообщения'}

🔗 <b>Источник:</b> ${lead.source || 'Сайт'}
    `.trim();

    try {
        // 1. Send Text
        await withTimeout(bot.sendMessage(TELEGRAM_ADMIN_ID, message, { parse_mode: 'HTML' }));
        console.log('[Notification] Text sent successfully');

        // 2. Send Files (Seqentially to preserve order/simplicity)
        if (files.length > 0) {
            for (const file of files) {
                const filePath = resolve(process.cwd(), 'uploads', file.filename);
                // Simple regex for images
                const validImage = /\.(jpg|jpeg|png|webp|heic)$/i.test(file.originalname);

                try {
                    console.log(`[Notification] Sending file: ${file.originalname}`);
                    if (validImage) {
                        await withTimeout(bot.sendPhoto(TELEGRAM_ADMIN_ID, createReadStream(filePath), {
                            caption: `📄 ${file.originalname}`
                        }));
                    } else {
                        await withTimeout(bot.sendDocument(TELEGRAM_ADMIN_ID, createReadStream(filePath), {
                            caption: `📄 ${file.originalname}`
                        }));
                    }
                    console.log(`[Notification] File sent: ${file.originalname}`);
                } catch (err) {
                    console.error(`[Notification] Failed to send file to telegram: ${file.originalname}`, err);
                    // Don't throw, just log
                }
            }
        }
    } catch (error) {
        console.error('[Notification] Global error sending telegram notification:', error);
    }

    // 3. Send Email
    if (mailer && NOTIFICATION_EMAIL) {
        try {
            const subject = `Новая заявка: ${lead.serviceType} от ${lead.name}`;
            const text = `
Имя: ${lead.name}
Телефон: ${lead.phone}
Email: ${lead.email || 'Не указан'}
Услуга: ${lead.serviceType}
Сообщение:
${lead.message || 'Нет сообщения'}

Источник: ${lead.source || 'Сайт'}
            `.trim();

            const mailOptions = {
                from: `"MSPRO Notification" <${SMTP_USER}>`,
                to: NOTIFICATION_EMAIL,
                subject: subject,
                text: text,
                attachments: files.map(file => ({
                    filename: file.originalname,
                    path: resolve(process.cwd(), 'uploads', file.filename)
                }))
            };

            await mailer.sendMail(mailOptions);
            console.log('[Notification] Email sent successfully');
        } catch (mailError) {
            console.error('[Notification] Failed to send email:', mailError);
        }
    } else {
        console.warn('[Notification] Mailer not configured, skipping email');
    }
}
