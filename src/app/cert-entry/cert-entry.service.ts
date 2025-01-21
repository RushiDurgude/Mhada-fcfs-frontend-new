import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { CertIssuingAuthorityModel } from "../pre-lottery/models/cert-issuing-authority,model";
import { api_url } from "../pre-lottery/services/pre-lottery-application.service";
import { SharedService } from "../toolbar/shared.service";

export const categories: {[key: string]: {en: string, mr: string}} = {
    // 'AR': {en: 'Artist (AR)', mr: 'कलाकार (AR)'},
    // 'CG': {en: 'Central Government (CG)', mr: 'केंद्रीय कर्मचारी (CG)'},
    // 'DF': {en: 'Defence Family (DF)', mr: 'लढाईत मृत झालेल्यांचे कौटुंबिय अथवा जायबंदी होऊन अपंग झालेले कर्मचारी (DF)'},
    'EX': {en: 'Ex-Serviceman (EX)', mr: 'माजी सैनिक (EX)'},
    // 'FF': {en: 'Freedom Fighter (FF)', mr: 'स्वातंत्र्य सैनिक व त्याचे वारसदार (FF)'},
    'JR': {en: 'Journalist (JR)', mr: 'पत्रकार (JR)'},
    // 'MP_MLA_MLC': {en: 'Member of Parliament / Member of Mahrashtra Legislature (MP/ MLA/ MLC)',
    //     mr: 'संसद सदस्य / विधानमंडळ सदस्य (MP/ MLA/ MLC)'},
    'SG': {en: 'State Government (SG)', mr: 'राज्य सरकारी कर्मचारी (SG)'},
};

@Injectable({
    providedIn: "root",
})
export class CertEntryService {    
    constructor(
        private http: HttpClient,
        private toastController: ToastController,
        private translocoService: TranslocoService,
        private router: Router,
        private sharedService: SharedService,
        private _snackBar: MatSnackBar
    ) {}

    loginWithPAN(pan: string, captchaResponse: string) {
        return this.http.post<{
            type: string,
            status: string,
            errorMessage: string
        }>(api_url + "/cert-entry/pan-validation", {
            pan,
            captchaResponse
        });
    }

    initEmailForWithPAN(pan: string) {
        return this.http.get<{
            emailId: string, status: string, errorMessage: string
        }>(api_url + "/cert-entry/init-email/" + pan);
    }

    issuingAuthority() {
        return this.http.get<CertIssuingAuthorityModel>(api_url + "/cert-entry/issuing-authority/");
    }

    submitEmailForPAN(pan: string, emailId: string) {
        return this.http.post<{
            status: string, errorMessage: string
        }>(api_url + "/cert-entry/email-submit/" + pan, {
            emailId
        });
    }

    initCategoryFormForPAN(pan: string, category: string) {
        return this.http.get<any>(api_url + "/cert-entry/init-category/" + pan + "/" + category);
    }

    submitCategoryFormWithPAN(pan: string, category: string, categoryRequest: any) {
        return this.http.post<{
            status: string, 
            errorMessage: string
        }>(api_url + "/cert-entry/category-submit/" + pan + "/" + category, {
            ...categoryRequest
        });
    }

    fetchCategoryCertificate(pan: string, category: string) {
        return this.http.get<{ status: string; data: string; errorMessage: string }>(
            api_url + "/cert-entry/category-cert/" + pan + "/" + category
        );
    }

    emailCategoryCertificate(pan: string, category: string) {
        return this.http.get<{ status: string; data: string; errorMessage: string }>(
            api_url + "/cert-entry/category-cert/email/" + pan + "/" + category
        );
    }

    async successToast(msg) {
        await this._snackBar.open(
            msg,
            "Close", {
            horizontalPosition: "right",
            verticalPosition: "top",
            panelClass: "success-toast1",
            duration: 3 * 1000,
            }
        );
    }

    async showErrorToast(errorMessage: string) {
        const toast = await this.toastController.create({
            message: errorMessage,
            icon: "information-circle",
            position: "top",
            cssClass: "toast error-toast",
            duration: 4000,
        });
        toast.present();
    }
}

