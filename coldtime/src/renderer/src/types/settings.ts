export interface ISettings {
  language: Language;
  checkInterval: number; // In seconds
  saveInterval: number; // In seconds
  maxDataPoints: number; // Max data points on the chart
}

export type ISettingsDetails = {
  [K in keyof ISettings]: { value: ISettings[K]; isDefault: boolean };
};
export type Language = "en" | "pl";
