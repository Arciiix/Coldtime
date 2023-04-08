const translations = {
  en: {
    translation: {
      deviceList: "Device list",
      error: "Error",
      refresh: "Refresh",
      networkDiscovery: {
        title: "Or try to discover the device automatically",
        found: "Number of devices found: {{ count }}",
        compatible: "Compatible devices: {{ count }}",
      },
      drawer: {
        addDevice: "Add device",
      },
      device: {
        goToDevice: "Go to device",
        addNewDevice: "Add new device",
        date: "date",
        temperature: "temperature",
        isRunning: "status",
        status: {
          dataFrom: "Data from: {{ date }}",
          connected: "ONLINE",
          disconnected: "OFFILNE",
          on: "on",
          off: "off",
          lastUpdated: "Last updated: {{ date }}",
          noData: "No data available",
        },
        errors: {
          gettingData: "Error while getting the data: {{ error }}",
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
      error: "Błąd",
      refresh: "Odśwież",
      networkDiscovery: {
        title: "Lub spróbuj automatycznie wykryć urządzenie",
        found: "Ilość znalezionych urządzeń: {{ count }}",
        compatible: "Ilość kompatybilnych urządzeń: {{ count }}",
      },
      drawer: {
        addDevice: "Dodaj urządzenie",
      },
      device: {
        goToDevice: "Zobacz urządzenie",
        addNewDevice: "Dodaj nowe urządzenie",
        date: "data",
        temperature: "temperatura",
        isRunning: "status",
        status: {
          dataFrom: "Dane z: {{ date }}",
          connected: "ONLINE",
          disconnected: "OFFLINE",
          on: "wł.",
          off: "wył.",
          lastUpdated: "Ostatnia aktualizacja: {{ date }}",
          noData: "Brak danych",
        },
        errors: {
          gettingData: "Błąd podczas pobierania danych: {{ error }}",
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
