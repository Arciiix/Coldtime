import { INetworkDiscoveryDevice } from "@renderer/types/networkDiscoveryDevice";
import { atom } from "recoil";

const networkDiscoveryState = atom<
  undefined | null | INetworkDiscoveryDevice[]
>({
  key: "networkDiscovery",
  default: undefined,
});

export default networkDiscoveryState;
