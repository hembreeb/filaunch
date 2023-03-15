import axios from "axios";
type LaunchpadPriceResponse = {
  blockTime: string;
  height: number;
  price: number;
  time: number;
};

type LaunchpadListResponse = {
  chainId: number;
  chainRpcUrl: string;
  contractAddress: string;
};

class HttpRequest {
  private instance: any;
  constructor() {
    this.instance = axios.create({
      baseURL: "https://filaunch.io/",
      timeout: 3000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async getLaunchpadPrice(
    contractAddr: string
  ): Promise<[LaunchpadPriceResponse] | Error> {
    try {
      const response = await this.instance({
        url: "/fi/filaunch/price",
        method: "post",
        data: {
          contractAddress: contractAddr,
          endDate: "",
          startDate: "",
        },
      });
      if (
        response != null &&
        response.data != null &&
        response.data.data != null
      ) {
        return response.data.data;
      }
      return new Error("no data");
    } catch (error: any) {
      return error;
    }
  }

  public async getLaunchpadList(): Promise<[LaunchpadListResponse] | Error> {
    try {
      const response = await this.instance({
        url: "/fi/filaunch/contract",
        method: "get",
        data: {},
      });
      if (
        response != null &&
        response.data != null &&
        response.data.data != null
      ) {
        return response.data.data;
      }
      return new Error("no data");
    } catch (error: any) {
      return error;
    }
  }
}

export { HttpRequest, LaunchpadPriceResponse, LaunchpadListResponse };
