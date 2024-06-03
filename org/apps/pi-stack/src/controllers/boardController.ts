import { Request, Response } from 'express';
import { GoogleSheetsService } from '../services/googleSheetsService';

export class BoardController {
  private sheetsService: GoogleSheetsService;

  constructor() {
    this.sheetsService = new GoogleSheetsService('');
    console.log('BoardController initialized');
  }

  async getJobStats(req: Request, res: Response): Promise<void> {
    try {
      const jobStats = await this.sheetsService.getJobStats();
      res.json(jobStats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get job stats' });
    }
  }

  async removeBoard(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.sheetsService.removeBoard(id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove board' });
    }
  }

  async archiveBoard(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.sheetsService.archiveBoard(id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Failed to archive board' });
    }
  }
}
