import nodemailer from 'nodemailer';
import TelegramBot from 'node-telegram-bot-api';
import { Lead, InsertLead } from '@shared/schema';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { createReadStream } from 'fs';

dotenv.config();

// Configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.yandex.ru';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_ID = process.env.TELEGRAM_CHAT_ID;

// Initialize Transporter
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true, // true for 465, false for others
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

// Initialize Telegram Bot
const bot = TELEGRAM_TOKEN ? new TelegramBot(TELEGRAM_TOKEN, { polling: false }) : null;

// Helper Interface for files (matching Multer)
interface UploadedFile {
    filename: string;
    originalname: string;
    path: string;
    mimetype: string;
}

export const notificationService = {
    async sendLeadNotification(lead: Lead | InsertLead, files: UploadedFile[] = []) {
        // Use 'PENDING' if ID is not available (InsertLead)
        const leadId = 'id' in lead ? lead.id : 'PENDING';

        console.log(`[Notification] Processing lead: ${leadId}`);
        console.log(`[Notification] DEBUG Credentials: Token=${TELEGRAM_TOKEN ? 'Set' : 'Missing'}, ChatID=${TELEGRAM_ADMIN_ID}, EmailAdmin=${EMAIL_ADMIN}`);
        console.log(`[Notification] Attachments count: ${files.length}`);

        // 1. Send Email to Client (The "Person") - No attachments usually
        if (lead.email && SMTP_USER && SMTP_PASS) {
            try {
                sendClientEmail(lead, leadId).catch(e => console.error(`[Notification] Client Email failed:`, e));
            } catch (error) {
                console.error(`[Notification] Failed to send email:`, error);
            }
        } else {
            console.warn("[Notification] Skipped Client Email: Missing credits or lead email");
        }

        // 2. Send Telegram to Admin
        if (TELEGRAM_TOKEN && TELEGRAM_ADMIN_ID) {
            try {
                await sendAdminTelegram(lead, leadId, files);
                console.log(`[Notification] Telegram sent to admin`);
            } catch (error) {
                console.error(`[Notification] Failed to send telegram:`, error);
            }
        } else {
            console.warn("[Notification] Skipped Telegram: Missing token or chat_id");
        }

        // 3. Send Email to Admin (Backup/Record) - WITH Attachments
        if (EMAIL_ADMIN && SMTP_USER && SMTP_PASS) {
            try {
                await sendAdminEmail(lead, leadId, files);
                console.log(`[Notification] Email sent to admin: ${EMAIL_ADMIN}`);
            } catch (error) {
                console.error(`[Notification] Failed to send admin email:`, error);
            }
        }
    }
};

