import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { Router } from "@angular/router";
import { AadhaarPanDigiLockerService } from "../qs-aadhaar-pan.service";

@Component({
  selector: "app-qs-aadhaar-pan",
  templateUrl: "./qs-aadhaar-pan.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsAadhaarPanComponent implements OnInit {
  questionCode: string = 'Q_AADHAR';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  loadCounter: number;
  @Output() proceedNext = new EventEmitter();

  constructor(
    private aadhaarPanDigiLockerService: AadhaarPanDigiLockerService,
    private iab: InAppBrowser,
    private router: Router,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.load();
    // localStorage.setItem("lastRoute", "/registration-step");
    // let url = this.aadhaarPanDigiLockerService.proceedToDigiLocker(this.questionCode);
  }

  load() {
    this.aadhaarPanDigiLockerService.proceedToDigiLocker(this.questionCode).subscribe(data => {
      console.log(data);
      if(data.status == 'SUCCESS') {

        let url = data?.url;
        let target = "";
        let options: InAppBrowserOptions = {
          zoom: "no",
          hideurlbar: "yes",
          toolbar: "no",
          location: "no",
          hidenavigationbuttons: "no",
          usewkwebview: "yes",
        };
        if (localStorage.getItem("platform") == "ios") {
          target = "_blank";
        } else {
          target = "_self";
        }
        localStorage.removeItem("lastRoute");
        const browser = this.iab.create(url, target, options);
        browser.on("loadstart").subscribe((ev: InAppBrowserEvent) => {
          console.log('onload stop--' + ev.url);
          if (ev.url.startsWith("http://localhost:8100/registration-step/digi-locker-test")
          ) {
            browser.close();
            this.progressSpinnerDialog.close();
            localStorage.setItem("lastRoute", "/registration-step/digi-locker-test");
            this.router.navigate(['/registration-step', 'digi-locker-test', data?.key], { replaceUrl: true });
            window.location.reload();
          }
        });

      } else {
        this.aadhaarPanDigiLockerService.showErrorMessage(data.errorMessage, true);
      }
    }, async error => {
      this.closeProgressSpinner();
      console.log(error);
      this.aadhaarPanDigiLockerService.frontendWarningToast("error-try-again");
      if (this.loadCounter < 1) {
        this.loadCounter++;
        // this.load();
      }
    });
    
  }

  // TODO 
  async proceed() {
    
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
        disableClose: true,
        panelClass: "progressSpinner",
    });
  }

  async closeProgressSpinner() {
    this.progressSpinnerDialog.close;
  }
}