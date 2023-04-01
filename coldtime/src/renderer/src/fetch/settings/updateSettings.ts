import { ISettings, ISettingsDetails } from "@renderer/types/settings";
const { ipcRenderer } = window.require("electron");

export default async function updateSettings(
  updatedSettings: Partial<ISettings>
): Promise<ISettingsDetails> {
  return await ipcRenderer.invoke("UPDATE_SETTINGS", updatedSettings);
}
