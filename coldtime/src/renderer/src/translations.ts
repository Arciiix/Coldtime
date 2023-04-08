const translations = {
  en: {
    translation: {
      loading: "Loading...",
      deviceList: "Device list",
      error: "Error",
      refresh: "Refresh",
      cancel: "Cancel",
      save: "Save",
      drawer: {
        addDevice: "Add device",
      },
      device: {
        goToDevice: "Go to device",
        addNewDevice: {
          title: "Add new device",
          auto: "Automatically",
          autoDesc: "Let the app automatically find your device in the network",
          orManual: "Or manually",
          manualDesc: "Provide all of the details by yourself",
          networkDiscovery: {
            found: "Number of devices found in the network",
            compatible: "Compatible devices",
            excludingAdded: "excluding already added",
            nameForm: {
              title: "Add new device",
              description:
                "You're about to add a new device with ip: {{ ip }}. Please come up with a friendly name.",
            },
          },
        },
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
      loading: "Ładowanie...",
      deviceList: "Lista urządzeń",
      error: "Błąd",
      refresh: "Odśwież",
      cancel: "Anuluj",
      save: "Zapisz",
      drawer: {
        addDevice: "Dodaj urządzenie",
      },
      device: {
        goToDevice: "Zobacz urządzenie",
        addNewDevice: {
          title: "Dodaj nowe urządzenie",
          auto: "Automatycznie",
          autoDesc:
            "Pozwól aplikacji automatycznie znaleźć Twoje urządzenie w sieci",
          orManual: "Lub ręcznie",
          manualDesc: "Podaj wszystkie dane manualnie",
          networkDiscovery: {
            title: "Lub spróbuj automatycznie wykryć urządzenie",
            found: "Ilość znalezionych urządzeń w sieci",
            compatible: "Ilość kompatybilnych urządzeń",
            excludingAdded: "pomijając już dodane",
            nameForm: {
              title: "Dodaj nowe urządzenie",
              description:
                "Dodajesz nowe urządzenie z ip: {{ ip }}. Nadaj mu nazwę.",
            },
          },
        },
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
