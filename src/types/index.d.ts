export * from "./material-ui";
export * from "./app";

declare global {
  interface Window {
    ethereum: ExternalProvider | JsonRpcFetchFunc;
  }
}
