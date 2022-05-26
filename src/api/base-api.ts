import axios, { AxiosInstance } from "axios";
import { HttpError } from "@util/error";

export default class BaseApi {
  protected axios: AxiosInstance;
  constructor(baseURL: string) {
    this.axios = this.createAxioJsonInstance(baseURL);
  }
  protected createAxioJsonInstance(baseURL: string): AxiosInstance {
    return axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  protected async get<T>(
    axios: AxiosInstance,
    path: string,
    params?: object
  ): Promise<T> {
    try {
      const response = await axios.get<T>(path, {
        params
      });
      if (response.data) {
        return response.data;
      }
      throw new HttpError(JSON.stringify(response.data));
    } catch (err: unknown) {
      throw new HttpError(
        `[GetCall] ${(err as Error).message}: url: ${
          axios.defaults.baseURL
        }, path: ${path}, params: ${JSON.stringify(params)}`
      );
    }
  }
  protected async post<T>(
    axios: AxiosInstance,
    path: string,
    params: object
  ): Promise<T> {
    try {
      const response = await axios.post<T>(path, params);
      if (response.data) {
        return response.data;
      }
      if (response.status === 204) {
        return null;
      }
      throw new HttpError(JSON.stringify(response.data));
    } catch (err: unknown) {
      console.log(err);
      throw new HttpError(
        `[PostCall] ${(err as Error).message}: url: ${
          axios.defaults.baseURL
        }, path: ${path}, params: ${JSON.stringify(params)}`
      );
    }
  }
}
