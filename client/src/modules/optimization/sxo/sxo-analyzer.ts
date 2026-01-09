export interface UserInteraction {
  type: 'scroll' | 'click' | 'hover' | 'focus' | 'blur';
  target: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface ScrollDepth {
  percent: number;
  timestamp: number;
}

export interface SXOSession {
  sessionId: string;
  startTime: number;
  interactions: UserInteraction[];
  scrollDepths: ScrollDepth[];
  pageViews: string[];
}

let currentSession: SXOSession | null = null;

export function initSXOSession(): SXOSession {
  currentSession = {
    sessionId: `sxo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now(),
    interactions: [],
    scrollDepths: [],
    pageViews: [],
  };
  return currentSession;
}

export function getSession(): SXOSession | null {
  return currentSession;
}

export function trackInteraction(interaction: Omit<UserInteraction, 'timestamp'>): void {
  if (!currentSession) initSXOSession();
  
  currentSession!.interactions.push({
    ...interaction,
    timestamp: Date.now(),
  });
}

export function trackScrollDepth(percent: number): void {
  if (!currentSession) initSXOSession();
  
  const lastDepth = currentSession!.scrollDepths[currentSession!.scrollDepths.length - 1];
  if (!lastDepth || percent > lastDepth.percent) {
    currentSession!.scrollDepths.push({
      percent,
      timestamp: Date.now(),
    });
  }
}

export function trackPageView(path: string): void {
  if (!currentSession) initSXOSession();
  currentSession!.pageViews.push(path);
}

export function calculateEngagementScore(): number {
  if (!currentSession) return 0;

  const timeOnPage = (Date.now() - currentSession.startTime) / 1000;
  const maxScroll = Math.max(...currentSession.scrollDepths.map(s => s.percent), 0);
  const interactionCount = currentSession.interactions.length;

  const timeScore = Math.min(timeOnPage / 60, 1) * 30;
  const scrollScore = (maxScroll / 100) * 40;
  const interactionScore = Math.min(interactionCount / 10, 1) * 30;

  return Math.round(timeScore + scrollScore + interactionScore);
}

export function getInteractionHeatmap(): Record<string, number> {
  if (!currentSession) return {};

  const heatmap: Record<string, number> = {};
  for (const interaction of currentSession.interactions) {
    heatmap[interaction.target] = (heatmap[interaction.target] || 0) + 1;
  }
  return heatmap;
}
