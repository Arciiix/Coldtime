import { ISettings, ISettingsDetails } from "@renderer/types/settings";
import i18next from "i18next";
const { ipcRenderer } = window.require("electron");

export default async function updateSettings(
  updatedSettings: Partial<ISettings>
): Promise<ISettingsDetails> {
  const settings: ISettingsDetails = await ipcRenderer.invoke(
    "UPDATE_SETTINGS",
    updatedSettings
  );

  i18next.changeLanguage(settings.language.value);
  return settings;
}
