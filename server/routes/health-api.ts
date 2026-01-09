/**
 * Health Check API — Мониторинг состояния системы
 * @module server/routes/health-api
 */

import { Router } from 'express';
import { getPages, getSEOStats } from '../services/seo-service';
import { getAllRegions } from '../middleware/geo-context';
import { getAllExperiments, getCROMetrics } from '../services/ux-personalization';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: Record<string, ServiceHealth>;
  summary: HealthSummary;
}

interface ServiceHealth {
  status: 'ok' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
}

interface HealthSummary {
  totalServices: number;
  healthyServices: number;
  warnings: number;
  errors: number;
}

const startTime = Date.now();

/**
 * GET /api/health
 * Полная проверка здоровья системы
 */
router.get('/', async (req, res) => {
  const services: Record<string, ServiceHealth> = {};

  services.seo = await checkSEOService();
  services.geo = checkGEOService();
  services.aeo = checkAEOService();
  services.ux = checkUXService();
  services.database = await checkDatabaseService();

  const summary = calculateSummary(services);
  const overallStatus = determineOverallStatus(summary);

  const health: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    services,
    summary,
  };

  const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
  res.status(httpStatus).json(health);
});

/**
 * GET /api/health/live
 * Быстрая проверка (для k8s liveness probe)
 */
router.get('/live', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

/**
 * GET /api/health/ready
 * Проверка готовности (для k8s readiness probe)
 */
router.get('/ready', async (req, res) => {
  try {
    const stats = getSEOStats();
    const isReady = stats.totalPages > 0;
    
    if (isReady) {
      res.json({ status: 'ready', seoPages: stats.totalPages });
    } else {
      res.status(503).json({ status: 'not_ready', reason: 'SEO data not loaded' });
    }
  } catch (error) {
    res.status(503).json({ status: 'not_ready', error: 'Service check failed' });
  }
});

/**
 * GET /api/health/api-status
 * Сводный статус всех API endpoints
 */
router.get('/api-status', (req, res) => {
  const apis = [
    { name: 'SEO API', base: '/api/seo', endpoints: ['pages', 'page/:slug', 'search', 'stats', 'related/:slug', 'cache/invalidate'] },
    { name: 'GEO API', base: '/api/geo', endpoints: ['context', 'regions', 'region/:code', 'localize'] },
    { name: 'AEO API', base: '/api/aeo', endpoints: ['generate', 'schema/:type', 'validate', 'quality-gates'] },
    { name: 'UX API', base: '/api/ux', endpoints: ['profile', 'experiments', 'experiment/assign', 'track', 'personalize', 'metrics'] },
    { name: 'Health API', base: '/api/health', endpoints: ['/', 'live', 'ready', 'api-status'] },
    { name: 'Legacy API', base: '/api', endpoints: ['leads', 'calculations', 'ai_seo'] },
  ];

  const totalEndpoints = apis.reduce((sum, api) => sum + api.endpoints.length, 0);

  res.json({
    version: '3.0.0',
    totalApis: apis.length,
    totalEndpoints,
    apis: apis.map(api => ({
      ...api,
      endpointCount: api.endpoints.length,
      fullPaths: api.endpoints.map(ep => `${api.base}/${ep}`.replace(/\/+/g, '/')),
    })),
  });
});

async function checkSEOService(): Promise<ServiceHealth> {
  try {
    const stats = getSEOStats();
    
    if (stats.totalPages === 0) {
      return { status: 'warning', message: 'No SEO pages loaded', details: stats };
    }
    
    return { 
      status: 'ok', 
      message: `${stats.totalPages} pages loaded`,
      details: { pageCount: stats.totalPages, ...stats }
    };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}

function checkGEOService(): ServiceHealth {
  try {
    const regions = getAllRegions();
    return { 
      status: 'ok', 
      message: `${regions.length} regions configured`,
      details: { regionCount: regions.length }
    };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}

function checkAEOService(): ServiceHealth {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  
  if (!hasOpenAI) {
    return { 
      status: 'warning', 
      message: 'OpenAI API key not configured, using fallback FAQ',
      details: { aiEnabled: false }
    };
  }
  
  return { 
    status: 'ok', 
    message: 'AI generation enabled',
    details: { aiEnabled: true, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' }
  };
}

function checkUXService(): ServiceHealth {
  try {
    const experiments = getAllExperiments();
    const metrics = getCROMetrics();
    
    return { 
      status: 'ok', 
      message: `${experiments.length} experiments active`,
      details: { 
        experimentCount: experiments.length,
        totalSessions: metrics.totalSessions,
        totalEvents: metrics.totalEvents
      }
    };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
}

async function checkDatabaseService(): Promise<ServiceHealth> {
  const hasDbUrl = !!process.env.DATABASE_URL;
  
  if (!hasDbUrl) {
    return { 
      status: 'warning', 
      message: 'DATABASE_URL not configured',
      details: { connected: false }
    };
  }
  
  return { 
    status: 'ok', 
    message: 'Database URL configured',
    details: { connected: true }
  };
}

function calculateSummary(services: Record<string, ServiceHealth>): HealthSummary {
  const values = Object.values(services);
  return {
    totalServices: values.length,
    healthyServices: values.filter(s => s.status === 'ok').length,
    warnings: values.filter(s => s.status === 'warning').length,
    errors: values.filter(s => s.status === 'error').length,
  };
}

function determineOverallStatus(summary: HealthSummary): 'healthy' | 'degraded' | 'unhealthy' {
  if (summary.errors > 0) return 'unhealthy';
  if (summary.warnings > 0) return 'degraded';
  return 'healthy';
}

export default router;
