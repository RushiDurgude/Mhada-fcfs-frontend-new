import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { grievanceServerUrl } from '../grievenceServerUrl';

@Injectable({
  providedIn: 'root'
})
export class OsOtpDialogService {

  constructor(public httpClient:HttpClient) { }


  async verifyOtpObjection(otp: any, osId) {
    const data = {
      'otp': otp,
      'osId': osId
    };

    const url = (await grievanceServerUrl) + "verifyOtpForOS";
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


  async resendOtpObjection(osId) {
    const data = {
      'osId': osId
    };
    const url = (await grievanceServerUrl) + "resendOTPForOS";
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
