import { SerialPort } from "serialport";
import { v4 as uuidv4 } from "uuid";
import { serialConfig } from "../config/serialConfig";

export class SerialService {
  private port: SerialPort;

  constructor() {
    this.port = new SerialPort(serialConfig.path, {
      baudRate: serialConfig.baudRate,
      dataBits: serialConfig.dataBits,
      stopBits: serialConfig.stopBits,
      parity: serialConfig.parity as "even",
      rtscts: serialConfig.rtscts,
      dsrdtr: serialConfig.dsrdtr,
    });
  }

  onData(callback: (data: Buffer) => void): void {
    this.port.on("data", callback);
  }

  generateUniqueId(): string {
    return uuidv4();
  }
}
