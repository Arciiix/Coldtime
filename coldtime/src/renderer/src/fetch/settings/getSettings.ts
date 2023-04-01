import { ISettingsDetails } from "@renderer/types/settings";
const { ipcRenderer } = window.require("electron");

export default async function getSettings(): Promise<ISettingsDetails> {
  return await ipcRenderer.invoke("GET_SETTINGS");
}
