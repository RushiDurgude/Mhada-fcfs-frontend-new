import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { serverUrl } from "../serverurl";

@Injectable({
  providedIn: "root",
})
export class ContactUsService {
  constructor(private httpClient: HttpClient) {}

  async getContactUsPhone() {
    let formData = new FormData();
    formData.append("type", "CC");
    const url = (await serverUrl) + "open/getHelpLineNo";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, formData)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }

  async getContactUsEmail() {
    let formData = new FormData();
    formData.append("type", "CUE");
    const url = (await serverUrl) + "open/getHelpLineNo";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, formData)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }

  async getHelpCenterDetails() {
    const url = (await serverUrl) + "open/getHelpLineNoV1";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, null)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }

  async getContactUsAddress() {
    let formData = new FormData();
    formData.append("type", "ADDR");
    const url = (await serverUrl) + "open/getHelpLineNo";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, formData)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }
}
