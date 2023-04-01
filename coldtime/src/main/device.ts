import { IDeviceState } from "./deviceState";

export interface IDevice {
  id: string;
  name: string;
  ip: string;
  port: number;

  lastState: IDeviceState | null;
}
