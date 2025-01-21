/* eslint-disable eqeqeq */
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { CheckTokenService } from "../auth-guard/check-token.service";
import { MyGrievancesComponent } from "../grievance/lottory-user/my-grievances/my-grievances.component";
import { MyObjectionSuggestionComponent } from "../grievance/lottory-user/objsuggestion/my-objection-suggestion/my-objection-suggestion.component";
import { LoaderComponent } from "../loader/loader.component";
import { ProfileService } from "../profile/profile.service";
import { SharedService } from "./shared.service";
import { ThemeService } from "../theme.service";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent implements OnInit {
  activeLang: string = "en";
  progressSpinnerDialog: any = null;
  platform: string = localStorage.getItem("platform");
  helplineNo: any = null;
  userName: string = "";
  userPhoto: any = null;
  isLoggedIn: boolean = false;
  count : number = 0;
  isDarkMode: boolean;
  isLandingPage: boolean = false;

  constructor(
    public router: Router,
    public toastController: ToastController,
    private service: TranslocoService,
    private sharedService: SharedService,
    private profileService: ProfileService,
    private dialog: MatDialog,
    public callLan: MyGrievancesComponent,
    public objectionList: MyObjectionSuggestionComponent,
    private authService: CheckTokenService,
    private domSanitizer: DomSanitizer,
    private themeService: ThemeService,
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit() {
    this.sharedService.changeName(this.activeLang);
    this.getHelplineNumbers();

    this.sharedService.authFlag.subscribe((flag) => {
      if (flag == true) {
        this.getUserDetails();
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
    this.router.events.subscribe(() => {
      this.isLandingPage = this.router.url === '/';
    //  this.isLandingPage = this.router.url === '/landing';

    });
  }

  async toProfileNew() {
    console.log('this.authService.isAuthenticateUser()', this.authService.isAuthenticateUser());
    if (this.authService.isAuthenticateUser()) {
      localStorage.removeItem("editQuestionCode");
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(["/registration-step"], { replaceUrl: true });
    }
  }

  async toProfile() {
    if (this.authService.isAuthenticateUser()) {
      if (
        this.router.url == "/successStatus" ||
        this.router.url == "/failureStatus" ||
        this.router.url == "/cancelledStatus" ||
        this.router.url.startsWith("/app") ||
        this.router.url.startsWith("/cert-entry") ||
        this.router.url == "/notifications" ||
        this.router.url == "/my-grievances" ||
        this.router.url.startsWith("/noc") ||
        this.router.url == "/contact-us" ||
        this.router.url == "/raise-grievance" ||
        this.router.url == "/privacy-policy" ||
        this.router.url.startsWith("/view-grievance") ||
        this.router.url == "/create-objection-suggestion" ||
        this.router.url == "/my-objection-suggestion" ||
        this.router.url.startsWith("/view-objection-suggestion")
      ) {
        // this.router.navigate(["/profile"]);
        this.getDocuments();
      } else if (this.router.url != "/profile" && this.router.url != "/eSignSelfDeclaration") {
        let questionId = localStorage.getItem("pkQsid");
        if (questionId != null && +questionId >= 6) {
          // this.router.navigate(["/profile"]);
          this.getDocuments();
        } else {
          const toast = await this.toastController.create({
            message: this.service.translate("mandatory-doc"),
            icon: "information-circle",
            position: "top",
            cssClass: "toast warning-toast",
            duration: 4000,
          });
          toast.present();
        }
      }
    }
  }

  async startNow(): Promise<void> {
    this.router.navigate(['/signUp'], { replaceUrl: true });
  }

  changeLang() {
    if (this.activeLang == "en") {
      this.activeLang = "mr";
      this.service.setActiveLang("mr");
    } else {
      this.activeLang = "en";
      this.service.setActiveLang("en");
    }
    this.sharedService.changeName(this.activeLang);
    this.callLan.checkActiveLanguageForDatatable();
    this.objectionList.checkActiveLanguageForObjDatatable();
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async getHelplineNumbers() {
    this.helplineNo = null;
    const response: any = await this.sharedService.getHelplineNumbers();
    if (response.length > 0) {
      this.helplineNo = response[0].lovMediaLink;
    }
  }

  async getUserDetails() {
    const response: any = await this.sharedService.getUserDetails();
    if (response != null) {
      this.userName = response.name;
      localStorage.setItem("username", this.userName);
      this.userPhoto = this.domSanitizer.bypassSecurityTrustResourceUrl("data:image/jpg;base64," + response.photo);
    }
  }

  async getDocuments() {
    let counter = 0;
    this.displayProgressSpinner();
    const response: any = await this.profileService.getProfileDetails(localStorage.getItem("regId"));
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      // response.pop();
      // response.sort((a, b) => a.pkQsid - b.pkQsid).reverse();
      if (response.length > 0) {
        let profileDetail = response.pop();
        if (profileDetail[0]["isProfileActive"] == "N") {
          localStorage.clear();
          this.sharedService.setAuthentication(false);
          this.router.navigate(["/"]);
          window.location.reload();
        }
        for (let i = 0; i < response.length; i++) {
          if (
            response[i]["pkQsid"] == "1" ||
            response[i]["pkQsid"] == "2" ||
            response[i]["pkQsid"] == "3" ||
            response[i]["pkQsid"] == "4" ||
            response[i]["pkQsid"] == "5"
          ) {
            if (response[3]["qsCode"] == "Q_CENTRAL" && response[3]["qs_ans"] == "Yes") {
              response[6]["qs_ans_status"] = "Not Applicable";
            }
            // if (response[i]["qsCode"] == "Q_CENTRAL" && response[i]["qs_ans"] == "Yes") {
            //   console.log(response[i]);

            //   response[21]["qs_ans_status"] = "Not Applicable"; // domicile
            //   response[8]["qs_ans_status"] = "Not Applicable"; // state
            //   response[7]["qs_ans_status"] = "Not Applicable"; // mhada
            // } else if (response[i]["qsCode"] == "Q_STATE" && response[i]["qs_ans"] == "Yes") {
            //   response[9]["qs_ans_status"] = "Not Applicable"; // central
            //   response[7]["qs_ans_status"] = "Not Applicable"; // mhada
            // } else if (response[i]["qsCode"] == "Q_MHADA" && response[i]["qs_ans"] == "Yes") {
            //   response[9]["qs_ans_status"] = "Not Applicable"; // central
            //   response[8]["qs_ans_status"] = "Not Applicable"; // state
            // }
            else if (response[i]["qs_ans_status"] == null || response[i]["qs_ans_status"] == "Not Answered") {
              counter++;
            }
          }
        }
        if (counter > 0) {
          const toast = await this.toastController.create({
            message: this.service.translate("mandatory-doc"),
            icon: "information-circle",
            position: "top",
            cssClass: "toast warning-toast",
            duration: 4000,
          });
          toast.present();
        } else {
          this.router.navigate(["/profile"]);
        }
      } else {
        // this.warningToast(response.error);
      }
    } else {
      if (response.error.message != undefined) {
        if (response.error.message.includes("JWT expired")) {
          if (this.platform == "browser" || this.platform == "browser-local") {
            alert("Security Token is expired, please relogin with DigiLocker");
            localStorage.clear();
            this.sharedService.setAuthentication(false);
            this.router.navigate(["/landing"]);
            window.location.reload();
          } else {
            const response: any = await this.profileService.refreshtoken();
            localStorage.setItem("token", response.token);
            this.sharedService.setAuthentication(true);
            // window.location.reload();
            this.ngOnInit();
          }
        } else {
          const toast = await this.toastController.create({
            message:
              "There was network related or instance related error understanding the request. Please try doing it again.",
            icon: "information-circle",
            position: "top",
            cssClass: "toast error-toast",
            duration: 5000,
          });
          toast.present();
        }
      }
    }
  }

  async getShowInfoFlag() {
    await this.sharedService.getShowInfoFlag().subscribe((response: any) => {
      if (!response.error) {
        if (response.status.toLowerCase() == "yes") {
          this.router.navigate(["/landing"]);
        } else {
          this.router.navigate(["/"]);
        }
      } else {
        console.log(response.message);
      }
    });
  }

  

  increaseFontSize() {
    if (this.count < 3) {
        this.count++;
        this.themeService.setFontSize(this.count);
    }
  }

  resetFontSize() {
    this.count = 0;
    this.themeService.setFontSize(0);
  }

  decreaseFontSize() {
      if (this.count > -3) {
          this.count--;
          this.themeService.setFontSize(this.count);
      }
  }

  // Added by Lucifer
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
  }
}
