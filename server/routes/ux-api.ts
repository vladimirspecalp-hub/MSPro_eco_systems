/**
 * UX Personalization API Routes
 * @module server/routes/ux-api
 */

import { Router } from 'express';
import { z } from 'zod';
import {
  getOrCreateProfile,
  assignExperimentVariant,
  trackEvent,
  getPersonalizedContent,
  getAllExperiments,
  getExperimentById,
  upsertExperiment,
  getCROMetrics,
  clearOldData,
  BehaviorEventSchema,
  ExperimentSchema,
} from '../services/ux-personalization';

const router = Router();

/**
 * GET /api/ux/profile
 * Получает или создаёт профиль пользователя
 * 
 * Query:
 * - sessionId: string (обязательный)
 * - region: string (опционально)
 */
router.get('/profile', (req, res) => {
  const { sessionId, region } = req.query;
  
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const profile = getOrCreateProfile(sessionId, region as string);
  res.json(profile);
});

/**
 * POST /api/ux/experiment/assign
 * Назначает вариант эксперимента пользователю
 * 
 * Body:
 * - sessionId: string
 * - experimentId: string
 */
router.post('/experiment/assign', (req, res) => {
  const { sessionId, experimentId } = req.body;
  
  if (!sessionId || !experimentId) {
    return res.status(400).json({ error: 'sessionId and experimentId are required' });
  }

  const result = assignExperimentVariant(sessionId, experimentId);
  
  if (!result) {
    return res.status(404).json({ error: 'Experiment not found or inactive' });
  }

  res.json(result);
});

/**
 * GET /api/ux/experiments
 * Получает список всех экспериментов
 */
router.get('/experiments', (req, res) => {
  const experiments = getAllExperiments();
  res.json({
    count: experiments.length,
    experiments,
  });
});

/**
 * GET /api/ux/experiments/:id
 * Получает эксперимент по ID
 */
router.get('/experiments/:id', (req, res) => {
  const experiment = getExperimentById(req.params.id);
  
  if (!experiment) {
    return res.status(404).json({ error: 'Experiment not found' });
  }

  res.json(experiment);
});

/**
 * POST /api/ux/experiments
 * Создаёт или обновляет эксперимент
 * 
 * Body: Experiment object
 */
router.post('/experiments', (req, res) => {
  try {
    const experiment = upsertExperiment(req.body);
    res.json(experiment);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ux/track
 * Записывает поведенческое событие
 * 
 * Body: BehaviorEvent object
 */
router.post('/track', (req, res) => {
  try {
    trackEvent(req.body);
    res.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ux/personalize
 * Получает персонализированный контент
 * 
 * Query:
 * - sessionId: string
 */
router.get('/personalize', (req, res) => {
  const { sessionId } = req.query;
  
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const content = getPersonalizedContent(sessionId);
  res.json(content);
});

/**
 * GET /api/ux/metrics
 * Получает CRO метрики
 */
router.get('/metrics', (req, res) => {
  const metrics = getCROMetrics();
  res.json(metrics);
});

/**
 * POST /api/ux/cleanup
 * Очищает устаревшие данные (GDPR)
 * 
 * Body:
 * - daysOld: number (default: 30)
 */
router.post('/cleanup', (req, res) => {
  const { daysOld = 30 } = req.body;
  const cleared = clearOldData(daysOld);
  res.json({
    message: `Cleared ${cleared} old profiles`,
    daysOld,
  });
});

export default router;
