export interface IEthereumJsonRpcStandardResponse<T> {
  jsonrpc: string;
  id: number;
  result: T;
  error?: {
    code: number;
    message: string;
  };
}

export interface IMoralisIpfsItem {
  path: string;
  content: string;
}

export interface IMoralisIpfsItemResponse {
  path: string;
}