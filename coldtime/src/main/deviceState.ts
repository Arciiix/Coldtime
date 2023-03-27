export interface IDeviceState {
  isConnected: boolean;
  date: Date;

  data?: {
    temperature: number;
    isRunning: boolean;
  };
}
export type IDeviceStateRequired = {
  [P in keyof IDeviceState]-?: IDeviceState[P];
};
