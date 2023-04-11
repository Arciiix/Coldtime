import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import {
  BrowserWindow,
  Menu,
  Notification,
  Tray,
  app,
  dialog,
  ipcMain,
  shell,
} from "electron";
import { join } from "path";
// import icon from "../../resources/icon.png?asset";
import iconRed from "../../resources/logo-red.png?asset";
import icon from "../../resources/logo.png?asset";

import { Data, Device, PrismaClient } from "@prisma/client";
import { IDevice } from "./device";
import { fetchDeviceData, fetchDeviceDataByIpOnly } from "./deviceAdapter";
import getLastState, { IDeviceState, getDeviceStats } from "./deviceState";
import discoverNetwork from "./networkDiscovery";
import {
  ISettingsDetails,
  IUpdateSettings,
  getSettings,
  updateSettings,
} from "./settings";
import fs from "fs";

// Init translations
import i18next from "i18next";
import "./i18n";

export const prisma = new PrismaClient();

// const MAX_DATA_POINTS = 100; // TODO: Should be a setting
const MAX_DATA_POINTS = 300; // TODO: Should be a setting

let settings: ISettingsDetails;
let mainWindow: BrowserWindow;
let tray: Tray;

let isRedIcon: boolean = false;
let isQuitting = false;

let jobs: ReturnType<typeof setInterval>[] = [];

// It's a pair of id:isOnline states - if one changes, the notification is sent
let deviceStates: Map<string, boolean> = new Map();

async function handleRefreshData(justCheck: boolean, device: IDevice) {
  console.log(
    `Refreshing data for ${
      device.id
    } at ${new Date().toISOString()} (justCheck: ${justCheck})`
  );
  const data = await fetchDeviceData(device.id, justCheck);

  mainWindow.webContents.send("REFRESH_DATA", { id: device.id, data });
  console.log(deviceStates);
  if (data.isConnected !== (deviceStates.get(device.id) ?? false)) {
    deviceStates.set(device.id, data.isConnected);
    console.log(
      `Status of ${device.id} changed to ${
        data.isConnected
      } at ${new Date().toISOString()}`
    );

    const notification = new Notification({
      title: i18next
        .t("statusChangeNotification.title", {
          deviceName: device.name,
        })
        .toString(),
      body: i18next
        .t("statusChangeNotification.message", {
          status: data.isConnected ? "online" : "offline",
        })
        .toString(),
      icon: data.isConnected ? icon : iconRed,
    });

    notification.on("click", (e) => {
      // When user clicks on the notification, navigate to the device
      mainWindow.webContents.send("NAVIGATE_TO_DEVICE", device.id);
      mainWindow.show();
    });

    notification.show();

    if (justCheck) {
      // If the current action is check-only, wihtout saving to the db
      // Save this event into the db (it's about connection state change, so it's important)
      await saveData(data, device.id);
    }
  }

  // If any of the devices is disconnected, change the icon to the red version in the tray; otherwise, keep it default
  // Also, check if the icon hasn't been already changed
  if (Array.from(deviceStates.values()).some((isConnected) => !isConnected)) {
    if (!isRedIcon) {
      console.log("Change icon to red");
      isRedIcon = true;
      tray.setImage(iconRed);
    }
  } else if (isRedIcon) {
    console.log("Change icon to default");

    isRedIcon = false;
    tray.setImage(icon);
  }
}

function generateDeviceStates(devices: IDevice[]): Map<string, boolean> {
  // It's a pair of id:isOnline states - if one changes, the notification is sent

  let newDeviceStates: Map<string, boolean> = new Map();

  devices.forEach((device) => {
    newDeviceStates.set(
      device.id,
      device.id in deviceStates ? deviceStates.get(device.id)! : false // If the previous deviceStates map exists and has the device, set its "isOnline" status to the previous value; otherwise - to false
    );
  });

  deviceStates = newDeviceStates;
  return deviceStates;
}

async function initJobs() {
  const devices = await getAllDevices();

  devices.forEach((device) => {
    jobs.push(
      setInterval(() => {
        handleRefreshData(true, device);
      }, settings.checkInterval.value * 1000)
    );

    jobs.push(
      setInterval(() => {
        handleRefreshData(false, device);
      }, settings.saveInterval.value * 1000)
    );

    handleRefreshData(true, device);
  });
}

async function recreateJobs() {
  jobs.forEach((e) => clearInterval(e));
  await initJobs();
}

async function createContextMenu() {
  const allDevices = await getAllDevices();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: i18next.t("tray.open").toString(),
      click: () => {
        mainWindow.show();
      },
    },
    { type: "separator" },
    ...[...allDevices]
      .sort((a, _) => (a.lastState?.isConnected ? -1 : 1))
      .map((e) => ({
        label: e.name,
        click: () => {
          mainWindow.webContents.send("NAVIGATE_TO_DEVICE", e.id);
          mainWindow.show();
        },
        checked: true,
      })),
    { type: "separator" },
    {
      label: i18next.t("tray.quit").toString(),
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
}

async function getAllDevices(withState?: boolean): Promise<IDevice[]> {
  const devices = await prisma.device.findMany({});

  const parsed: IDevice[] = [];

  for await (const device of devices) {
    parsed.push({
      id: device.id,
      ip: device.ip,
      name: device.name,
      port: device.port,
      lastState: withState ? await getLastState(device.id) : null,
    });
  }

  return parsed;
}
async function createDevice(data): Promise<Device> {
  const result = await prisma.device.create({ data });

  createContextMenu();

  return result;
}
async function editDevice(id: string, data: Partial<Device>): Promise<Device> {
  const result = await prisma.device.update({
    where: {
      id: id,
    },
    data,
  });
  createContextMenu();
  return result;
}
async function deleteDevice(id: string) {
  await prisma.$transaction([
    prisma.device.delete({ where: { id: id } }),
    prisma.data.deleteMany({
      where: {
        deviceId: id,
      },
    }),
  ]);
  createContextMenu();
}

