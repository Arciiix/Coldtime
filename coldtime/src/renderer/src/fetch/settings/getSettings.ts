import { ISettingsDetails } from "@renderer/types/settings";
import i18next from "i18next";
const { ipcRenderer } = window.require("electron");

export default async function getSettings(): Promise<ISettingsDetails> {
  const settings: ISettingsDetails = await ipcRenderer.invoke("GET_SETTINGS");

  i18next.changeLanguage(settings.language.value);
  return settings;
}
