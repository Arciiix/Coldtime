import { ISettingsDetails } from "@renderer/types/settings";
import { atom } from "recoil";

const settingsState = atom<ISettingsDetails | undefined>({
  key: "settings",
  default: undefined,
});

export default settingsState;
