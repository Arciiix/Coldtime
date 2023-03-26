const translations = {
  en: {
    translation: {
      deviceList: "Device list",
      device: {
        goToDevice: "Go to device",
        addNewDevice: "Add new device",
        temperature: "temperature",
        status: {
          connected: "ONLINE",
          disconnected: "OFFILNE",
          on: "on",
          off: "off",
          lastUpdated: "Last updated: {{ date }}",
          noData: "No data available",
        },
      },
      goBack: "Go back",

      addForm: {
        submit: "Create",
        fields: {
          name: "Name",
          ip: "IP Address",
          port: "Port",
          user: "User",
          password: "Password",
        },
        errors: {
          name: "Name is required",
          ip: "Invalid IP address",
          port: "Invalid port number - it has to fit within the range 0-65535",
        },
      },
    },
  },
  pl: {
    translation: {
      deviceList: "Lista urządzeń",
      device: {
        goToDevice: "Zobacz urządzenie",
        addNewDevice: "Dodaj nowe urządzenie",
        temperature: "temperatura",
        status: {
          connected: "ONLINE",
          disconnected: "OFFLINE",
          on: "wł.",
          off: "wył.",
          lastUpdated: "Ostatnia aktualizacja: {{ date }}",
          noData: "Brak danych",
        },
      },
      goBack: "Cofnij",

      addForm: {
        submit: "Dodaj",
        fields: {
          name: "Nazwa",
          ip: "Adres IP",
          port: "Port",
          user: "Użytkownik",
          password: "Hasło",
        },
        errors: {
          name: "Nazwa jest wymagana",
          ip: "Niepoprawny adres IP",
          port: "Nieprawidłowy numer portu: musi należeć do zakresu 0-65535",
        },
      },
    },
  },
};

export default translations;
