/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
// import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from "@ionic/angular";
import { serverUrl } from "../serverurl";

const IMAGE_DIR = "stored-images";

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

@Injectable({
  providedIn: "root",
})
export class QuestionAnswerService {
  public photos: UserPhoto[] = [];
  constructor(private httpClient: HttpClient, private plt: Platform) {}

  public async addNewToGallery() {
    this.photos = [];
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      correctOrientation: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.photos.unshift({
      filepath: "soon...",
      webviewPath: capturedPhoto.webPath,
    });

    if (capturedPhoto) {
      // this.saveImage(capturedPhoto);
      return capturedPhoto;
    }
  }

  async ocrIncomeCertV1(img: any) {
    const formData = new FormData();

    formData.append("fileObj", img);
    formData.append("type", "image");

    const url = (await serverUrl) + "ocrIncomeCertV1";
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

  async verifyPan(requestDto: any, selfSpouseSw: any, alisName: any) {
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'requestDto': requestDto,'selfSpouseSw':selfSpouseSw};
    const formData = new FormData();
    formData.append("requestDtoString", JSON.stringify(requestDto));
    formData.append("selfSpouseSw", selfSpouseSw);
    formData.append("alisName", alisName);

    const url = (await serverUrl) + "verifyPan";
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

  async verifyPanDetails(requestDto: any, selfSpouseSw: any) {
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'requestDto': requestDto,'selfSpouseSw':selfSpouseSw};
    const formData = new FormData();
    formData.append("requestDtoString", JSON.stringify(requestDto));
    formData.append("selfSpouseSw", selfSpouseSw);

    const url = (await serverUrl) + "verifyPanDetails";
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

  async verifyDomicile(requestDto: any) {
    const formData = new FormData();
    formData.append("requestDtoString", JSON.stringify(requestDto));

    const url = (await serverUrl) + "verifyDomicile";
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

  async verifyIncomeCert(
    requestDtoString: any,
    selfSpouseSw: any,
    itrIncome: any
  ) {
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'barcode': barcode};
    const formData = new FormData();
    formData.append("requestDtoString", requestDtoString);
    formData.append("selfSpouseSw", selfSpouseSw);
    formData.append("itrIncome", itrIncome);
    const url = (await serverUrl) + "verifyIncomeCert";
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

  async verifyCasteCertValidity(ocrResponse: any) {
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'barcode': barcode};
    const formData = new FormData();
    formData.append("requestDtoString", ocrResponse);
    const url = (await serverUrl) + "verifyCasteCertValidity";
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

  async verifyAadhar(ocrResponse: any) {
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'ocrResponse': JSON.parse(OcrResponse)};
    const formData = new FormData();
    formData.append("ocrResponseString", ocrResponse);
    const url = (await serverUrl) + "verifyAadhar";
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

  // async verifyPmay(ocrResponse: any) {
  //   const formData = new FormData();
  //   formData.append("requestDtoString", ocrResponse);
  //   const url = (await serverUrl) + "verifyPmay";
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

  async verifyPredefinedDoc(ocrResponse: any, wsName: string) {
    const formData = new FormData();
    formData.append("requestDtoString", ocrResponse);
    const url = (await serverUrl) + wsName;
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

  async verifyDisablityCert(ocrResponse: any) {
    const formData = new FormData();
    formData.append("requestDtoString", ocrResponse);
    const url = (await serverUrl) + "verifyDisablityCert";
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

  async verifyMhadaEmployee(ocrResponse: any) {
    const formData = new FormData();
    formData.append("requestDtoString", ocrResponse);
    const url = (await serverUrl) + "verifyMhadaEmployee";
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

  async ocrAadharV3(
    frontFileObj: any,
    backFileObj: any,
    ocrAadharDtoString: any,
    selfSpouseSw: any
  ) {
    const formData = new FormData();

    formData.append("frontFileObj", frontFileObj);
    formData.append("backFileObj", backFileObj);
    formData.append("frontType", "image");
    formData.append("backType", "image");
    formData.append("ocrAadharDtoString", ocrAadharDtoString);
    formData.append("selfSpouseSw", selfSpouseSw);
    const url = (await serverUrl) + "ocrAadharV3";
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

  // async ocrAadharV4(frontFileObj: any, backFileObj: any, ocrAadharDtoString: any, selfSpouseSw: any) {
  //   const formData = new FormData();

  //   formData.append("frontFileObj", frontFileObj);
  //   formData.append("backFileObj", backFileObj);
  //   formData.append("frontType", "image");
  //   formData.append("backType", "image");
  //   formData.append("ocrAadharDtoString", ocrAadharDtoString);
  //   formData.append("selfSpouseSw", selfSpouseSw);
  //   const url = (await serverUrl) + "ocrAadharV4";
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

  async ocrPanV3(
    frontFileObj: any,
    ocrRequestDtoString: any,
    selfSpouseSw: any
  ) {
    const formData = new FormData();

    formData.append("fileObj", frontFileObj);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);
    formData.append("selfSpouseSw", selfSpouseSw);
    const url = (await serverUrl) + "ocrPanV3";
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

  async ocrDomicileV3(frontFileObj: any, ocrRequestDtoString: any) {
    const formData = new FormData();

    formData.append("fileObj", frontFileObj);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);
    const url = (await serverUrl) + "ocrDomicileV3";
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

  async ocrElectricityBillV3(frontFileObj: any, ocrRequestDtoString: any) {
    const formData = new FormData();

    formData.append("fileObj", frontFileObj);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);
    const url = (await serverUrl) + "ocrElectricityBillV3";
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

  async ocrGasBillV3(frontFileObj: any, ocrRequestDtoString: any) {
    const formData = new FormData();

    formData.append("fileObj", frontFileObj);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);
    const url = (await serverUrl) + "ocrGasBillV3";
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

  async ocrDrivingLicenseV3(frontFileObj: any, ocrRequestDtoString: any) {
    const formData = new FormData();

    formData.append("fileObj", frontFileObj);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);
    const url = (await serverUrl) + "ocrDrivingLicenseV3";
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

  async ocrFamilyIncomeV3(frontFileObj: any, ocrRequestDtoString: any) {
    const formData = new FormData();

    formData.append("fileObj", frontFileObj);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);
    const url = (await serverUrl) + "ocrFamilyIncomeV3";
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

  async verifyYear(requestDtoString: any) {
    const formData = new FormData();
    formData.append("requestDtoString", requestDtoString);
    const url = (await serverUrl) + "verifyYear";
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

  async ocrIncomeVertV3(
    frontFileObj: any,
    ocrRequestDtoString: any,
    selfSpouseSw: any
  ) {
    const formData = new FormData();

    formData.append("fileObj", frontFileObj);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);
    formData.append("selfSpouseSw", selfSpouseSw);
    const url = (await serverUrl) + "ocrIncomeVertV3";
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

  async ocrSelfItrV3(
    frontFileObj: any,
    ocrRequestDtoString: any,
    selfSpouseSw: any
  ) {
    const formData = new FormData();

    formData.append("fileObj", frontFileObj);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);
    formData.append("selfSpouseSw", selfSpouseSw);

    const url = (await serverUrl) + "ocrSelfItrV3";
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

  async ocrCasteCertV3(img: any, ocrRequestDtoString: any) {
    const formData = new FormData();

    formData.append("fileObj", img);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);

    const url = (await serverUrl) + "ocrCasteCertV3";
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

  async ocrCasteValV3(img: any, ocrRequestDtoString: any) {
    const formData = new FormData();

    formData.append("fileObj", img);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);

    const url = (await serverUrl) + "ocrCasteValV3";
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

  async predefinedWS(
    fileObj: any,
    PredefinedDocRequestDtoString: any,
    wsName: any
  ) {
    const formData = new FormData();

    formData.append("fileObj", fileObj);
    formData.append(
      "PredefinedDocRequestDtoString",
      PredefinedDocRequestDtoString
    );

    const url = (await serverUrl) + wsName;
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

  async sendOtpMail(fileObj: any) {
    const formData = new FormData();

    formData.append("tabRegEmailDtoString", fileObj);

    const url = (await serverUrl) + "sendOtpMailV2";
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

  async verifyOtp(tabRegEmailDto: any) {
    const formData = new FormData();

    formData.append("tabRegEmailDtoString", tabRegEmailDto);

    const url = (await serverUrl) + "verifyOtpV1";
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

  async updateWorkingStatus(requestDtoString: any) {
    const formData = new FormData();
    formData.append("requestDtoString", requestDtoString);
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'requestDto': requestDto};
    const url = (await serverUrl) + "updateWorkingStatus";
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

  checkIfCgSgMeItrMandatory() {
    const url = (serverUrl) + "checkIfCgSgMeItrMandatory";
    return this.httpClient.get<{
      itrMandatory: boolean;
      status: string;
      errorMessage: string;
    }>(url);
  }

  async updateAddress(requestDtoString: any, docId: any, currentAddress: any) {
    const formData = new FormData();
    formData.append("requestDtoString", requestDtoString);
    formData.append("docId", docId);
    formData.append("currentAddress", currentAddress);
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'requestDto': requestDto};
    const url = (await serverUrl) + "updateAddress";
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

  async updateSpousePanStatus(requestDtoString: any) {
    const formData = new FormData();
    formData.append("requestDtoString", requestDtoString);
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'requestDto': requestDto};
    const url = (await serverUrl) + "updateSpousePanStatus";
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

  async updateCaste(requestDtoString: any) {
    const formData = new FormData();
    formData.append("requestDtoString", requestDtoString);
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'requestDto': requestDto};
    const url = (await serverUrl) + "updateCaste";
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

  // OLD
  // async updateMarriedStatus(requestDtoString: any) {
  //   const formData = new FormData();
  //   formData.append("requestDtoString", requestDtoString);
  //   // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  //   // const data = {'requestDto': requestDto};
  //   const url = (await serverUrl) + "updateMarriedStatus";
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

  // NEW
  async updateMarriedStatus(fileObj: any, requestDtoString: any) {
    console.log("requestDtoString requestDtoString ", requestDtoString);
    console.log("fileObj", fileObj);

    const formData = new FormData();
    formData.append("fileObj", fileObj);
    formData.append("requestDtoString", requestDtoString);
    const url = (await serverUrl) + "updateMarriedStatus";
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

  async financialYearList(): Promise<any> {
    const url = (await serverUrl) + "financialYearList";
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(url, {}, { responseType: "json" })
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async ocrDisabledV3(img: any, ocrRequestDtoString: any) {
    const formData = new FormData();

    formData.append("fileObj", img);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);

    const url = (await serverUrl) + "ocrDisabledV3";
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

  // async ocrPmayV3(img: any, ocrRequestDtoString: any) {
  //   const formData = new FormData();

  //   formData.append("fileObj", img);
  //   formData.append("type", "image");
  //   formData.append("ocrRequestDtoString", ocrRequestDtoString);

  //   const url = (await serverUrl) + "ocrPmayV3";
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

  async ocrPredefinedDocs(img: any, ocrRequestDtoString: any, wsName: string) {
    const formData = new FormData();

    formData.append("fileObj", img);
    formData.append("type", "image");
    if (wsName == "uploadStateEmployeeV1") {
      formData.append("PredefinedDocRequestDtoString", ocrRequestDtoString);
    } else {
      formData.append("ocrRequestDtoString", ocrRequestDtoString);
    }

    const url = (await serverUrl) + wsName;
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

  async ocrMhadaEmployeeV2(img: any, ocrRequestDtoString: any) {
    const formData = new FormData();

    formData.append("fileObj", img);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);

    const url = (await serverUrl) + "ocrMhadaEmployeeV2";
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

  async loadQuestions() {
    const url = (await serverUrl) + "loadQuestionsV1";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, "")
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }

  async createDigilockerUrl(regId: any, deviceType: any) {
    const formData = new FormData();
    formData.append("regId", regId);
    formData.append("deviceType", deviceType);
    // const data = { regId: regId, deviceType: deviceType };
    const url = (await serverUrl) + "createDigilockerUrlV2";
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

  async createDigilockerUrlForSpouse(regId: any, deviceType: any) {
    const formData = new FormData();
    formData.append("regId", regId);
    formData.append("deviceType", deviceType);
    // const data = { regId: regId, deviceType: deviceType };
    const url = (await serverUrl) + "createDigilockerSpouseUrl";
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

  async getEaadharFromDigi(regId: any) {
    // const data = { regId: regId };
    const formData = new FormData();
    formData.append("requestDtoString", regId);
    const url = (await serverUrl) + "getEaadharFromDigiV4";
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

  async ocrAddressDocument(
    frontFileObj: any,
    ocrRequestDtoString: any,
    docId: any,
    wsName: any
  ) {
    const formData = new FormData();

    formData.append("fileObj", frontFileObj);
    formData.append("type", "image");
    formData.append("ocrRequestDtoString", ocrRequestDtoString);
    formData.append("docId", docId);
    const url = (await serverUrl) + wsName;
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

  async updateConsent(regId: any, pkQsid: any) {
    const formData = new FormData();
    formData.append("regId", regId);
    formData.append("qusId", pkQsid);

    const url = (await serverUrl) + "updateConsent";
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

  async verifyFamilyIncomeCert(
    requestDto: any,
    selfSpouseSw: any,
    itrIncome: any
  ) {
    const formData = new FormData();
    formData.append("requestDtoString", requestDto);
    formData.append("selfSpouseSw", selfSpouseSw);
    formData.append("itrIncome", itrIncome);

    const url = (await serverUrl) + "verifyFamilyIncomeCert";
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

  async updateMhadaWinner(requestDtoString: any) {
    const formData = new FormData();
    formData.append("requestDtoString", JSON.stringify(requestDtoString));
    const url = (await serverUrl) + "updateMhadaWinner";
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

  async verifyCasteCert(ocrResponse: any) {
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'barcode': barcode};
    const formData = new FormData();
    formData.append("requestDtoString", ocrResponse);
    const url = (await serverUrl) + "verifyCasteCert";
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

  async updateFcmToken(usrAndroidId: any) {
    const formData = new FormData();
    formData.append("usrAndroidId", usrAndroidId);
    const url = (await serverUrl) + "updateFcmToken";
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

  async uploadxService(
    fileObj: any,
    PredefinedDocRequestDtoString: any,
    docId: any
  ) {
    const formData = new FormData();

    formData.append("fileObj", fileObj);
    formData.append(
      "PredefinedDocRequestDtoString",
      PredefinedDocRequestDtoString
    );
    formData.append("docId", docId);
    const url = (await serverUrl) + "uploadxService";
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

  async updateDomicileApplicationToken(requestDtoString: any) {
    const formData = new FormData();
    formData.append("requestDtoString", JSON.stringify(requestDtoString));
    const url = (await serverUrl) + "updateDomicileApplicationToken";
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

  async updateWinnerStatus(requestDtoString: any, selfSpouseSw: any) {
    const formData = new FormData();
    formData.append("requestDtoString", JSON.stringify(requestDtoString));
    formData.append("selfSpouseSw", selfSpouseSw);
    const url = (await serverUrl) + "updateWinnerStatus";
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

  async verifyIncomeCertV1(
    requestDtoString: any,
    selfSpouseSw: any,
    itrIncome: any,
    itrAppName: any,
    itrYear: any,
    itrAcknowledgementNo: any,
    itrTotalIncome: any,
    isEditedYn: any
  ) {
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'barcode': barcode};
    const formData = new FormData();
    formData.append("requestDtoString", requestDtoString);
    formData.append("selfSpouseSw", selfSpouseSw);
    formData.append("itrIncome", itrIncome);

    formData.append("itrAppName", itrAppName);
    formData.append("itrYear", itrYear);
    formData.append("itrAcknowledgementNo", itrAcknowledgementNo);
    formData.append("itrTotalIncome", itrTotalIncome);
    formData.append("isEditedYn", isEditedYn);
    const url = (await serverUrl) + "verifyIncomeCertV1";
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

  async checkDigiDetails() {
    const url = (await serverUrl) + "checkDigiDetails";
    return new Promise((resolve) => {
      this.httpClient
        .post(url, { responseType: "text" })
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((resp: Response) => {
          resolve(resp);
        });
    });
  }

  async checkEmailDetails() {
    const url = (await serverUrl) + "checkEmailDetails";
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

  async getBannerImages() {
    const url = (await serverUrl) + "open/getBannerImages";
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

  async updateForAllowedWithCondition(requestDtoString: any, wsName: any) {
    const formData = new FormData();
    formData.append("requestDtoString", requestDtoString);
    const url = (await serverUrl) + wsName;
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

  async updateJournalist(PredefinedDocRequestDtoString: any) {
    const formData = new FormData();
    formData.append(
      "PredefinedDocRequestDtoString",
      PredefinedDocRequestDtoString
    );
    const url = (await serverUrl) + "updateJournalist";
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

  itrVerificationFirstAPI(captcha: string, qsCode: string) {
    const url = serverUrl + "itr-verification-first-api";

    return this.httpClient.post<{
      modeOfAuthentication: string;
      furtherApiCallRequired: boolean;
      status: string;
      errorMessage: string;
    }>(url, { captcha, qsCode });
  }

  itrVerificationSecondAPI(otp_password: string, qsCode: string) {
    const url = serverUrl + "itr-verification-second-api";

    return this.httpClient.post<{
      status: string;
      errorMessage: string;
      successMsg: string;
      verificationStatus: string;
    }>(url, { otp_password, qsCode });
  }

  async getSpouseEaadharFromDigi(regId: any) {
    // const data = { regId: regId };
    const formData = new FormData();
    formData.append("requestDtoString", regId);
    const url = (await serverUrl) + "getSpouseEaadharFromDigi"; // getEaadharFromDigiV4 to getSpouseEaadharFromDigi
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
  
  async fetchSpouseIncome(requestDtoString: any) {
    const formData = new FormData();
    formData.append("requestDtoString", requestDtoString);
    // const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    // const data = {'requestDto': requestDto};
    const url = (await serverUrl) + "fetchSpouseIncome";
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
}
