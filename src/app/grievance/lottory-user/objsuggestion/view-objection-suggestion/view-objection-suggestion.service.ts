import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { grievanceServerUrl } from 'src/app/grievance/grievenceServerUrl';

@Injectable({
  providedIn: 'root'
})
export class ViewObjectionSuggestionService {

  constructor(public httpClient:HttpClient) { }

  async loadObjectionSuggestionHistoryById(id){
    const data = {'osId': id};
 
    const url = (await grievanceServerUrl) + "loadOSHistory ";
    return new Promise((resolve) => {
      this.httpClient
        .post(url,data)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }


  
 async replyObjection(data,){
  const url = (await grievanceServerUrl) + "objectionReplyFromLotteryUserV2";
  return new Promise((resolve) => {
    this.httpClient
      .post(url,data)
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
      .post(url, data, { responseType: "arraybuffer" as "json" })
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
