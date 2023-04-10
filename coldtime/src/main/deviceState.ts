import { Data } from "@prisma/client";
import { prisma } from ".";
import { IDeviceStats } from "./device";
import { fetchDeviceData } from "./deviceAdapter";

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
          temperature: data.temperature!,
          isRunning: data.isConnected!,
        }
      : undefined,
  };
}

export async function getDeviceStats(id: string): Promise<IDeviceStats> {
  const currentStatus = await fetchDeviceData(id, true);

  const stats: IDeviceStats = {
    lastIsRunningChange: null,
    averageTemperatureToday: null,
  };

  if (currentStatus.data) {
    const isRunningChange = await prisma.data.findFirst({
      where: {
        deviceId: id,
        isRunning: !currentStatus.data.isRunning,
      },
      select: {
        date: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (isRunningChange) {
      stats.lastIsRunningChange = isRunningChange.date;
    }
  }

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const averageTemperature = await prisma.data.aggregate({
    where: {
      deviceId: id,
      isConnected: true,
      date: {
        gte: todayMidnight,
      },
    },
    _avg: {
      temperature: true,
    },
  });
  stats.averageTemperatureToday = averageTemperature._avg.temperature;

  return stats;
}
