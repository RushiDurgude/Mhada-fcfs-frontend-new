/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { serverUrl } from "../serverurl";
import { PreLotteryApplicationService, api_url } from "../pre-lottery/services/pre-lottery-application.service";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  async getProfileDetails(regId: any) {
    const formData = new FormData();

    formData.append("regId", regId);

    const url = (await serverUrl) + "getProfileDetailsV2";
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

  async getNomineeDtlsAppTrnsfrdTo(regId: any): Promise<any> {
    try {
      const url = `${await api_url}/nominee-dtls/getNomineeDtlsAppTrnsfrdTo?regId=${encodeURIComponent(regId)}`;
      console.log("url >> ", url);
      return new Promise((resolve) => {
        this.httpClient
          .get(url)
          .toPromise()
          .then((res) => {
            resolve(res);
          })
          .catch((resp: Response) => {
            resolve(resp);
          });
      });
    } catch (error) {
      console.error('Error fetching nominee details:', error);
      throw error;
    }
  }

  async refreshtoken() {
    const url = (await serverUrl) + "refreshtoken";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, { responseType: "text" })
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: ErrorEvent) => {
          resolve(resp);
        });
    });
  }

  async generateMudhraRequest(regId: any) {
    const formData = new FormData();
    formData.append("regId", regId);
    const url = (await serverUrl) + "generateMudhraRequest";
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

  async generateMudhraRequestV1(regId: any, ipAddress: any) {
    const formData = new FormData();
    formData.append("regId", regId);
    formData.append("ipAddress", ipAddress);
    const url = (await serverUrl) + "generateMudhraRequestV1";
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

  async eMsecure(parameter1: any, parameter2: any, parameter3: any) {
    const config = {
      headers: new HttpHeaders({ "Content-Type": "application/json", "No-Auth": "True" }),
    };
    const formData = new FormData();
    formData.append("Parameter1", parameter1);
    formData.append("Parameter2", parameter2);
    formData.append("Parameter3", parameter3);
    // formData.append('formAction2', 'EsignWithASP');
    // const data = {'Parameter1': parameter1,'Parameter2': parameter2,'Parameter3': parameter3};
    const url = await "https://demosignergateway.emsigner.com/eMsecure/V3_0/Index";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, formData, { responseType: "text" as "json" })
        .toPromise()
        .then((res) => {
          // console.log(JSON.parse(res))
          resolve(res);
        })
        .catch((resp: Response) => {
          // console.log(JSON.stringify(resp))
          resolve(resp);
        });
    });
  }

  async processMudhraResponse(
    returnStatus: any,
    errorMessage: any,
    returnValue: any,
    transactionNumber: any,
    referenceNumber: any,
    fileType: any,
    isCompressed: any,
    sessionKey: any,
    regId: any
  ) {
    const formData = new FormData();
    formData.append("returnStatus", returnStatus);
    formData.append("errorMessage", errorMessage);
    formData.append("returnValue", returnValue);
    formData.append("transactionNumber", transactionNumber);
    formData.append("referenceNumber", referenceNumber);
    formData.append("fileType", fileType);
    formData.append("isCompressed", isCompressed);
    formData.append("sessionKey", sessionKey);
    formData.append("regId", regId);

    const url = (await serverUrl) + "processMudhraResponse";
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

  async downloadFile(documentPath: any) {
    const formData = new FormData();
    formData.append("documentPath", documentPath);
    const url = (await serverUrl) + "downloadFileForProfile";// downloadFile
    return new Promise((resolve) => {
      this.httpClient
        .post(url, formData, { responseType: "arraybuffer" as "json" })
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }

  async generateEsignRequestV1(regId: any, ipAddress: any, deviceType: any) {
    const formData = new FormData();

    formData.append("regId", regId);
    formData.append("ipAddress", ipAddress);
    formData.append("deviceType", deviceType);
    const url = (await serverUrl) + "generateEsignRequestV4";
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

  async getSignedPdf(regId: any) {
    const formData = new FormData();
    formData.append("regId", regId);
    const url = (await serverUrl) + "getSignedPdf";
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

  async loadRegistrationUserCategories(regId: any) {
    const formData = new FormData();
    formData.append("regId", regId);
    const url = (await serverUrl) + "loadRegistrationUserCategories";
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
}
