import { Board } from "../models/board";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

export class GoogleSheetsService {
  doc: any = null;
  constructor(private spreadsheetId: string) {
    this.authenticate();
    console.log("GoogleSheetsService initialized");
  }

  async authenticate(): Promise<void> {
    const auth = await authenticate({
      keyfilePath: "./google-credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    this.doc = await sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });
  }

  async getJobStats(): Promise<[number, number]> {
    const sheet = this.doc.sheetsByIndex[0];
    const [[totalLength], [averageLength]] = await sheet.getCellsInRange(
      "E2:E3"
    );
    return [totalLength.value as number, averageLength.value as number];
  }

  async addBoard(board: Board): Promise<void> {
    const sheet = this.doc.sheetsByIndex[1];
    await sheet.addRow([board.id, board.length, board.status]);
  }

  async removeBoard(boardId: string): Promise<void> {
    throw Error("Method not implemented");
  }

  async updateBoard(id: string, update: Partial<Board>): Promise<void> {
    throw Error("Method not implemented");
    // const sheet = this.doc.sheetsByIndex[1];
    // const rows = await sheet.getRows();
    // const row = rows.find((r) => r[0] === id);
    // if (!row) return;
    // Object.assign(row, update);
    // await row.save();
  }

  async archiveBoard(id: string): Promise<void> {
    throw Error("Method not implemented");
    // await this.updateBoard(id, { status: "B" });
  }
}
