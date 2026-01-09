interface Alert {
  id: string;
  type: 'seo' | 'aeo' | 'geo' | 'ai' | 'eco' | 'eeat' | 'ux' | 'cro';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  metric?: string;
  currentValue?: number;
  threshold?: number;
}

const alertsQueue: Alert[] = [];

export function createAlert(
  type: Alert['type'],
  severity: Alert['severity'],
  message: string,
  metric?: string,
  currentValue?: number,
  threshold?: number
): Alert {
  const alert: Alert = {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    message,
    timestamp: new Date().toISOString(),
    metric,
    currentValue,
    threshold,
  };

  alertsQueue.push(alert);
  
  if (severity === 'critical') {
    sendTelegramNotification(alert);
    logToSupabase(alert);
  }

  return alert;
}

async function sendTelegramNotification(alert: Alert): Promise<boolean> {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramBotToken || !telegramChatId) {
    console.log('[Alerts] Telegram not configured, skipping notification');
    return false;
  }

  const message = formatTelegramMessage(alert);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('[Alerts] Failed to send Telegram notification:', error);
    return false;
  }
}

function formatTelegramMessage(alert: Alert): string {
  const severityEmoji = {
    info: 'ℹ️',
    warning: '⚠️',
    critical: '🚨',
  };

  let message = `${severityEmoji[alert.severity]} <b>MSPRO Alert</b>\n\n`;
  message += `<b>Type:</b> ${alert.type.toUpperCase()}\n`;
  message += `<b>Severity:</b> ${alert.severity}\n`;
  message += `<b>Message:</b> ${alert.message}\n`;
  
  if (alert.metric) {
    message += `<b>Metric:</b> ${alert.metric}\n`;
  }
  
  if (alert.currentValue !== undefined && alert.threshold !== undefined) {
    message += `<b>Current:</b> ${alert.currentValue} (threshold: ${alert.threshold})\n`;
  }
  
  message += `\n📊 <b>Timestamp:</b> ${alert.timestamp}`;

  return message;
}

async function logToSupabase(alert: Alert): Promise<boolean> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('[Alerts] Supabase not configured, skipping log');
    return false;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        metric: alert.metric,
        current_value: alert.currentValue,
        threshold: alert.threshold,
        created_at: alert.timestamp,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('[Alerts] Failed to log to Supabase:', error);
    return false;
  }
}

export function getRecentAlerts(limit: number = 10): Alert[] {
  return alertsQueue.slice(-limit);
}

export function getAlertsByType(type: Alert['type']): Alert[] {
  return alertsQueue.filter(a => a.type === type);
}

export function getCriticalAlerts(): Alert[] {
  return alertsQueue.filter(a => a.severity === 'critical');
}

export function clearAlerts(): void {
  alertsQueue.length = 0;
}

export function processOptimizationAlerts(alerts: string[]): void {
  for (const alertMessage of alerts) {
    const type = detectAlertType(alertMessage);
    createAlert(type, 'critical', alertMessage);
  }
}

function detectAlertType(message: string): Alert['type'] {
  if (message.includes('SEO')) return 'seo';
  if (message.includes('AEO') || message.includes('JSON-LD')) return 'aeo';
  if (message.includes('GEO') || message.includes('Regional')) return 'geo';
  if (message.includes('AI') || message.includes('generation')) return 'ai';
  if (message.includes('Performance') || message.includes('Lighthouse')) return 'eco';
  if (message.includes('E-E-A-T') || message.includes('Trust')) return 'eeat';
  if (message.includes('UX') || message.includes('Session')) return 'ux';
  return 'cro';
}
