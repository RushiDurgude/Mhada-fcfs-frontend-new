import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { grievanceServerUrl } from '../../grievenceServerUrl';

@Injectable({
  providedIn: 'root'
})
export class ViewGrievanceService {

  constructor(public httpClient: HttpClient) { }

  async loadGrievanceHistoryById(id) {
    const data = { 'complaintId': id };
    const url = (await grievanceServerUrl) + "loadGrievanceHistory";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, data)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }


  async replyGrievance(data) {
    const url = (await grievanceServerUrl) + "replyFromLotteryUserV2";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, data)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }


  //download attachment rest
  async downloadAttachment(ghDocument) {
    const data = {
      "documentPath": ghDocument
    }
    const url = (await grievanceServerUrl) + "downloadFileForGrievance";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, data,{ responseType: "arraybuffer" as "json" })
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }
  //

  async cancelGrievance(grievanceId) {
    const data = {
      'complaintId': grievanceId,
    }
    const url = (await grievanceServerUrl) + "close";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, data)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }


  async reopenGrievance(grievanceId) {
    const data = {
      'complaintId': grievanceId,
    }
    const formData = new FormData();
    formData.append("grievanceRequestDtoString", JSON.stringify(data));
    const url = (await grievanceServerUrl) + "reopen";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, data)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }


 async downloadView(ghDocument){
    const data = {
      "documentPath": ghDocument
    }
    const url = (await grievanceServerUrl) + "downloadFileForGrievanceV1";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, data)
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

