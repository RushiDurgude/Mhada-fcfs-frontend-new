import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { serverUrl } from "../serverurl";

@Injectable({
  providedIn: "root",
})
export class ExternalApisService {
  constructor(private httpClient: HttpClient) {}

  async downloadAffidavit(requestDto: any) {
    const formData = new FormData();
    formData.append("requestDtoString", requestDto);

    const url = (await serverUrl) + "downloadAffidavit";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, formData, { responseType: "arraybuffer" as "json" })
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }

  async downloadEsignFile(regId: any) {
    const formData = new FormData();
    formData.append("regId", regId);

    const url = (await serverUrl) + "downloadEsignFile";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, formData, { responseType: "text" })
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
