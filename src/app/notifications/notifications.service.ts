import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { serverUrl } from "../serverurl";
@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  constructor(private httpClient: HttpClient) {}

  getNotifications(): Observable<any> {
    return this.httpClient.post(serverUrl + "getNotifications", null);
  }
}
