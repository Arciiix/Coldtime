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
  ipWithPort: string,
  login: string,
  password: string
): Promise<IDeviceState> {
  try {
    const request = await axios.get(
      "http://" + ipWithPort + "/v1/school/status",
      {
        auth: {
          username: login,
          password: password,
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
