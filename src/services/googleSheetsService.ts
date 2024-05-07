import { GoogleSpreadsheet } from "google-spreadsheet";
import { Board } from "../models/board";

export class GoogleSheetsService {
  private doc: GoogleSpreadsheet;

  constructor() {
    this.doc = new GoogleSpreadsheet("End Matcher Board Counter");
  }

  async authenticate(): Promise<void> {
    await this.doc.useServiceAccountAuth(require("../../credentials.json"));
    await this.doc.loadInfo();
  }

  async getJobStats(): Promise<[number, number]> {
    await this.authenticate();
    const sheet = this.doc.sheetsByIndex[0];
    const [[totalLength], [averageLength]] = await sheet.getCellsInRange(
      "E2:E3"
    );
    return [totalLength.value as number, averageLength.value as number];
  }

  async addBoard(board: Board): Promise<void> {
    await this.authenticate();
    const sheet = this.doc.sheetsByIndex[1];
    await sheet.addRow([board.id, board.length, board.status]);
  }

  async updateBoard(id: string, update: Partial<Board>): Promise<void> {
    await this.authenticate();
    const sheet = this.doc.sheetsByIndex[1];
    const rows = await sheet.getRows();
    const row = rows.find((r) => r[0] === id);
    if (!row) return;
    Object.assign(row, update);
    await row.save();
  }
}
