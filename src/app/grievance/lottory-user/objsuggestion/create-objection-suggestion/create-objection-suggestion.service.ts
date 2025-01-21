import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { grievanceServerUrl } from 'src/app/grievance/grievenceServerUrl';

@Injectable({
  providedIn: 'root'
})
export class CreateObjectionSuggestionService {

  constructor(public httpClient: HttpClient) { }

  //load board rest
  async loadBoard() {
    const url = (await grievanceServerUrl) + "loadBoards";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, {})
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


  //load objection-suggestion type within board id rest
  async loadObjSuggestionType(boardId: any) {
    const data = { 'bdId': boardId, };

    const url = (await grievanceServerUrl) + "loadObjectionAndSuggestionTypeByBDId ";
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
  //


  //submit grievance rest
  async submitObjectionSuggestion(data: any) {

    const url = (await grievanceServerUrl) + "createOSForLotteryUserV2";
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
  //
}
