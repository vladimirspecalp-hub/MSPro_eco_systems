// TODO: Реализовать модуль после подключения Supabase и API.

export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: 'HTML' | 'Markdown';
}

export async function sendTelegramNotification(message: TelegramMessage): Promise<boolean> {
  console.log('Telegram notification (stub):', message);
  return false;
}

export async function sendLeadNotification(leadData: any): Promise<boolean> {
  const message: TelegramMessage = {
    chatId: process.env.TELEGRAM_CHAT_ID || '',
    text: `
🆕 Новая заявка!
Имя: ${leadData.name}
Телефон: ${leadData.phone}
Услуга: ${leadData.service}
    `.trim(),
    parseMode: 'HTML'
  };
  
  return sendTelegramNotification(message);
}
