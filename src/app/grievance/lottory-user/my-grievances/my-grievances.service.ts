import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { grievanceServerUrl } from '../../grievenceServerUrl';

@Injectable({
  providedIn: 'root'
})
export class MyGrievancesService {

  constructor(public httpClient: HttpClient) { }

  async loadLottoryUserGrievances() {
    const url = (await grievanceServerUrl) + "loadGrievanceForLotteryUser";
    return new Promise((resolve) => {
      this.httpClient
        .post(url,{})
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