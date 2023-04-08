export interface IDevice {
  id: string;
  name: string;
  ip: string;
  port: number;

  lastState: IDeviceState | null;
}

export interface IDeviceState {
  isConnected: boolean;
  date: Date;

  data?: {
    temperature: number;
    isRunning: boolean;
  };
}

export const DEFAULT_PORT = 56000;
