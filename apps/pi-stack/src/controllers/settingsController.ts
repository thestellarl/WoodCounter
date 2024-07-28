import { Request, Response } from 'express';
import * as storage from 'node-persist';

export class SettingsController {
  private readonly STORAGE_KEY = 'settings';

  constructor() {
    storage.init();
  }

  async getSettings(req: Request, res: Response): Promise<void> {
    const settings = (await storage.getItem(this.STORAGE_KEY)) || {
      roundingAccuracy: 0.25,
      boardLengthOffset: 0,
    };
    res.json(settings);
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    const { acc, offset } = req.body;
    const settings = {
      roundingAccuracy: Number(acc),
      boardLengthOffset: Number(offset),
    };
    await storage.setItem(this.STORAGE_KEY, settings);
    res.sendStatus(200);
  }
}
