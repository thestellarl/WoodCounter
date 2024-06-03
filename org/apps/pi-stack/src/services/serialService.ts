import { SerialPort } from 'serialport';
import { v4 as uuidv4 } from 'uuid';
import { getSettings } from '../config/settings';
import { Board } from '../models/board';

export class SerialService {
  // private port: SerialPort;

  constructor() {
    // this.port = new SerialPort({
    //   path: "/dev/ttyUSB0",
    //   baudRate: 9600,
    //   dataBits: 7,
    //   stopBits: 1,
    //   parity: "even",
    //   rtscts: true,
    // });
    console.log('SerialService initialized');
  }

  onBoard(callback: (board: Board) => Promise<void>): void {
    // this.port.on("data", (buffer) =>
    //   this.processSerialData(buffer).then(callback).catch(console.log)
    // );
  }

  generateUniqueId(): string {
    return uuidv4();
  }

  async processSerialData(data: Buffer): Promise<Board> {
    const { boardLengthOffset, roundingAccuracy } = await getSettings();
    const packetStart = data.indexOf('\x02');
    if (packetStart === -1) return Promise.reject();

    const hexString = data.slice(packetStart + 1, -1).toString('utf8');
    const hexFlipped = hexString.match(/.{2}/g)?.reverse().join('') || '';

    if (hexFlipped.length !== 108) return Promise.reject();

    const boardNum = parseInt(hexFlipped.slice(-8), 16);
    const boardLen = parseInt(hexFlipped.slice(0, 8), 16);
    const length =
      Math.round((boardLen / 100 - boardLengthOffset) / roundingAccuracy) *
      roundingAccuracy;

    return {
      id: uuidv4(),
      length,
      status: 'A',
    };
  }
}
