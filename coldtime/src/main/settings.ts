import { Prisma, Settings } from "@prisma/client";
import { prisma } from ".";

export const defaultSettings: ISettings = {
  language: "en",
};

export type Language = "en" | "pl";

export interface ISettings {
  language: Language;
}

export type ISettingsDetails = {
  [K in keyof ISettings]: { value: ISettings[K]; isDefault: boolean };
};

export type IUpdateSettings = Partial<ISettings>;

function convertSettings(value: Settings[]): ISettingsDetails {
  const updatedSettings = {} as ISettingsDetails;
  for (const [key, val] of Object.entries(defaultSettings)) {
    updatedSettings[key as keyof ISettings] = { value: val, isDefault: true };
  }
  for (const item of value) {
    updatedSettings[item.key as keyof ISettings] = {
      value: item.value as ISettings[keyof ISettings],
      isDefault: false,
    };
  }
  return updatedSettings;
}

export async function getSettings(): Promise<ISettingsDetails> {
  const settings = await prisma.settings.findMany({});
  return convertSettings(settings);
}

export async function updateSettings(
  newSettings: IUpdateSettings
): Promise<ISettingsDetails> {
  const transactions: Prisma.PrismaPromise<any>[] = [];
  for (let [key, value] of Object.entries(newSettings)) {
    let strValue: string = value.toString();
    transactions.push(
      prisma.settings.upsert({
        where: {
          key,
        },
        update: {
          value: strValue,
        },
        create: {
          key,
          value: strValue,
        },
      })
    );
  }

  await prisma.$transaction(transactions);
  console.log(`Updated settings`);

  return await getSettings();
}