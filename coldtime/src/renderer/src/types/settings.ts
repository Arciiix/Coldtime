export interface ISettings {
  language: Language;
}
export type ISettingsDetails = {
  [K in keyof ISettings]: { value: ISettings[K]; isDefault: boolean };
};
export type Language = "en" | "pl";
