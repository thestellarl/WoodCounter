import { Board } from "../models/board";
import { GoogleSheetsService } from "./googleSheetsService";
import { SerialService } from "./serialService";
import { roundingAccuracy, boardLengthOffset } from "../config/settings";
import { io } from "../app";

export class BoardService {
  private googleSheetsService: GoogleSheetsService;
  private serialService: SerialService;

  constructor() {
    this.googleSheetsService = new GoogleSheetsService();
    this.serialService = new SerialService();
  }

  async getJobStats(): Promise<{ totalLength: number; averageLength: number }> {
    const [totalLength, averageLength] =
      await this.googleSheetsService.getJobStats();
    return { totalLength, averageLength };
  }

  async addBoard(board: Board): Promise<void> {
    await this.googleSheetsService.addBoard(board);
    const [totalLength, averageLength] =
      await this.googleSheetsService.getJobStats();
    io.emit("data", {
      ...board,
      totalLength,
      averageLength: Number(averageLength).toFixed(2),
    });
  }

  async removeBoard(id: string): Promise<void> {
    await this.googleSheetsService.updateBoard(id, { length: "" });
    const [totalLength, averageLength] =
      await this.googleSheetsService.getJobStats();
    io.emit("data", {
      totalLength,
      averageLength: Number(averageLength).toFixed(2),
    });
  }

  async archiveBoard(id: string): Promise<void> {
    await this.googleSheetsService.updateBoard(id, { status: "B" });
    const [totalLength, averageLength] =
      await this.googleSheetsService.getJobStats();
    io.emit("data", {
      totalLength,
      averageLength: Number(averageLength).toFixed(2),
    });
  }

  async processSerialData(data: Buffer): Promise<void> {
    const packetStart = data.indexOf("\x02");
    if (packetStart === -1) return;

    const hexString = data.slice(packetStart + 1, -1).toString("utf8");
    const hexFlipped = hexString.match(/.{2}/g)?.reverse().join("") || "";

    if (hexFlipped.length !== 108) return;

    const boardNum = parseInt(hexFlipped.slice(-8), 16);
    const boardLen = parseInt(hexFlipped.slice(0, 8), 16);
    const length =
      Math.round((boardLen / 100 - boardLengthOffset) / roundingAccuracy) *
      roundingAccuracy;

    const board: Board = {
      id: this.serialService.generateUniqueId(),
      length,
      status: "A",
    };

    await this.addBoard(board);
  }
}
