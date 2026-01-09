import type { Request, Response } from 'express';
import { insertLeadSchema } from '@shared/schema';
import { storage } from './storage';
import { z } from 'zod';

export async function createLead(req: Request, res: Response) {
  try {
    const validatedData = insertLeadSchema.parse(req.body);
    const lead = await storage.createLead(validatedData);

    res.status(201).json({ success: true, lead });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      console.error('Failed to create lead:', error);
      res.status(500).json({ error: 'Failed to create lead' });
    }
  }
}

export async function getLeads(req: Request, res: Response) {
  try {
    const leads = await storage.getAllLeads();
    res.json({ leads });
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
}

export async function getLead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const lead = await storage.getLead(id);
    
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.json({ lead });
  } catch (error) {
    console.error('Failed to fetch lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
}
