import { Board } from '../models/board';
// import { authenticate } from '@google-cloud/local-auth';
// import { Request } from 'express';
import { google } from 'googleapis';
import OAuth2Client from 'googleapis';

export class GoogleService {
  doc: any = null;
  authClient: null | OAuth2Client.Common.OAuth2Client = null;
  constructor() {
    console.log('GoogleSheetsService initialized');
  }

  isAuthenticated = (): boolean => {
    // Check if the application has the users access tokens stored
    // return true if the user is authenticated, false otherwise
    return false;
  };

  authCallback = async (code: string) => {
    if (this.authClient) {
      const { tokens } = await this.authClient.getToken(code);
      this.authClient.setCredentials(tokens);
    }
    return Promise.resolve();
  };

  listSheets = async () => {
    const sheets = google.sheets({ version: 'v4', auth: this.authClient });
    const res = await sheets.spreadsheets.get({
      // spreadsheetId: this.spreadsheetId,
    });
    console.log(res.data.sheets);
  };

  async getJobStats(): Promise<[number, number]> {
    const sheet = this.doc.sheetsByIndex[0];
    const [[totalLength], [averageLength]] = await sheet.getCellsInRange(
      'E2:E3'
    );
    return [totalLength.value as number, averageLength.value as number];
  }

  async addBoard(board: Board): Promise<void> {
    const sheet = this.doc.sheetsByIndex[1];
    await sheet.addRow([board.id, board.length, board.status]);
  }

  async removeBoard(boardId: string): Promise<void> {
    throw Error('Method not implemented');
  }

  async updateBoard(id: string, update: Partial<Board>): Promise<void> {
    throw Error('Method not implemented');
    // const sheet = this.doc.sheetsByIndex[1];
    // const rows = await sheet.getRows();
    // const row = rows.find((r) => r[0] === id);
    // if (!row) return;
    // Object.assign(row, update);
    // await row.save();
  }

  async archiveBoard(id: string): Promise<void> {
    throw Error('Method not implemented');
    // await this.updateBoard(id, { status: "B" });
  }
}
