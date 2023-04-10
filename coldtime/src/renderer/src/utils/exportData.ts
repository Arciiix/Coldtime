import * as XLSX from "xlsx";
const { ipcRenderer } = window.require("electron");

import { IDevice, IDeviceState } from "@renderer/types/device";
import i18next from "i18next";

export function getFileNameForDevice(device: IDevice) {
  return `Coldtime_${device.name}_data`;
}

export function exportToExcel(device: IDevice, dataToExport: IDeviceState[]) {
  const formattedData = formatDataForExport(dataToExport);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  const range = XLSX.utils.decode_range("A1:D1");

  // TODO: Fix it, doesn't work
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = XLSX.utils.encode_cell({ r: row, c: col });
      worksheet[cell].s = { font: { bold: true } };
    }
  }

  // Add footer cell
  const footerText = "Created by Coldtime, made by Artur Nowak";
  const footerCell = [[footerText]];
  const footerRange: XLSX.Range = XLSX.utils.decode_range(
    `${XLSX.utils.encode_col(range.s.c)}${
      range.e.r + (dataToExport.length + 2)
    }:${XLSX.utils.encode_col(range.e.c)}${
      range.e.r + (dataToExport.length + 2)
    }`
  );
  XLSX.utils.sheet_add_aoa(worksheet, footerCell, { origin: footerRange.s });

  worksheet["!merges"] = [...(worksheet["!merges"] ?? []), footerRange];

  XLSX.utils.book_append_sheet(workbook, worksheet, device.name);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveFile(
    excelBuffer,
    `${getFileNameForDevice(device)}.xlsx`,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

export function exportToCSV(device: IDevice, dataToExport: IDeviceState[]) {
  const formattedData = formatDataForExport(dataToExport).map((e) => ({
    ...e,
    [i18next.t("export.date")]: (
      e[i18next.t("export.date")] as Date
    ).toISOString(),
  }));
  const header = Object.keys(formattedData[0]).join(",");
  const rows = formattedData.map((obj) => Object.values(obj).join(","));
  const csv = header + "\n" + rows.join("\n");
  saveFile(csv, `${getFileNameForDevice(device)}.csv`, "text/csv");
}

export function exportToJSON(device: IDevice, dataToExport: IDeviceState[]) {
  const formattedData = formatDataForExport(dataToExport);
  const json = JSON.stringify(formattedData, null, 2);
  saveFile(json, `${getFileNameForDevice(device)}.json`, "application/json");
}

export function formatDataForExport(dataToExport: IDeviceState[]) {
  return dataToExport.map((e) => ({
    [i18next.t("export.isConnected")]: e.isConnected ?? "-",
    [i18next.t("export.date")]: e.date ?? "-",
    [i18next.t("export.temperature")]: e.data?.temperature ?? "-",
    [i18next.t("export.isRunning")]: e.data?.isRunning ?? "-",
  }));
}

function saveFile(data, fileName, fileType) {
  ipcRenderer.invoke("SAVE_FILE", data, fileName, fileType);
}
