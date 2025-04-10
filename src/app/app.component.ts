/* eslint-disable eqeqeq */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { App } from "@capacitor/app";
import { AlertController, ModalController, Platform, ToastController, ViewDidEnter } from "@ionic/angular";
import { NetworkInterface } from "@awesome-cordova-plugins/network-interface/ngx";
import { HttpClient } from "@angular/common/http";
import { ChatbotComponent } from "./chatbot/chatbot.component";
import { SharedService } from "./toolbar/shared.service";
import { appVersion, appIosVersion } from "./appversion";
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from "@capacitor/push-notifications";
import { PrivacyScreen } from "@capacitor-community/privacy-screen";
// import { HTTP } from "@ionic-native/http/ngx";
import { AuthenticationService } from "./authentication/authentication.service";
import { CheckTokenService } from "./auth-guard/check-token.service";
import { GoogleAnalyticsService } from "./toolbar/google-analytics.service";
import { ThemeService } from "./theme.service";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  providers: [NetworkInterface],
})
export class AppComponent implements ViewDidEnter {
  window: any = window;

  counter = 0;
  lastBack: any = null;
  isGoToTopBtnVisible: boolean = false;
  authFlag: boolean = false;
  digiLastLoginDate: any = "";
  devicePlatform: string = "";

  isDarkMode: boolean;
  constructor(
    public alertController: AlertController,
    public router: Router,
    public toastController: ToastController,
    private platform: Platform,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private sharedService: SharedService,
    // private ionicHttp: HTTP,
    private authenticationService: AuthenticationService,
    private checkToken: CheckTokenService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private themeService: ThemeService
  ) {
    if (localStorage.getItem("platform") == "android" || localStorage.getItem("platform") == "ios") {
      // this.initializeApp();
      this.checkLastRoute();
    } else {
      this.checkLastRoute();
    }

    this.isDarkMode = this.themeService.isDarkMode();
    console.log('this AppComponent',this.isDarkMode);
  }

  // async initializeApp() {
  //   this.platform.ready().then(() => {
  //     console.log("[LOG] Platform Ready!");
  //     this.ionicHttp
  //       .setServerTrustMode("pinned")
  //       .then(() => {
  //         alert("PINNED");
  //         console.log("[SUCCESS] SSL Pinning Starts!");
  //         return this.checkLastRoute();
  //       })
  //       .catch((err: any) => {
  //         alert("error");
  //         console.log("[ERROR] SSL Pinning Fails! ", err);
  //       });
  //   });
  // }

  // async getTest() {
  //   alert("vghbjn");
  //   const response = await this.authenticationService.getTest();
  //   alert(JSON.stringify(response));
  //   console.log(response);
  // }
  async checkLastRoute() {
    this.googleAnalyticsService.startTrackerWithId("G-Q5M810MKKM");
    if (
      window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/") ||
      window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") ||
      window.location.href.toString().startsWith("https://housing.pmrda.gov.in/") ||
      window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/") 
    ) {
      localStorage.setItem("platform", "browser");
    } else if (window.location.href.toString().startsWith("http://localhost:8100")) {
      localStorage.setItem("platform", "browser-local");
    } else if (window.location.href.toString().startsWith("capacitor://localhost")) {
      localStorage.setItem("platform", "ios");
    } else {
      localStorage.setItem("platform", "android");
    }
    this.devicePlatform = localStorage.getItem("platform");

    if (this.previousAppVersionDetected == false) {
      App.addListener("backButton", ({ canGoBack }) => {
        if (this.previousAppVersionDetected == false) {
          this.alertController.dismiss();
          this.showExitConfirm();
        }
      });
    }

    if (localStorage.getItem("token") != null) {
      this.sharedService.setAuthentication(true);
    }

    this.sharedService.authFlag.subscribe((flag) => {
      this.authFlag = flag;
    });

    if (this.checkToken.isAuthenticateUser() == true) {
      this.getLastDigiLockerLoginDate();
    }
    this.ionViewDidEnter();
  }

  ionViewDidEnter() {
    if (localStorage.getItem("platform") == "android" || localStorage.getItem("platform") == "ios") {
      this.checkIfRootedDevice();
    } else {
      this.lastRouteCheck();
    }
  }

