import { Request, Response } from "express";
import { BoardService } from "../services/boardService";

export class BoardController {
  private boardService: BoardService;

  constructor() {
    this.boardService = new BoardService();
  }

  async getJobStats(req: Request, res: Response): Promise<void> {
    try {
      const jobStats = await this.boardService.getJobStats();
      res.json(jobStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get job stats" });
    }
  }

  async removeBoard(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.boardService.removeBoard(id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Failed to remove board" });
    }
  }

  async archiveBoard(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.boardService.archiveBoard(id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Failed to archive board" });
    }
  }
}
