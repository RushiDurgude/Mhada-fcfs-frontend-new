import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { serverUrl } from "../serverurl";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  private nameSource = new BehaviorSubject<string>("");
  private authSource = new BehaviorSubject<boolean>(false);
  name = this.nameSource.asObservable();
  authFlag = this.authSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  changeName(name: string) {
    this.nameSource.next(name);
  }

  setAuthentication(auth: boolean) {
    this.authSource.next(auth);
  }

  getDigiLoginDate(): Observable<any> {
    return this.httpClient.post(serverUrl + "getDigiLoginDate", null);
  }

  getAppVersion(): Observable<any> {
    return this.httpClient.post<any>(serverUrl + "getAppVersion", { responseType: "text" as "json" });
  }

  async getHelplineNumbers() {
    let formData = new FormData();
    formData.append("type", "HL");
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

  async getUserDetails() {
    const url = (await serverUrl) + "getAppDetails";
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

  getAppIosVersion(): Observable<any> {
    return this.httpClient.post<any>(serverUrl + "getAppIosVersion", { responseType: "text" as "json" });
  }

  updateAppVersion(version: any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("version", version);
    return this.httpClient.post<any>(serverUrl + "updateAppVersion", queryParams, { responseType: "text" as "json" });
  }

  getShowInfoFlag(): Observable<any> {
    return this.httpClient.post<any>(serverUrl + "getShowInfoFlag", {});
  }

  updateShowInfoFlag(): Observable<any> {
    return this.httpClient.post<any>(serverUrl + "updateShowInfoFlag", {});
  }
}
