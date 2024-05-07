import { Request, Response } from "express";
import { roundingAccuracy, boardLengthOffset } from "../config/settings";

export class SettingsController {
  getSettings(req: Request, res: Response): void {
    res.json({ roundingAccuracy, boardLengthOffset });
  }

  updateSettings(req: Request, res: Response): void {
    const { acc, offset } = req.body;
    roundingAccuracy = Number(acc);
    boardLengthOffset = Number(offset);
    res.sendStatus(200);
  }
}
