import { Injectable } from "@angular/core";
import { serverUrl } from "../serverurl";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToastController } from "@ionic/angular";
// import { HTTP } from "@ionic-native/http/ngx";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient,
    private toastController: ToastController,
  ) { }

  async loginUsingPasswordOld(tabRegDtoString: any) {
    const formData = new FormData();
    formData.append("tabRegDtoString", tabRegDtoString);
    const url = (await serverUrl) + "authenticateUserV1";
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

  async verifyRegistrationPanOld(panNo: any, captcha: any) {
    // OLD
    const formData = new FormData();
    formData.append("panNo", panNo);
    formData.append("captchaRes", captcha);
    const url = (await serverUrl) + "verifyRegistrationPanV1";
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

  // async updatePassword(tabRegDtoString: any) {
  //   const formData = new FormData();
  //   formData.append("tabRegDtoString", tabRegDtoString);
  //   const url = (await serverUrl) + "updatePassword";
  //   return new Promise((resolve) => {
  //     this.httpClient
  //       .post(url, formData, { responseType: "text" })
  //       .toPromise()
  //       .then((res) => {
  //         resolve(res);
  //       })
  //       .catch((resp: Response) => {
  //         resolve(resp);
  //       });
  //   });
  // }

  async sendLoginOtpOld(tabRegDtoString: any) {
    const formData = new FormData();
    formData.append("tabRegDtoString", tabRegDtoString);
    const url = (await serverUrl) + "sendLoginOtpV1";
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

  async signup(tabRegDtoString: any, otherNames: any, file1: any, file2: any, file3: any) {
    const formData = new FormData();
    formData.append("tabRegDtoString", tabRegDtoString);
    formData.append("otherNamesString", otherNames);
    formData.append("file1", file1);
    formData.append("file2", file2);
    formData.append("file3", file3);
    const url = (await serverUrl) + "signupV3";
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

  // async sendForgotPasswordOtp(tabRegDtoString: any) {
  //   const formData = new FormData();
  //   formData.append("tabRegDtoString", tabRegDtoString);
  //   const url = (await serverUrl) + "sendForgotPasswordOtpV1";
  //   return new Promise((resolve) => {
  //     this.httpClient
  //       .post(url, formData)
  //       .toPromise()
  //       .then((res) => {
  //         resolve(res);
  //       })
  //       .catch((resp: Response) => {
  //         resolve(resp);
  //       });
  //   });
  // }

  async verifyOtp(tabRegEmailDto: any) {
    const formData = new FormData();
    formData.append("tabRegDtoString", tabRegEmailDto);
    const url = (await serverUrl) + "open/verifyRegistrationOtpV1";
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
  
  async verifyForgotPasswordOtp(tabRegEmailDto: any) {
    const formData = new FormData();
    formData.append("tabRegDtoString", tabRegEmailDto);
    const url = (await serverUrl) + "verifyForgotPasswordOtp";
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

  async getLandingVideos() {
    let formData = new FormData();
    formData.append("type", "V");
    const url = (await serverUrl) + "open/getVideos";
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

  async getHelpDocVideos() {
    const url = (await serverUrl) + "open/getHelpDocVideos";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, null)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }

  async verifyEmailDetails(tabRegDtoString: any) {
    const formData = new FormData();
    formData.append("tabRegDtoString", tabRegDtoString);
    const url = (await serverUrl) + "open/verifyEmailDetailsV1";
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

  async getReasons() {
    const url = (await serverUrl) + "open/getReasons";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, null)
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }

  // NEW Code

  verifyRegistrationPan(panNo: any, captcha: any) {
    return this.httpClient.post<{
      status: string;
      errorMessage: string;
      panNumber: string;
      panName: string;
      registrationStatus: string;
    }>(serverUrl + "open/verifyPan?panNo=" + panNo, captcha);
  }

  verifyRegistrationPanNew(panNo :any, captchaText : string, captchaKey : number) {
    const signUpRequestModel = {
      panNo:panNo,
      captchaText: captchaText,
      captchaKey: captchaKey
    };
    return this.httpClient.post<{
      status: string;
      errorMessage: string;
      panNumber: string;
      panName: string;
      registrationStatus: string;
    }>(serverUrl + "open/verifyPanNew", signUpRequestModel);
  }

  // signUpNew(panNumber : string, password: string, email: string, mobileNumber:string, otherNamesString : any) {
  //   return this.httpClient.post<{
  //     status: string;
  //     errorMessage: string;
  //   }>(serverUrl + "open/sign-up-registration", {panNumber, password, email, mobileNumber, otherNamesString});

  // }

  signUpNew(panNumber : string, password: string, email: string, mobileNumber:string, otherNamesString : any,captchaKey: number) {
    return this.httpClient.post<{
      status: string;
      errorMessage: string;
    }>(serverUrl + "open/sign-up-registration", {panNumber, password, email, mobileNumber, otherNamesString,captchaKey});

  }

  verifyOtpNew(panNumber :string, smsOtp : string, emailOtp : string) {
    return this.httpClient.post<{
      status: string;
      errorMessage: string;
      token: string;
      expiresIn: any;
    }>(serverUrl + "open/verify-otp", {panNumber, smsOtp, emailOtp});
  }
  
  resendOtpNew(panNumber :string) {
    return this.httpClient.post<{
      status: string;
      errorMessage: string;
    }>(serverUrl + "open/resend-otp/"+ panNumber, null);
  }

  loginUsingPassword(panNo: string, password: string,emailOtp : string, loginType : string) {
    return this.httpClient.post<{
      status: string;
      errorMessage: string;
      token: string;
      isOtpVerified: string;
      expiresIn: any;
      stage: string;
    }>(serverUrl + "open/login", { panNo, password, emailOtp, loginType });
  }

  sendLoginOtp(panNumber : string) {
    return this.httpClient.post<{
      status: string;
      errorMessage: string;
    }>(serverUrl + "open/send-login-otp/"+panNumber, null);

  }

  sendForgotPasswordOtp(panNumber : string) {
    return this.httpClient.get<{
      status: string;
      errorMessage: string;
    }>(serverUrl + "open/send-forgot-password-otp?panNumber="+panNumber);
  }

  updatePassword(panNumber: string, otp: string, password: string) {
    return this.httpClient.put<{
      status: string;
      errorMessage: string;
    }>(serverUrl + "open/update-password?panNumber=" + panNumber, { otp, password });
  }
  
  logout() {
    return this.httpClient.post<{
      status: string;
      errorMessage: string;
    }>(serverUrl + "open/logout", null);
  }

 forceLogout(panNo: string) {
  return this.httpClient.post<{
    status: string;
    errorMessage: string;
  }>(serverUrl + "open/forceLogout", panNo);
}
}
