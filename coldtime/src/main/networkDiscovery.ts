import find from "local-devices";

export default async function discoverNetwork(): Promise<find.IDevice[]> {
  const devices = await find();

  return devices;
}
