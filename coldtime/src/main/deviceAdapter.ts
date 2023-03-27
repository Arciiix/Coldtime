import axios from "axios";
import { IDeviceState } from "./deviceState";

export interface IDataFormat {
  IS_RUNNING: boolean;
  TEMPERATURE_MAIN: {
    value: number;
    error: boolean;
  };
}

export async function fetchDeviceData(
  ipWithPort: string
): Promise<IDeviceState> {
  try {
    const request = await axios.get(
      "http://" + ipWithPort + "/v1/school/status",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data: IDataFormat = request.data;
    return {
      isConnected: true,
      date: new Date(),

      data: {
        temperature: data.TEMPERATURE_MAIN.value / 100,
        isRunning: data.IS_RUNNING,
      },
    };
  } catch (err) {
    // TODO
    console.error(err);
    throw new Error("Error while getting device data: " + err?.toString());
  }
}

export async function fetchDeviceDataByIpOnly(
  ip: string
): Promise<IDeviceState | null> {
  console.log("Trying to get device data by ip only", ip);
  try {
    const request = await axios.get(
      "http://" + ip + ":56000" + "/v1/school/status",
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 3000,
      }
    );
    const data = request.data;
    if (request.data?.IS_RUNNING !== null) {
      return {
        isConnected: true,
        date: new Date(),

        data: {
          temperature: data.TEMPERATURE_MAIN.value / 100,
          isRunning: data.IS_RUNNING,
        },
      } satisfies IDeviceState;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}
