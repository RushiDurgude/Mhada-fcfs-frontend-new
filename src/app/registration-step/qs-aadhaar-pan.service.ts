import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { serverUrl } from "src/app/serverurl";

@Injectable({
    providedIn: "root",
})
export class AadhaarPanDigiLockerService {
    
    constructor(
      private http: HttpClient,
      private toastController: ToastController,
      private translocoService: TranslocoService,
    ) {}

    proceedToDigiLocker(questionCode: string) {
        return this.http.get<{status : string; errorMessage: string; url: string; key : number;}>(serverUrl + "digi-locker/" + questionCode);
    }
    
    getEAadhaarFromDigiLocker(key: number) {
        return this.http.get<{status : string, errorMessage: string}>(serverUrl + "digi-locker/get/" + key);
    }
   
    getMultiNames(questionCode: string) {
        return this.http.get<{ status: string; errorMessage: string; panName: string; digiName: string }>(serverUrl + "digi-locker/multi-name/" + questionCode);
    }
    
    saveMultiNameQuestion(questionCode : string, otherNamesString: any){
        return this.http.post<{ status: string; errorMessage: string;}>(serverUrl + "digi-locker/save-multi-name/" + questionCode, otherNamesString);
    }

    fetchSpousePanNew(panNumber: string, captcha: string) {
        let url = serverUrl+"digi-locker/get-pan?panNumber="+panNumber;
    
        return this.http.post<{
          name: string,
          number: string,
          digiName: string,
          status: string,
          isNameMatched: string,
          errorMessage: string
        }>(url, captcha);
    }

    saveSpousePanConsent(panNumber : string, consentFlag: any){
        let consent = consentFlag ? 'Y' : 'N';
        return this.http.post<{status: string; errorMessage: string;}>(serverUrl + "digi-locker/save-spouse-pan-consent?panNumber=" + panNumber, consent);
    }

    async showErrorMessage(msg: string, server: boolean, duration?: number) {
        const toast = await this.toastController.create({
            message: server ? msg : this.translocoService.translate(msg),
            icon: "information-circle",
            position: "top",
            cssClass: "toast error-toast",
            duration: duration ? duration : 4000,
        });
        toast.present();
    }
    
    async frontendWarningToast(msg: string, translationRequired?: boolean) {
        const toast = await this.toastController.create({
            message: translationRequired ? this.translocoService.translate(msg) : msg,
            icon: "information-circle",
            position: "top",
            cssClass: "toast warning-toast",
            duration: 10000,
        });
        toast.present();
    }
    
}