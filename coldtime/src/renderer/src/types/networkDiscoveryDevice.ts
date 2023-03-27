import { IDeviceState } from "./device";

export interface INetworkDiscoveryDevice {
  name: string;
  ip: string;
  mac: string;
  data?: IDeviceState;
}
