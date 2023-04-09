import { Language } from "./settings";
import i18next, { Resource } from "i18next";

const translations: Resource = {
  en: {
    translation: {
      statusChangeNotification: {
        title: "Status of device {{ deviceName }} has changed!",
        message: "The device is now $t(statusChangeNotification.{{ status }})",
        online: "online",
        offline: "offline",
      },
    },
  },
  pl: {
    translation: {
      statusChangeNotification: {
        title: "Status {{ deviceName }} się zmienił!",
        message:
          "Urządzenie jest teraz $t(statusChangeNotification.{{ status }})",
        online: "dostępne",
        offline: "niedostępne",
      },
    },
  },
};

i18next.init({
  lng: "en",
  resources: translations,
});

console.log("Translations init");
console.log(
  i18next.t("statusChangeNotification.title", {
    deviceName: "Phone",
    status: "online",
  })
);
