import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

import { Data, Device, PrismaClient } from "@prisma/client";
import { fetchDeviceData, fetchDeviceDataByIpOnly } from "./deviceAdapter";
import discoverNetwork from "./networkDiscovery";
import { IDeviceState, IDeviceStateRequired } from "./deviceState";

const prisma = new PrismaClient();

async function getAllDevices(): Promise<Device[]> {
  return await prisma.device.findMany({});
}
async function createDevice(data): Promise<Device> {
  return await prisma.device.create({ data });
}
async function getDevice(id: string): Promise<Device | null> {
  return await prisma.device.findFirst({ where: { id } });
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,

    darkTheme: true,

    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
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

  ipcMain.handle("GET_DEVICES", async (event) => {
    console.log(event);
    const result = await getAllDevices();
    return { devices: result };
  });

  ipcMain.handle("BROWSER_GO_BACK", () => {
    mainWindow.webContents.goBack();
  });
  ipcMain.handle("ADD_DEVICE", async (_, data) => {
    const newDevice = await createDevice(data);
    const allDevices = await getAllDevices();

    console.log("added device");
    return { newDevice, devices: allDevices };
  });

  ipcMain.handle("GET_DEVICE_DATA", async (_, deviceId) => {
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
      },
    });

    if (!device) {
      throw new Error("Couldn't find device by id!");
      // TODO
    }

    const data = await fetchDeviceData(
      device.ip + ":" + device.port,
      device.id
    );
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

  // TODO DEV
  ipcMain.handle(
    "GET_HISTORICAL_DATA",
    async (_, deviceId): Promise<IDeviceStateRequired[]> => {
      const data = await prisma.data.findMany({
        where: { deviceId },
        orderBy: {
          date: "desc",
        },
      });

      return data.map((e) => ({
        isConnected: e.isConnected,
        date: e.date,
        data: {
          isRunning: e.isRunning,
          temperature: e.temperature,
        },
      }));
    }
  );
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

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

export async function saveData(
  state: IDeviceStateRequired,
  deviceId: string
): Promise<Data> {
  const data = await prisma.data.create({
    data: {
      deviceId: deviceId,
      isConnected: state.isConnected,
      date: new Date(),

      isRunning: state.data.isRunning,
      temperature: state.data.temperature,
    },
  });

  console.log("Created new entry");
  return data;
}
