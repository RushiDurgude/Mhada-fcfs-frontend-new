import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { grievanceServerUrl } from '../../grievenceServerUrl';

@Injectable({
  providedIn: 'root'
})
export class CreateGrievanceService {
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

  //load grievance within board id rest
  async loadGrievanceTypeAndLottery(boardId: any) {
    const data = { 'bdId': boardId, };
    const url = (await grievanceServerUrl) + "loadGrievanceTypeAndLottery";
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

  //load lottery within board id rest
  async loadLottery(boardId: any) {
    const data = { 'bdId': boardId, };
    const url = (await grievanceServerUrl) + "loadLottery";
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


  async loadApplications(lotteryId){
    const data = { 'lotteryId': lotteryId, };
    const url = (await grievanceServerUrl) + "loadApplication";
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


  async loadPayment(applicationId){
    const data = { 'appliId': applicationId, };
    const url = (await grievanceServerUrl) + "loadOnlinePayment";
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

  //submit grievance rest
  async submitGrievance(data: any) {
    const url = (await grievanceServerUrl) + "createGrievanceForLotteryUserV2";
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


  async isCheckDeuplicate(data){
    const url = (await grievanceServerUrl) + "isDuplicateGrievance";
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


  async loadFaqLink(grievanceTypeId){
    const data = { 'grievanceTypeId': grievanceTypeId, };
    // const url = (await grievanceServerUrl) + "loadApplication";
    // return new Promise((resolve) => {
    //   this.httpClient
    //     .post(url, data)
    //     .toPromise()
    //     .then((res) => {
    //       resolve(res);
    //     })
    //     .catch((resp: Response) => {
    //       resolve(resp);
    //     });
    // });

    return "https://www.tutorialspoint.com/java_cryptography/java_cryptography_message_digest.htm"
  }

}

