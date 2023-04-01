import { Data } from "@prisma/client";
import { prisma } from ".";

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

export default async function getLastState(
  deviceId: string
): Promise<IDeviceState | null> {
  const data = await prisma.data.findFirst({
    where: {
      deviceId,
    },
    orderBy: {
      date: "desc",
    },
  });
  return data ? convertData(data) : null;
}

export function convertData(data: Data): IDeviceState {
  return {
    isConnected: data.isConnected,
    date: data.date,
    data: data.isConnected
      ? {
          temperature: data.temperature,
          isRunning: data.isConnected,
        }
      : undefined,
  };
}
