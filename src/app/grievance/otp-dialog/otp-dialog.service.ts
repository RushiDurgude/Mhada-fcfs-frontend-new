import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { grievanceServerUrl } from '../grievenceServerUrl';

@Injectable({
  providedIn: 'root'
})
export class OtpDialogService {

  constructor(public httpClient: HttpClient) { }

  //verify otp rest
  async verifyOtp(otp: any, grievanceId) {
    const data = {
      'otp': otp,
      'complaintId': grievanceId
    };
    const url = (await grievanceServerUrl) + "verifyOtpForGrievance";
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

  //verify resend rest
  async resendOtp(grievanceId) {
    const data = {
      'complaintId': grievanceId
    };
    const url = (await grievanceServerUrl) + "resendOTP";
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