async function sendClientEmail(lead: Lead | InsertLead, leadId: string) {
    const isCalculation = lead.message?.includes('Предварительный расчет');

    let htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F172A;">Здравствуйте, ${lead.name}!</h2>
      <p>Спасибо за вашу заявку на сайте MSPRO. Мы получили ваш запрос и свяжемся с вами в ближайшее время.</p>
  `;

    if (isCalculation && lead.message) {
        // Format the calculation details from the text message
        // Message format: "Key: Value\nKey: Value"
        const lines = lead.message.split('\n').filter(l => l.trim());

        htmlContent += `
      <div style="background-color: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #334155;">Ваш предварительный расчет:</h3>
        <table style="width: 100%; border-collapse: collapse;">
    `;

        lines.forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                htmlContent += `
          <tr>
            <td style="padding: 8px 0; color: #64748B; width: 40%;">${key}</td>
            <td style="padding: 8px 0; color: #0F172A; font-weight: 500;">${value}</td>
          </tr>
        `;
            } else {
                htmlContent += `<p>${line}</p>`;
            }
        });

        htmlContent += `
        </table>
      </div>
      <p style="font-size: 12px; color: #94A3B8;">* Расчет является предварительным. Точная смета после осмотра.</p>
    `;
    } else if (lead.message) {
        htmlContent += `
        <div style="background-color: #F8FAFC; padding: 15px; border-radius: 8px;">
            <p><strong>Ваше сообщение:</strong><br/>${lead.message}</p>
        </div>
      `;
    }

    htmlContent += `
      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
      <p style="color: #64748B; font-size: 14px;">
        С уважением,<br/>
        Команда MSPRO<br/>
        <a href="https://mspro-ltd.ru" style="color: #0F172A;">mspro-ltd.ru</a>
      </p>
    </div>
  `;

    await transporter.sendMail({
        from: `"MSPRO Robot" <${EMAIL_FROM}>`,
        to: lead.email,
        subject: `Ваша заявка на сайте MSPRO (ID: ${leadId.slice(0, 8)})`,
        html: htmlContent,
    });
}

async function sendAdminEmail(lead: Lead | InsertLead, leadId: string, files: UploadedFile[]) {
    if (!EMAIL_ADMIN) return;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F172A;">🔔 Новая заявка!</h2>
      
      <div style="background-color: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Имя:</strong> ${lead.name}</p>
        <p><strong>Телефон:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
        <p><strong>Услуга:</strong> ${lead.serviceType}</p>
        <p><strong>Источник:</strong> ${lead.source || "Сайт"}</p>
        <p><strong>ID:</strong> ${leadId}</p>
      </div>

      <h3 style="color: #334155;">Сообщение:</h3>
      <div style="border-left: 4px solid #3B82F6; padding-left: 15px; margin-top: 10px;">
        <p style="white-space: pre-wrap;">${lead.message || "Нет сообщения"}</p>
      </div>

      <p style="font-size: 12px; color: #94A3B8; margin-top: 30px;">
        ${files.length > 0 ? `🖇 <strong>Прикреплено файлов:</strong> ${files.length}` : 'Без вложений'}
      </p>
    </div>
    `;

    // Map files to Nodemailer attachment format
    const attachments = files.map(file => ({
        filename: file.originalname,
        path: resolve(process.cwd(), 'uploads', file.filename)
    }));

    await transporter.sendMail({
        from: `"MSPRO Notifier" <${EMAIL_FROM}>`,
        to: EMAIL_ADMIN,
        subject: `🔔 Новая заявка: ${lead.name} (${lead.serviceType})`,
        html: htmlContent,
        attachments: attachments
    });
}

async function sendAdminTelegram(lead: Lead | InsertLead, leadId: string, files: UploadedFile[]) {
    if (!bot || !TELEGRAM_ADMIN_ID) return;

    const message = `
🔔 <b>Новая заявка!</b>

👤 <b>Имя:</b> ${lead.name}
📞 <b>Телефон:</b> ${lead.phone}
📧 <b>Email:</b> ${lead.email}
🔧 <b>Услуга:</b> ${lead.serviceType}

📝 <b>Сообщение / Расчет:</b>
${lead.message || "Нет сообщения"}

🔗 <b>Источник:</b> ${lead.source || "Сайт"}
🆔 <b>ID:</b> ${leadId}
${files.length > 0 ? `\n🖇 <b>Прикреплено файлов:</b> ${files.length}` : ''}
    `.trim();

    // 1. Send Text
    await bot.sendMessage(TELEGRAM_ADMIN_ID, message, { parse_mode: 'HTML' });

    // 2. Send Files (Seqentially to preserve order/simplicity)
    if (files.length > 0) {
        for (const file of files) {
            const filePath = resolve(process.cwd(), 'uploads', file.filename);
            const validImage = /\.(jpg|jpeg|png|webp)$/i.test(file.originalname);

            try {
                if (validImage) {
                    await bot.sendPhoto(TELEGRAM_ADMIN_ID, createReadStream(filePath), {
                        caption: `📄 ${file.originalname}`
                    });
                } else {
                    await bot.sendDocument(TELEGRAM_ADMIN_ID, createReadStream(filePath), {
                        caption: `📄 ${file.originalname}`
                    });
                }
            } catch (err) {
                console.error(`[Notification] Failed to send file to telegram: ${file.originalname}`, err);
            }
        }
    }
}

