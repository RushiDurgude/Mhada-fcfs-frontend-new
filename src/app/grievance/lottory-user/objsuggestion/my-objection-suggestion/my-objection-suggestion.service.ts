import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { grievanceServerUrl } from 'src/app/grievance/grievenceServerUrl';

@Injectable({
  providedIn: 'root'
})
export class MyObjectionSuggestionService {

  constructor(public httpClient:HttpClient) { }

  async loadAllObjectionSuggestions(){
  
    const url = (await grievanceServerUrl) + "loadObjectionAndSuggestionToLotteryUser";
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
