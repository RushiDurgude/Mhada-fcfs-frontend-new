/* eslint-disable @typescript-eslint/quotes */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { serverUrl } from "../serverurl";
@Injectable({
  providedIn: "root",
})
export class ChatbotService {
  constructor(private httpClient: HttpClient) {}

  async getFaqQuestions(queryStr: string) {
    const formData = new FormData();
    formData.append("catId", "1");
    formData.append("sucId", "1");
    formData.append("queryStr", queryStr);
    const url = (await serverUrl) + "getFaqQuestionsV2";
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

  async createChat(chat: string, sendEmailYn: string) {
    const formData = new FormData();
    formData.append("chat", chat);
    formData.append("sendEmailYn", sendEmailYn);
    const url = (await serverUrl) + "createChat";
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

  async getUsrChat() {
    const url = (await serverUrl) + "getUsrChat";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, { responseType: "text" })
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
