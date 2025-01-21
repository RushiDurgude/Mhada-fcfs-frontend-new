import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { serverUrl } from "src/app/serverurl";

@Injectable({
  providedIn: "root",
})
export class DigiMultipleNameCheckService {
  constructor(private httpClient: HttpClient) {}

  async setMultipleCheckConsent(otherNames: any, file1: any, file2: any, file3: any, digiEaadharResonseString: any) {
    const formData = new FormData();
    formData.append("otherNamesString", otherNames);
    formData.append("file1", file1);
    formData.append("file2", file2);
    formData.append("file3", file3);
    formData.append("digiEaadharResonseString", digiEaadharResonseString);
    const url = (await serverUrl) + "digiMultipleNameSave";
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
