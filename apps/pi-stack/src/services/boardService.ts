// import { Board } from "../models/board";
// import { GoogleSheetsService } from "./googleSheetsService";
// import { io } from "../app";

// export class BoardService {
//   private googleSheetsService: GoogleSheetsService;

//   constructor() {
//     this.googleSheetsService = new GoogleSheetsService();
//   }

//   async getJobStats(): Promise<{ totalLength: number; averageLength: number }> {
//     const [totalLength, averageLength] =
//       await this.googleSheetsService.getJobStats();
//     return { totalLength, averageLength };
//   }

//   async addBoard(board: Board): Promise<void> {
//     await this.googleSheetsService.addBoard(board);
//     const [totalLength, averageLength] =
//       await this.googleSheetsService.getJobStats();
//     io.emit("data", {
//       ...board,
//       totalLength,
//       averageLength: Number(averageLength).toFixed(2),
//     });
//   }

//   async removeBoard(id: string): Promise<void> {
//     await this.googleSheetsService.removeBoard(id);
//     // const [totalLength, averageLength] =
//     //   await this.googleSheetsService.getJobStats();
//     // io.emit("data", {
//     //   totalLength,
//     //   averageLength: Number(averageLength).toFixed(2),
//     // });
//   }

//   async archiveBoard(id: string): Promise<void> {
//     await this.googleSheetsService.updateBoard(id, { status: "B" });
//     const [totalLength, averageLength] =
//       await this.googleSheetsService.getJobStats();
//     io.emit("data", {
//       totalLength,
//       averageLength: Number(averageLength).toFixed(2),
//     });
//   }
// }