  checkIfRootedDevice() {
    window["IRoot"].isRooted(
      (res) => {
        if (res == true) {
          alert("This device is rooted.");
          setTimeout(() => {
            App.exitApp();
          }, 100);
        } else {
          if (localStorage.getItem("platform") == "android") {
            this.firebasePushNotifications();
          }
          this.disablePrivacyScreen();
          this.checkAppVersion();
          App.addListener("appStateChange", ({ isActive }) => {
            if (isActive == true) {
              this.checkAppVersion();
            }
          });
          this.lastRouteCheck();
        }
      },
      function (err) {
        alert("error : " + JSON.stringify(err));
      }
    );
  }

  lastRouteCheck() {
    if (localStorage.getItem("lastRoute") != null) {
      localStorage.removeItem("filter");
      if (
        window.location.href.toString().startsWith("http://localhost/successStatus") ||
        window.location.href.toString().startsWith("http://localhost/failureStatus") ||
        window.location.href.toString().startsWith("http://localhost/cancelledStatus")
      ) {
        let url: any = window.location.href;
        let route = url.split("/");
        localStorage.setItem("lastRoute", "/" + route.pop());
        var lastRoute = localStorage.getItem("lastRoute");
        this.router.navigate([lastRoute], { replaceUrl: true });
      } else if (
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/question-answer?requestId=") ||
        window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/question-answer?requestId=") ||
        window.location.href.toString().startsWith("http://localhost:8100/question-answer?requestId=") ||
        window.location.href.toString().startsWith("http://localhost/question-answer?requestId=") ||
        window.location.href.toString().startsWith("capacitor://localhost/question-answer?requestId=") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/question-answer?requestId=") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/question-answer?requestId=") 
      ) {
        // for browser / android
        this.afterDigiRouteToQuestionAnswer();
      } 
      else if (
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/question-answer/spouse?requestId=") ||
        window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/question-answer/spouse?requestId=") ||
        window.location.href.toString().startsWith("http://localhost:8100/question-answer/spouse?requestId=") ||
        window.location.href.toString().startsWith("http://localhost/question-answer/spouse?requestId=") ||
        window.location.href.toString().startsWith("capacitor://localhost/question-answer/spouse?requestId=") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/question-answer/spouse?requestId=") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/question-answer/spouse?requestId=") 
      ) {
        // for browser / android
        this.afterSpouseDigiRouteToQuestionAnswer();
      } 
      else if (
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/profile?success=true") ||
        window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/profile?success=true") ||
        window.location.href.toString().startsWith("http://localhost:8100/profile?success=true") ||
        window.location.href.toString().startsWith("http://localhost/profile?success=true") ||
        window.location.href.toString().startsWith("capacitor://localhost/profile?success=true") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/profile?success=true") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/profile?success=true")
      ) {
        localStorage.setItem("lastRoute", "/profile");
        localStorage.setItem("eSign", "true");
        this.router.navigate(["/profile"], { replaceUrl: true });
      } else if (
        window.location.href.toString().startsWith("http://localhost:8100/app/payment-verify") ||
        window.location.href.toString().startsWith("http://localhost/app/payment-verify") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/app/payment-verify") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/app/payment-verify") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/app/payment-verify") ||
        window.location.href.toString().startsWith("capacitor://localhost/app/payment-verify")||
        window.location.href.toString().startsWith("http://localhost:8100/app/esign-verify") ||
        window.location.href.toString().startsWith("http://localhost/app/esign-verify") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/app/esign-verify") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/app/esign-verify") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/app/esign-verify") ||
        window.location.href.toString().startsWith("capacitor://localhost/app/esign-verify") || 
        window.location.href.toString().startsWith("http://localhost:8100/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("http://localhost/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("capacitor://localhost/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("http://localhost:8100/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("http://localhost/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("capacitor://localhost/app/noc-payment-verify")
      ) {
      } else if (
        window.location.href.toString().startsWith("http://localhost:8100/cert-entry") ||
        window.location.href.toString().startsWith("http://localhost/cert-entry") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/cert-entry") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/cert-entry") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/cert-entry") ||
        window.location.href.toString().startsWith("capacitor://localhost/cert-entry")
      ) {
      }
      else if (
        localStorage.getItem("lastRoute") == "/signUp" && localStorage.getItem("loginPan")
      ) {
        localStorage.removeItem("lastRoute");
        localStorage.removeItem("loginPan");
        localStorage.removeItem("otpResendTimeLeft");
        localStorage.removeItem("otpVerificationPending");
        this.router.navigate(["/"]);
      } else {
        var lastRoute = localStorage.getItem("lastRoute");
        this.router.navigate([lastRoute], { replaceUrl: true });
      }
    } else {
      if (
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/privacy-policy") ||
        window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/privacy-policy") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/privacy-policy") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/privacy-policy") 
      ) {
        this.router.navigate(["/privacy-policy"]);
      } else if (
        window.location.href.toString().startsWith("http://localhost:8100/app/payment-verify") ||
        window.location.href.toString().startsWith("http://localhost/app/payment-verify") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/app/payment-verify") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/app/payment-verify") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/app/payment-verify") ||
        window.location.href.toString().startsWith("capacitor://localhost/app/payment-verify")||
        window.location.href.toString().startsWith("http://localhost:8100/app/esign-verify") ||
        window.location.href.toString().startsWith("http://localhost/app/esign-verify") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/app/esign-verify") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/app/esign-verify") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/app/esign-verify") ||
        window.location.href.toString().startsWith("capacitor://localhost/app/esign-verify") ||
        window.location.href.toString().startsWith("http://localhost:8100/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("http://localhost/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("capacitor://localhost/app/installment-payment-verify") ||
        window.location.href.toString().startsWith("http://localhost:8100/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("http://localhost/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/app/noc-payment-verify") ||
        window.location.href.toString().startsWith("capacitor://localhost/app/noc-payment-verify")
      ) {
      } else if (
        window.location.href.toString().startsWith("http://localhost:8100/cert-entry") ||
        window.location.href.toString().startsWith("http://localhost/cert-entry") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/cert-entry") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/cert-entry") ||
        window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/cert-entry") ||
        window.location.href.toString().startsWith("capacitor://localhost/cert-entry")
      ) {
      } else if (
        window.location.href.toString().startsWith("http://localhost:8100/registration-step") ||
        window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/registration-step") ||
        window.location.href.toString().startsWith("https://housing.pmrda.gov.in/registration-step")
      ) {
        this.router.navigate(["/registration-step"]);
      } else {
        this.router.navigate(["/"]);
      }
    }
  }

  async disablePrivacyScreen() {
    const disable = await PrivacyScreen.disable();
  }

  firebasePushNotifications() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });
    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token: Token) => {
      // alert("Push registration success, token: " + token.value);
      localStorage.setItem("firebase-token", token.value);
    });
    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error: any) => {
      // alert("Error on registration: " + JSON.stringify(error));
    });
    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
      // alert("Push received: " + JSON.stringify(notification));
    });
    // Method called when tapping on a notification
    PushNotifications.addListener("pushNotificationActionPerformed", (notification: ActionPerformed) => {
      this.router.navigate(["/notifications"], { replaceUrl: true });
      // alert("Push action performed: " + JSON.stringify(notification));
    });
  }

  afterDigiRouteToQuestionAnswer() {
    let status = window.location.href.split("&");
    if (status[1].split("=")[1] == "failure") {
      localStorage.clear();
      this.sharedService.setAuthentication(false);
      // localStorage.setItem("callDigi", "false");
      // localStorage.setItem("lastRoute", "/registration-step");
      // this.router.navigate(["/registration-step"], { replaceUrl: true });
      this.router.navigate(["/"], { replaceUrl: true });
    } else {
      let requestId = status[0].split("=");

      localStorage.removeItem("spouseDigiRequestId");
      localStorage.removeItem("callSpouseDigi");
      localStorage.removeItem("callSpouseEaadhar");

      localStorage.setItem("digiRequestId", requestId[1]);
      localStorage.setItem("lastRoute", "/registration-step");
      localStorage.setItem("callDigi", "true");
      localStorage.setItem("callEaadhar", "true");
      this.router.navigate(["/registration-step"], { replaceUrl: true });
    }
  }

  afterSpouseDigiRouteToQuestionAnswer() {
    let status = window.location.href.split("&");
    if (status[1].split("=")[1] == "failure") {
      localStorage.clear();
      this.sharedService.setAuthentication(false);
      // localStorage.setItem("callDigi", "false");
      // localStorage.setItem("lastRoute", "/registration-step");
      // this.router.navigate(["/registration-step"], { replaceUrl: true });
      this.router.navigate(["/"], { replaceUrl: true });
    } else {
      let requestId = status[0].split("=");
      localStorage.setItem("spouseDigiRequestId", requestId[1]);
      localStorage.setItem("lastRoute", "/registration-step");
      localStorage.setItem("callSpouseDigi", "true");
      localStorage.setItem("callSpouseEaadhar", "true");
      this.router.navigate(["/registration-step"], { replaceUrl: true });
    }
  }

  async tapAgainToExit() {
    const toast = await this.toastController.create({
      message: "Tap again to exit",
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 2000,
    });
    toast.present();
    this.counter++;
  }

  logout() {
    this.alertController
      .create({
        header: "Logout?",
        message: "Are you sure you want to logout?",
        backdropDismiss: false,
        buttons: [
          {
            text: "Stay",
            role: "cancel",
            handler: () => {
              // console.log('Application exit prevented!');
            },
          },
          {
            text: "Logout",
            handler: () => {
              setTimeout(() => {
                localStorage.clear();
                this.sharedService.setAuthentication(false);
                this.router.navigate(["/"]);
                window.location.reload();
              }, 100);
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
  showExitConfirm() {
    if (this.previousAppVersionDetected == false) {
      this.alertController
        .create({
          header: "App termination",
          message: "Do you want to close the app?",
          backdropDismiss: false,
          buttons: [
            {
              text: "Stay",
              role: "cancel",
              handler: () => {
                // console.log('Application exit prevented!');
              },
            },
            {
              text: "Exit",
              handler: () => {
                App.exitApp();
              },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    }
  }

  onScroll(event) {
    if (this.router.url == "/profile") {
      if (event.detail.currentY > 100) {
        // console.log('scrolling down...');
        this.isGoToTopBtnVisible = true;
      } else if (event.detail.currentY < 100) {
        this.isGoToTopBtnVisible = false;
        // console.log('scrolling up...');
      }
    } else {
      this.isGoToTopBtnVisible = false;
    }
  }

  getContent() {
    return document.querySelector("ion-content");
  }

  scrollToTop() {
    this.getContent().scrollToTop(500);
  }

  isChatBotBtnVisible: boolean = true;
  async openChatBot() {
    this.isChatBotBtnVisible = false;
    const modal = await this.modalCtrl.create({
      component: ChatbotComponent,
      mode: "ios",
      backdropDismiss: false,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === "confirm") {
      this.isChatBotBtnVisible = true;
    } else {
      this.isChatBotBtnVisible = true;
    }
  }

  getLastDigiLockerLoginDate() {
    this.sharedService.getDigiLoginDate().subscribe(
      (response: any) => {
        if (response.status.toLowerCase() == "success") {
          this.digiLastLoginDate = response.date;
        } else {
          this.digiLastLoginDate = "-";
        }
      },
      async (error) => {}
    );
  }

  previousAppVersionDetected: boolean = false;
  async checkAppVersion() {
    let platform = localStorage.getItem("platform");
    this.previousAppVersionDetected = false;
    if (platform == "android") {
      await this.sharedService.getAppVersion().subscribe(async (data: any) => {
        if (!data.error) {
          if (data.version != appVersion) {
            // this.updateAppVersion();
            this.previousAppVersionDetected = true;
            const alert = await this.alertController.create({
              header: "New version available",
              message:
                "Hello! It seems you have old version of MHADA Housing Lottery Application. Please update to latest version from Play Store.Until then you can continue at https://housing.pmrda.gov.in/",
              backdropDismiss: false,
              buttons: [
                {
                  text: "Go to Website",
                  role: "confirm",
                  handler: () => {
                    window.open("https://bookmyhome.mhada.gov.in/", "_blank");
                  },
                },
                {
                  text: "UPDATE",
                  role: "confirm",
                  handler: () => {
                    window.location.href = "https://play.google.com/store/apps/details?id=com.mhada.ihlms";
                  },
                },
              ],
            });
            await alert.present();
          }
        }
      });
    } else if (platform == "ios" || platform == "browser-local") {
      await this.sharedService.getAppIosVersion().subscribe(async (data: any) => {
        if (!data.error) {
          if (data.version != appIosVersion) {
            // this.updateAppVersion();
            this.previousAppVersionDetected = true;
            const alert = await this.alertController.create({
              header: "New version available",
              message:
                "Hello! It seems you have old version of MHADA Housing Lottery Application. Please update to latest version from App Store.Until then you can continue at https://housing.pmrda.gov.in/",
              backdropDismiss: false,
              buttons: [
                {
                  text: "Go to Website",
                  role: "confirm",
                  handler: () => {
                    window.open("https://housing.pmrda.gov.in/", "_blank");
                  },
                },
                {
                  text: "UPDATE",
                  role: "confirm",
                  handler: () => {
                    window.location.href = "https://apps.apple.com/in/app/mhada-housing-lottery-system/id1658240058";
                  },
                },
              ],
            });
            await alert.present();
          }
        }
      });
    }
  }

  async updateAppVersion() {
    await this.sharedService.updateAppVersion(appVersion).subscribe((data: any) => {
      if (!data.error) {
        if (data == "Success") {
          alert("App version updated in DB.");
        }
      }
    });
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
}
