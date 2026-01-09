// TODO: Реализовать модуль после подключения Supabase и API.

import type { Request, Response } from 'express';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

export async function sendMessage(message: TelegramMessage): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log('Telegram bot token not configured');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      }
    );

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

export async function sendLeadNotification(leadData: any): Promise<boolean> {
  if (!TELEGRAM_CHAT_ID) {
    console.log('Telegram chat ID not configured');
    return false;
  }

  const message: TelegramMessage = {
    chat_id: TELEGRAM_CHAT_ID,
    text: `
🆕 <b>Новая заявка!</b>

👤 Имя: ${leadData.name}
📞 Телефон: ${leadData.phone}
${leadData.email ? `📧 Email: ${leadData.email}` : ''}
🔧 Услуга: ${leadData.service}
${leadData.message ? `💬 Сообщение: ${leadData.message}` : ''}
    `.trim(),
    parse_mode: 'HTML',
  };

  return sendMessage(message);
}

export async function handleWebhook(req: Request, res: Response) {
  try {
    const update = req.body;
    console.log('Telegram webhook received (stub):', update);

    // TODO: Обработать входящие сообщения из Telegram
    // TODO: Сохранить сообщение в Supabase
    // TODO: Отправить ответ пользователю

    res.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
