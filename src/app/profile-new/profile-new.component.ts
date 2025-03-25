import { Component, OnInit,} from "@angular/core";
import { RegistrationStepService } from "../registration-step/registration-step.service";
import { ProfileResponse } from "../registration-step/models/profile-response.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "../loader/loader.component";
import { SharedService } from "../toolbar/shared.service";
import { ProfileDocumentModel } from "../registration-step/models/profile-document.model";
import { ActionSheetController } from "@ionic/angular";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ViewDocumentNewComponent } from "../profile/view-document-new/view-document-new.component";
import { Router } from "@angular/router";
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { ViewESignedDocumentComponent } from "../profile/view-e-signed-document/view-e-signed-document.component";

@Component({
  selector: "app-profile-new",
  templateUrl: "./profile-new.component.html",
  styleUrls: ["./profile-new.component.scss"],
})
export class ProfileNewComponent implements OnInit {
  esigned: boolean = false;
  progressSpinnerDialog: any = null;
  profile: ProfileResponse;
  activeLangIndex: number;
  photo: SafeResourceUrl;

  constructor(private registrationStepService: RegistrationStepService, private dialog: MatDialog,
    private sharedService: SharedService, public actionSheetController: ActionSheetController,
    private domSanitizer: DomSanitizer, private router: Router, private iab: InAppBrowser,
  ) {}
  
  ngOnInit(): void {
    this.displayProgressSpinner();
    this.registrationStepService.getQuestionProfiles()
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        this.profile = data;
        this.esigned = data.esigned;
        this.fetchPhoto();
      }
      else {
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, error => {
      this.closeProgressSpinner();
      this.registrationStepService.frontendWarningToast("warning-unable-to-fetch-profile-details", true);
    });

    this.checkActiveLanguage();
  }

  fetchPhoto() {
    this.registrationStepService.fetchPhoto()
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        const byteArray = new Uint8Array(
          atob(data.fileBase64)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        let blob = new Blob([byteArray], { type: "image/png" });
        this.photo = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      }
      else {
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, error => {
      this.closeProgressSpinner();
    });
  }

  eSign() {
    this.displayProgressSpinner();
    this.registrationStepService.esignAffidavit(localStorage.getItem("platform"))
    .subscribe((data) => {  
      this.progressSpinnerDialog.close();
      if (data.status == 'SUCCESS') {
        const options: InAppBrowserOptions = {
          zoom: "no",
          hideurlbar: "yes",
          toolbar: "no",
          location: "no",
        };
        let target = "";
        const deviceType = localStorage.getItem("platform");
        if (deviceType == "ios") {
          target = "_blank";
        } else {
          target = "_self";
        }
        const browser = this.iab.create(data.url, target, options);
        browser.on("loadstart").subscribe((ev: InAppBrowserEvent) => {
          if (ev.url.startsWith("http://localhost/profile")) {
            browser.close();
            this.registrationStepService.successToast("e-Sign successful");
            localStorage.setItem("eSign", "true");
            window.location.reload();
          } else if (
            ev.url.startsWith("https://cidcohousing.probitysoftware.in/profile") ||
            ev.url.startsWith("https://uatilms.mhada.gov.in/profile") ||
            ev.url.startsWith("http://localhost:8100/profile") ||
            ev.url.startsWith("https://housing.pmrda.gov.in/profile") ||
            ev.url.startsWith("https://sqtchousing.mhada.gov.in/profile")
          ) {
            browser.close();
            this.registrationStepService.successToast("e-Sign successful");
            localStorage.setItem("eSign", "true");
            window.location.reload();
          }
        });
      } else {
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, error => {
      this.closeProgressSpinner();
      this.registrationStepService.frontendWarningToast("warning-unable-to-esign", true);
    });
    
  }

  downloadEsign() {
    this.registrationStepService.fetchEsignedAffidavit()
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        setTimeout(() => {
          const eSignDoc = this.dialog.open(ViewESignedDocumentComponent, {
            disableClose: true,
            width: "600px",
            data: [data.fileBase64, "Esigned Affidavit"],
          });
          eSignDoc.afterClosed().subscribe((result) => {
            if (result == "downloaded") {
              this.registrationStepService.successToast("PDF downloaded.");
            }
          });
        }, 100);
      }
      else {
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, error => {
      this.closeProgressSpinner();
    });

  }

  apply() {
  //  this.router.navigate(["/app", "select-lottery", "1"], { replaceUrl: true });
    this.router.navigate(["/app", "select-board"], { replaceUrl: true });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
        disableClose: true,
        panelClass: "progressSpinner",
    });
  }

  async closeProgressSpinner() {
    if(this.progressSpinnerDialog) {
      this.progressSpinnerDialog.close();
    }
  }

  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      if(data == "en") {
        this.activeLangIndex = 0;
      } 
      else if(data == "mr") {
        this.activeLangIndex = 1;
      } 
      else {
        this.activeLangIndex = 0;
      }
    });
  }

  async presentActionSheet(document: ProfileDocumentModel) {
    let actionSheetOptions = [
      {
        cssClass: "first-button",
        text: "View",
        icon: "eye",
        data: 10,
        handler: () => {
          this.viewDocument(document);
        },
      },
      {
        text: "Edit",
        icon: "create",
        data: "Data value",
        handler: () => {
          this.editRecord(document);
        },
      },
      {
        cssClass: "last-button",
        text: "Cancel",
        icon: "close",
        role: "cancel",
        handler: () => {
          
        },
      },
    ];
    actionSheetOptions = actionSheetOptions.filter(a => a.text !== 'Edit' || (a.text == 'Edit' && document.editable == 'Y'));
    const actionSheet = await this.actionSheetController.create({
      header: document.displayOnProfile.split("|||")[this.activeLangIndex] + " - ( " + document.verificationStatus + " )",
      cssClass: "my-custom-class",
      buttons: actionSheetOptions,
    });
    await actionSheet.present();
  }

  async viewDocument(document: ProfileDocumentModel) {
    this.registrationStepService.fetchQuestionDoc(document.questionCode)
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        const byteArray = new Uint8Array(
          atob(data.fileBase64)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        if(data.fileType == 'IMAGE') {
          let blob = new Blob([byteArray], { type: "image/png" });
          let fileURL = URL.createObjectURL(blob);
          setTimeout(() => {
            let imageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.progressSpinnerDialog = this.dialog.open(ViewDocumentNewComponent, {
              disableClose: true,
              width: "600px",
              data: [document.displayOnProfile.split('|||'), document.answer, imageUrl, null],
            });
          }, 100);
        }
        else if(data.fileType == 'PDF') {
          let file = new Blob([byteArray], {type: 'application/pdf'});
          setTimeout(() => {
            let selectedPdf = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file));
            this.progressSpinnerDialog = this.dialog.open(ViewDocumentNewComponent, {
              disableClose: true,
              width: "600px",
              data: [document.displayOnProfile.split('|||'), document.answer, null, null, selectedPdf],
            });
          }, 100);
        }
      }
      else {
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, error => {
      this.closeProgressSpinner();
    });
  }

  editRecord(document: ProfileDocumentModel) {
    this.displayProgressSpinner();
    this.registrationStepService.editProfileQuestion(document.questionCode)
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        localStorage.setItem("editQuestionCode", data.questionCode);
        this.router.navigate(["/registration-step"], { replaceUrl: true });
      }
      else {
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, error => {
      this.closeProgressSpinner();
      this.registrationStepService.frontendWarningToast("warning-unable-to-edit-document", true);
    });
  }

}
