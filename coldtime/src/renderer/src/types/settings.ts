export interface ISettings {
  language: Language;
  checkInterval: number; // In seconds
  saveInterval: number; // In seconds
}

export type ISettingsDetails = {
  [K in keyof ISettings]: { value: ISettings[K]; isDefault: boolean };
};
export type Language = "en" | "pl";
