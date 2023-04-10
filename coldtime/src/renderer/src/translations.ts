const translations = {
  en: {
    translation: {
      loading: "Loading...",
      deviceList: "Device list",
      error: "Error",
      refresh: "Refresh",
      cancel: "Cancel",
      confirm: "Confirm",
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
        editDevice: {
          title: "Edit device",
        },
        deleteDevice: {
          title: "Delete device",
          description: "Are you sure you want to delete this device?",
        },
        contextMenu: {
          edit: "Edit",
          delete: "Delete",
          openInNewWindow: "Open in new window",
        },
        date: "date",
        temperature: "temperature",
        connectionState: "Connection state",
        isRunning: "status",
        status: {
          dataFrom: "Data from: {{ date }}",
          connected: "Online",
          disconnected: "Offline",
          on: "on",
          off: "off",
          temperature: "Temperature",
          lastUpdated: "Last updated: {{ date }}",
          noData: "No data available",
        },
        stats: {
          allAlong: "All along",
          never: "Never",
          averageTemperatureToday: "Average temperature today",
        },
        errors: {
          gettingData: "Error while getting the data: {{ error }}",
        },
      },
      goBack: "Go back",
      pagination: {
        firstPage: "First page",
        previousPage: "Previous page",
        nextPage: "Next page",
        lastPage: "Last page",
        pageSize: "Page size",
      },
      export: {
        excel: "Export to Excel (.xlsx)",
        csv: "Export to CSV",
        json: "Export to JSON",
        isConnected: "isConnected",
        date: "date",
        temperature: "temperature",
        isRunning: "isRunning",
      },
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
      settings: {
        settings: "Settings",
        checkInterval: "Check interval",
        checkIntervalDesc:
          "Frequency of monitoring the device, e.g. connection state",
        saveInterval: "Save interval",
        saveIntervalDesc:
          "Frequency of persisting the data in the database (for charts, table etc.)",
      },
      duration: {
        minutes: "Minutes",
        seconds: "Seconds",
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
      confirm: "Potwierdź",
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
        editDevice: {
          title: "Edytuj urządzenie",
        },
        deleteDevice: {
          title: "Usuń urządzenie",
          description: "Czy na pewno chcesz usunąć to urządzenie?",
        },
        contextMenu: {
          edit: "Edytuj",
          delete: "Usuń",
          openInNewWindow: "Otwórz w nowym oknie",
        },
        date: "data",
        temperature: "temperatura",
        connectionState: "Stan połączenia",
        isRunning: "status",
        status: {
          dataFrom: "Dane z: {{ date }}",
          connected: "Połączono",
          disconnected: "Rozłączono",
          on: "wł.",
          off: "wył.",
          temperature: "Temperatura",
          lastUpdated: "Ostatnia aktualizacja: {{ date }}",
          noData: "Brak danych",
        },
        stats: {
          allAlong: "Od zawsze",
          never: "Nigdy",
          averageTemperatureToday: "Średnia temperatura dzisiaj",
        },
        errors: {
          gettingData: "Błąd podczas pobierania danych: {{ error }}",
        },
      },
      goBack: "Cofnij",
      pagination: {
        firstPage: "Pierwsza strona",
        previousPage: "Ostatnia strona",
        nextPage: "Następna strona",
        lastPage: "Ostatnia strona",
        pageSize: "Ilość elementów na stronie",
      },
      export: {
        excel: "Eksport do Excela (.xlsx)",
        csv: "Eksport do CSV",
        json: "Eksport do JSONa",
        isConnected: "czyPolaczono",
        date: "data",
        temperature: "temperatura",
        isRunning: "czyWlaczone",
      },
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
      settings: {
        settings: "Ustawienia",
        checkInterval: "Częstotliwość sprawdzania",
        checkIntervalDesc:
          "Częstotliwość monitorowania urządzenia, np. stanu połączenia",
        saveInterval: "Częstotliwość zapisywania",
        saveIntervalDesc:
          "Częstotliwość zapisywania w bazie danych (dla wykresów, tabel itp.)",
      },
      duration: {
        minutes: "Minuty",
        seconds: "Sekundy",
      },
    },
  },
};

export default translations;
