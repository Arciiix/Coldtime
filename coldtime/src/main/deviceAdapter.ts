import axios from "axios";
import { saveData } from ".";
import { IDeviceState, IDeviceStateRequired } from "./deviceState";

export interface IDataFormat {
  IS_RUNNING: boolean;
  TEMPERATURE_MAIN: {
    value: number;
    error: boolean;
  };
}

export async function fetchDeviceData(
  ipWithPort: string,
  deviceId: string
): Promise<IDeviceState> {
  try {
    const request = await axios.get(
      "http://" + ipWithPort + "/api/v1/school/status",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data: IDataFormat = request.data;

    const dataParsed: IDeviceStateRequired = {
      isConnected: true,
      date: new Date(),

      data: {
        temperature: data.TEMPERATURE_MAIN.value / 100,
        isRunning: data.IS_RUNNING,
      },
    };

    saveData(dataParsed, deviceId);

    return dataParsed;
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
      "http://" + ip + ":56000" + "/api/v1/school/status",
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
