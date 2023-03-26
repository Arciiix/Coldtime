import { IDevice } from "@renderer/types/device";
import { atom } from "recoil";

const deviceListState = atom<IDevice[]>({
  key: "deviceList",
  default: [],
});

export default deviceListState;