export async function getDevice(id: string): Promise<Device | null> {
  return await prisma.device.findFirst({ where: { id } });
}

async function createWindow(): Promise<void> {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,

    minWidth: 500,
    show: false,
    autoHideMenuBar: true,

    darkTheme: true,

    icon: icon,

    // ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true, // DEV
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();

    tray = new Tray(icon);
    createContextMenu();

    tray.on("click", () => {
      mainWindow.show();
    });

    tray.setToolTip("Coldtime");
  });

  // Minimize to tray on close, instead of actually quitting
  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      event.returnValue = false;
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  // Try to fetch the settings
  settings = await getSettings();
  console.log(`Fetched settings: ${JSON.stringify(settings)}`);

  ipcMain.handle("GET_DEVICES", async (_, { withState }) => {
    // console.log(event);
    const result = await getAllDevices(withState ?? false);
    return { devices: result };
  });

  ipcMain.handle("BROWSER_GO_BACK", () => {
    mainWindow.webContents.goBack();
  });
  ipcMain.handle("ADD_DEVICE", async (_, data) => {
    const newDevice = await createDevice(data);
    const allDevices = await getAllDevices(true);

    console.log("added device");
    return { newDevice, devices: allDevices };
  });

  ipcMain.handle("EDIT_DEVICE", async (_, data) => {
    // From the object, get the id as a standalone variable and the rest (object with the rest) as editedData
    const { id, ...editedData } = data;

    const newDevice = await editDevice(id, editedData);
    const allDevices = await getAllDevices(true);

    console.log(`edited device ${id}`);
    return { newDevice, devices: allDevices };
  });

  ipcMain.handle("DELETE_DEVICE", async (_, id) => {
    await deleteDevice(id);
    const allDevices = await getAllDevices(true);

    console.log(`deleted device ${id}`);
    return { devices: allDevices };
  });

  ipcMain.handle("GET_DEVICE_DATA", async (_, deviceId) => {
    const data = await fetchDeviceData(deviceId);
    return { data };
  });

  ipcMain.handle("GET_DEVICE", async (_, id) => {
    const device = await getDevice(id);

    return { device };
  });

  ipcMain.handle("NETWORK_DISCOVERY", async () => {
    return { devices: await discoverNetwork() };
  });

  ipcMain.handle("GET_DEVICE_DATA_BY_IP", (_, ip) => {
    return fetchDeviceDataByIpOnly(ip);
  });

  ipcMain.handle("GET_DEVICE_STATS", (_, deviceId: string) => {
    // Returns promise
    return getDeviceStats(deviceId);
  });

  // TODO DEV
  ipcMain.handle(
    "GET_HISTORICAL_DATA",
    async (
      _,
      { id, start, end }
    ): Promise<{
      data: IDeviceState[];
      numberOfDataPointsStripped: number;
    }> => {
      console.log(`Get historical data ${start} to ${end}`);
      const data = await prisma.data.findMany({
        where: {
          deviceId: id,
          date: {
            gte: start,
            lte: end,
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      // If there is too many data points - it may crush the app and cause a lot of trouble
      let newData: Data[] = [];
      if (data.length > MAX_DATA_POINTS) {
        for (
          let i = 0;
          i < data.length;
          i += Math.floor(data.length / MAX_DATA_POINTS)
        ) {
          newData.push(data[i]);
        }
      } else {
        newData = data;
      }

      return {
        data: (newData || data).map((e) => ({
          isConnected: e.isConnected,
          date: e.date,
          data:
            e.isRunning !== null
              ? {
                  isRunning: e.isRunning!,
                  temperature: e.temperature!,
                }
              : undefined,
        })),
        numberOfDataPointsStripped: Math.max(
          (newData || data).length - MAX_DATA_POINTS,
          0
        ),
      };
    }
  );

  ipcMain.handle("GET_SETTINGS", (_) => {
    return settings;
  });

  ipcMain.handle("UPDATE_SETTINGS", async (_, newSettings: IUpdateSettings) => {
    settings = await updateSettings(newSettings);
    await recreateJobs();

    return settings;
  });

  ipcMain.handle("SAVE_FILE", async (_, data, fileName, fileType) => {
    const defaultPath = app.getPath("desktop");
    const defaultFilename = `${fileName}`;
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: `${defaultPath}/${defaultFilename}`,
      filters: [{ name: fileName, extensions: [fileName.split(".").at(-1)] }],
    });

    if (filePath) {
      const bufferData = Buffer.from(data);
      fs.writeFile(filePath, bufferData, (err) => {
        if (err) {
          console.error("Error saving file:", err.message);
        } else {
          console.log("File saved successfully!");
          shell.openPath(filePath);
        }
      });
    }
  });

  initJobs();
  const allDevices = await getAllDevices();
  generateDeviceStates(allDevices);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.arciiix.coldtime");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    app.quit();
  }

  // Close prisma connection
  await prisma.$disconnect();
});

app.on("before-quit", function () {
  isQuitting = true;
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

export async function saveData(
  state: IDeviceState,
  deviceId: string
): Promise<Data> {
  const data = await prisma.data.create({
    data: {
      deviceId: deviceId,
      isConnected: state.isConnected,
      date: new Date(),

      isRunning: state.data?.isRunning ?? undefined,
      temperature: state.data?.temperature ?? undefined,
    },
  });

  console.log("Created new entry");
  return data;
}
