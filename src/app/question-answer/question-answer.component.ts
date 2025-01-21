/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Photo } from "@capacitor/camera";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { ActionSheetController, AlertController, Platform, ToastController } from "@ionic/angular";
import { LoaderComponent } from "../loader/loader.component";
import { QuestionAnswerService } from "./question-answer.service";
// import { this.allQuestions } from './questionjson';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import * as xml2js from "xml2js";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
const IMAGE_DIR = "stored-images";
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { ProfileService } from "../profile/profile.service";
import { FailureComponent } from "../external-apis/failure/failure.component";
import { InAppBrowserObject } from "@awesome-cordova-plugins/in-app-browser";
import { SharedService } from "../toolbar/shared.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CheckMhadaLotteryWinnerComponent } from "./check-mhada-lottery-winner/check-mhada-lottery-winner.component";
import { DocumentScanner, ResponseType } from "capacitor-document-scanner";
import { imageBase } from "../landing/imageBase64";
import { MultipleNamesComponent } from "./multiple-names/multiple-names.component";
import { CropImageComponent } from "./crop-image/crop-image.component";
import { YoutubeHelpVideoComponent } from "./youtube-help-video/youtube-help-video.component";
import { TranslocoService } from "@ngneat/transloco";
import { AadharIntroVideoComponent } from "./aadhar-intro-video/aadhar-intro-video.component";
import { EnterItrDetailsComponent } from "./enter-itr-details/enter-itr-details.component";
import { RecaptchaComponent } from "ng-recaptcha";
@Component({
  selector: "app-question-answer",
  templateUrl: "./question-answer.component.html",
  styleUrls: ["./question-answer.component.scss"],
  providers: [DatePipe],
})
export class QuestionAnswerComponent implements OnInit {
  panelOpenState = true;
  isQrScan = false;
  isEdit = localStorage.getItem("isEdit");
  allQuestions: any[] = [];
  selectedBackImage: any = "";
  aadharNo = "";
  currentAddress: string = "";
  scannedQrData: any[] = [];
  nextButtonLabel = "Next";
  scannedData: any = "";
  isFrontImage = true;
  qrObj: any = null;
  panAliasName: string = "null";
  panName: string = "";
  frontImageBlob: any = null;
  backImageBlob: any = null;
  responsePanNo = "";
  responseDomicile = "";
  responseIncomeCertificate = "";
  responseCasteValidity = "";
  displayedQuestion: any = null;
  ocrIdOnImage: any = "";
  errorMessageVisible: any = false;
  isOtpVerificationVisible: any = false;
  isUploadImageVisible: any = false;
  selectedImage: any = "";
  selectedPdf: any = "";
  emailId: any = "";
  mobileNo: any = "";
  otp: any = "";
  mobileOtp: any = "";
  imageToUpload: any = null;
  cardTitle: any = "";
  emailPattern: any = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$";
  mobilePattern: any = "^[0-9]{10}$";
  consentAccepted: any = false;
  domicileConsentAccepted: boolean = false;
  selectedRadioOption: any = "";
  selectedAllowedWithConditionRadioOption: any = "";
  selectTypeOfDocToUploadVisible: any = false;
  domicileTokenTextFieldVisible: any = false;
  isEmailVisible: any = false;
  selectedDocToUpload: any = null;
  progressSpinnerDialog: any = null;
  selfSpouseSw: string = "S";
  fileUploadVisible = false;
  fileObj: any = null;
  isImageUploaded: boolean = false;
  docuLocation: string = "";
  refresherEvent: any = null;
  isContentVisible: boolean = false;
  aadharNameFromDigi: string = "";
  isOcrDone: string = "No";
  activeLang: string = "";
  uploadFromEnMr: string = "Upload from";
  galleryEnMr: string = "Gallery";
  cameraEnMr: string = "Camera";
  editRecordList: any[] = [];
  counter: number;
  timerRef;
  timerRunning: boolean = false;
  timeTaken: any = null;
  timerOn = true;
  resendOtpIn: any = null;
  isResendOtpButtonVisible: boolean = false;
  resendOtp: string = "N";
  screenWidth: any;
  ocrMessage: string = "";
  platform: string = "";
  itrOcrResponseString: any = null;
  url: any;
  browser: InAppBrowserObject = null;
  panExists: boolean = false;
  exServicemanImageReuploaded = false;
  predefinedDocEditFlowOcrDone = false;
  domicileToken: string = "";
  
  selfItrPasswordBlock: boolean = false;
  spouseItrPasswordBlock: boolean = false;
  itrPortalOtp: string = "";
  itrPortalPassword: string = "";
  itrPortalConfirmPassword: string = "";
  firstItrApi: boolean = false;
  secondItrApi: boolean = false;
  secondItrApiOtp: boolean = false;
  secondItrApiPassword: boolean = false;
  isCaptchaClicked: boolean = false;
  captcha: string = "";
  isCaptchaVisible: boolean = true;
  showReVerifySelfItr: boolean = false;
  showReVerifySpouseItr: boolean = false;
  showItrErrorMessage: string;
  itrStatus: string;
  @ViewChild("captchaElem") captchaElem: RecaptchaComponent;

  iAgree: any;
  siteKey: string = "6LeWlokqAAAAAACB5JwblsHJMN57Xd_G7-dSEFRQ";
  
  isDarkMode: boolean = false;
  isExServiceman: boolean = true;

  showExservicemanFile: boolean = false;
  showDefenceFamilyFile: boolean = false;
  selectedFinancialYear: any;
  incomeAmount: number | null = null;
  spouseIcomeAmount: number | null = null;
  financialYearList: any[] = [];
  incomeCertificateVisible: boolean = false;

  constructor(
    private dialog: MatDialog,
    public toastController: ToastController,
    private router: Router,
    private alertController: AlertController,
    private barcodeScanner: BarcodeScanner,
    public actionSheetController: ActionSheetController,
    private datePipe: DatePipe,
    public questionAnswerService: QuestionAnswerService,
    private domSanitizer: DomSanitizer,
    private iab: InAppBrowser,
    private profileService: ProfileService,
    private sharedService: SharedService,
    public snackBar: MatSnackBar,
    private translocoService: TranslocoService
  ) {
    this.screenWidth = window.innerWidth;
  }

  async ngOnInit() {
    this.platform = localStorage.getItem("platform");
    // checking if current active language is ENGLISH or MARATHI
    this.checkActiveLanguage();

    if (localStorage.getItem("callSpouseEaadhar") == "true") {
      this.getSpouseEaadharFromDigi();
    } else {
      if (localStorage.getItem("callEaadhar") == "true") {
        this.getEaadharFromDigi();
      } else {
        this.checkDigiDetails();
      }
    }
    console.log(' localStorage.getItem("isEdit") ',localStorage.getItem("isEdit"))
    this.fetchFinancialYearList();
  }

  async checkDigiDetails() {
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.checkDigiDetails();
    this.progressSpinnerDialog.close();
    console.log('checkDigiDetails - > ',response)
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        // isEdit, called when user routes from profile page to edit or change document or answer
        if (localStorage.getItem("isEdit") == "true") {
          setTimeout(() => {
            this.isUploadImageVisible = false;
          }, 10);
          this.loadQuestions();
        } else {
          // called when user is successfully authenticated using DIGILOCKER API
          if (localStorage.getItem("callDigi") == "true") {
            this.loadQuestions();
          }
          // called when something fails at DIGILOCKER API
          else if (localStorage.getItem("callDigi") == "false") {
            alert("Digilocker authentication failed. Kindly repeat the process.");
            localStorage.removeItem("callDigi");
            this.routeToHome();
            window.location.reload();
          }
        }
      } else if (response.status.toLowerCase() == "token expired") {
        if (this.platform == "browser" || this.platform == "browser-local") {
          alert("Security Token is expired, please relogin.");
          localStorage.clear();
          this.sharedService.setAuthentication(false);
          this.router.navigate(["/landing"]);
          window.location.reload();
        } else {
          const response: any = await this.profileService.refreshtoken();
          localStorage.setItem("token", response.token);
          this.sharedService.setAuthentication(true);
          this.ngOnInit();
        }
      } else {
        this.processToDigiLocker();
      }
    } else {
      this.errorToast(response);
    }
  }

  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
      if (this.activeLang == "en") {
        this.nextButtonLabel = "Next";
        this.uploadFromEnMr = "Upload from";
        this.galleryEnMr = "Gallery";
        this.cameraEnMr = "Camera";
      } else {
        this.nextButtonLabel = "पुढे";
        this.uploadFromEnMr = "अपलोड करा";
        this.galleryEnMr = "गॅलरी";
        this.cameraEnMr = "कॅमेरा";
      }
    });
  }

  // called when user REGISTERS or LOGS IN via DIGILOCKER
  // returns user specific token
  async getEaadharFromDigi() {
    this.displayProgressSpinner();
    let fileObj = { requestID: localStorage.getItem("digiRequestId") };
    const response: any = await this.questionAnswerService.getEaadharFromDigi(JSON.stringify(fileObj));
    this.progressSpinnerDialog.close();
    localStorage.removeItem("callEaadhar");
    localStorage.setItem("aadharResponseFromDigi", JSON.stringify(response));
    // localStorage.removeItem("callDigi");
    if (response != null && !response.error) {
      if (response.status == "Exists") {
        localStorage.setItem("userExists", "true");
        localStorage.setItem("isEdit", "true");
        // localStorage.setItem("token", response.message);
        this.aadharNameFromDigi = response.result.name;
        localStorage.setItem("regId", response.regId);
        this.userExists();
        this.sharedService.setAuthentication(true);
      } else if (response.status == "Failure") {
        // this.frontendWarningToast(this.translocoService.translate("warning-no-response-from-digilocker"));
        this.frontendWarningToast(response.message);
        
        setTimeout(() => {
          // this.processToDigiLocker();
          this.routeToHome();
        }, 5000);

        // TODO For Failure resubmit

        // setTimeout(() => {
        //   this.routeToHome();
        //   localStorage.clear();
        //   this.sharedService.setAuthentication(false);
        //   this.router.navigate(["/landing"]);
        // }, 3000);

      } else if (response.status == "Multiple-Names") {
        this.frontendWarningToast(this.translocoService.translate("digi-multiple-name-found"));
        localStorage.setItem("digiResponse", JSON.stringify(response));
        localStorage.setItem("digiAadharName", response.aadharName);
        localStorage.setItem("digiPanName", response.panName);
        localStorage.setItem("rgName1", response.rgName1);
        localStorage.setItem("rgName2", response.rgName2);
        localStorage.setItem("rgName3", response.rgName3);
        setTimeout(() => {
          this.router.navigate(["/multiple-name-check"]);
        }, 3000);
      } else if (response.status.startsWith("Error :")) {
        if (response.status.toLowerCase().includes("null")) {
          this.frontendWarningToast(
            "It seems you are using someone else's DigiLocker account, please Retry with appropriate DigiLocker account!"
          );
          setTimeout(() => {
            this.routeToHome();
            localStorage.removeItem("callDigi");
          }, 5000);
        } else {
          this.frontendWarningToast(response.status.substring(7));
          setTimeout(() => {
            this.routeToHome();
            localStorage.removeItem("callDigi");
          }, 5000);
        }
      } else {
        localStorage.setItem("userExists", "true");
        // localStorage.setItem("token", response.message);
        this.aadharNameFromDigi = response.result.name;
        localStorage.setItem("regId", response.regId);
        this.sharedService.setAuthentication(true);
        // this.nextQuestion(this.displayedQuestion);
        this.ngOnInit();
        // for (let i = 0; i < this.allQuestions.length; i++) {
        //   if (localStorage.getItem("pkQsid") != null) {
        //     if (+this.allQuestions[i]["pkQsid"] == +localStorage.getItem("pkQsid")) {
        //       // localStorage.setItem("pkQsid", this.allQuestions[i]["pkQsid"]);
        //       this.displayedQuestion = this.allQuestions[i];
        //       this.isContentVisible = true;
        //       this.currentQuestion();
        //     }
        //   } else {
        //     if (+this.allQuestions[i]["pkQsid"] == 2) {
        //       this.viewIntroVideo(this.allQuestions[1]);
        //       localStorage.setItem("pkQsid", this.allQuestions[i]["pkQsid"]);
        //       this.displayedQuestion = this.allQuestions[i];
        //       this.isContentVisible = true;
        //       this.currentQuestion();
        //     }
        //   }
        // }
      }
    } else {
      this.errorToast(response);
    }
  }

  // called when user already exists in DB
  // depends on the response of getEaadharFromDigi()
  async userExists() {
    // this.documents = [];
    this.displayProgressSpinner();
    localStorage.removeItem("pkQsid");
    const response: any = await this.profileService.getProfileDetails(localStorage.getItem("regId"));
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.length > 0) {
        let employeeFlag = false;
        let registrationComplete = false;
        // response.sort((a, b) => a.pkQsid - b.pkQsid);
        let profileDetail = response.pop();
        if (profileDetail[0]["isProfileActive"] == "N") {
          localStorage.clear();
          this.sharedService.setAuthentication(false);
          this.router.navigate(["/"]);
          window.location.reload();
        }
        // // if user is already a winner in previous lottery, he is logged out and redirected to home screen
        // if (profileDetail[0].winnerStatus.toLowerCase().includes("rejected")) {
        //   localStorage.clear();
        //   this.sharedService.setAuthentication(false);
        //   this.router.navigate(["/landing"]);
        //   this.frontendWarningToast(this.translocoService.translate("warning-already-winner"));
        // }
        // // based on the answers given, setting answer status to NOT APPLICABLE for set of questions
        // else {
        for (let i = 0; i < response.length; i++) {
          // FREEDOM FIGHTER and Ex SERVICEMAN SET
          // if (response[i]["qsCode"] == "Q_FREEDOM" && response[i]["qs_ans_status"] == "Uploaded") {
          //   response[i + 1]["qs_ans_status"] = "Not Applicable";
          // } else if (response[i]["qsCode"] == "Q_FREEDOM" && response[i + 1]["qs_ans_status"] == "Uploaded") {
          //   response[i]["qs_ans_status"] = "Not Applicable";
          // }

          // CASTE and CASTE VALIDITY SET
          if (response[i]["qsCode"] == "Q_CASTE" && response[i]["qs_ans"] == "OPEN") {
            response[i + 1]["qs_ans_status"] = "Not Applicable";
          }

          // MARRIED ans WORK STATUS SET
          if (
            response[i]["qsCode"] == "Q_MARITAL" &&
            response[i]["qs_ans"] != null &&
            response[i]["qs_ans"] != "Married"
          ) {
            if( response[i + 3]["qsCode"] == "Q_WORK_STATUS"
              && (response[i + 3]["fkRfyid"] == null || response[i + 3]["fkRfyid"] == '')){
              localStorage.setItem("pkQsid", response[i]["pkQsid"]);
              this.displayedQuestion = this.allQuestions[6];
              this.isContentVisible = true;
              registrationComplete = true;
              break;
            }
            if (response[i + 3]["qsCode"] == "Q_WORK_STATUS" && response[i + 3]["qs_ans"] == "None") {
              response[i + 1]["qs_ans_status"] = "Not Applicable"; // i = 7
              response[i + 2]["qs_ans_status"] = "Not Applicable"; // i = 8
              // response[i + 4]["qs_ans_status"] = "Not Applicable"; // i = 8
              response[i + 5]["qs_ans_status"] = "Not Applicable"; // i = 11
              response[i + 6]["qs_ans_status"] = "Not Applicable"; // i = 12
              if (response[i + 4]["qs_ans_status"] == "Not Answered") {
                localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                this.displayedQuestion = this.allQuestions[7];
                this.isContentVisible = true;
                registrationComplete = true;
                break;
              }
            } else {
              response[i + 1]["qs_ans_status"] = "Not Applicable"; // i = 7
              response[i + 2]["qs_ans_status"] = "Not Applicable"; // i = 8
              response[i + 5]["qs_ans_status"] = "Not Applicable"; // i = 11
              response[i + 6]["qs_ans_status"] = "Not Applicable"; // i = 12
              if (response[i + 4]["qs_ans_status"] == "Not Answered") {
                localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                this.displayedQuestion = this.allQuestions[7];
                this.isContentVisible = true;
                registrationComplete = true;
                break;
              }
            }
          } else if (
            response[i]["qsCode"] == "Q_MARITAL" &&
            response[i]["qs_ans"] != null &&
            response[i]["qs_ans"] == "Married"
          ) {
            if( response[i + 3]["qsCode"] == "Q_WORK_STATUS"
              && (response[i + 3]["fkRfyid"] == null || response[i + 3]["fkRfyid"] == '')){
              localStorage.setItem("pkQsid", response[i]["pkQsid"]);
              this.displayedQuestion = this.allQuestions[11];
              this.isContentVisible = true;
              registrationComplete = true;
              break;
            }
            if (response[i + 3]["qsCode"] == "Q_WORK_STATUS" && response[i + 3]["qs_ans_status"] != "Not Answered") {
              if (response[i + 3]["qs_ans"] == "Both") {
                if (
                  response[i + 4]["qs_ans_status"] == "Not Answered" &&
                  response[i + 5]["qs_ans_status"] == "Not Answered" &&
                  response[i + 6]["qs_ans_status"] == "Not Answered"
                ) {
                  localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                  this.displayedQuestion = this.allQuestions[26];
                  this.isContentVisible = true;
                  registrationComplete = true;
                  break;
                } else {
                  if (
                    (response[i + 4]["qs_ans_status"].toLowerCase().includes("verified") ||
                    response[i + 4]["qs_ans_status"].toLowerCase().includes("rejected") ||
                    response[i + 4]["qs_ans_status"].toLowerCase().includes("not-verified")) && 
                    // response[i + 5]["qs_ans_status"].toLowerCase().includes("not-verified") ||
                    response[i + 5]["qs_ans_status"].toLowerCase().includes("not answered")
                  ) {
                    this.displayedQuestion = this.allQuestions[27];
                      this.isContentVisible = true;
                      registrationComplete = true;
                      this.selectedRadioOption = "Yes";
                      this.proceedForBothFICItr('SPOUSE');
                      break;

                  } 
                  else if (
                    response[i + 4]["qs_ans_status"].toLowerCase().includes("verified") ||
                    response[i + 4]["qs_ans_status"].toLowerCase().includes("rejected") ||
                    response[i + 5]["qs_ans_status"].toLowerCase().includes("verified") ||
                    response[i + 5]["qs_ans_status"].toLowerCase().includes("rejected")
                  ) {
                    response[i + 6]["qs_ans_status"] = "Not Applicable";
                  } else if (
                    response[i + 6]["qs_ans_status"].toLowerCase().includes("verified") ||
                    response[i + 6]["qs_ans_status"].toLowerCase().includes("rejected")
                  ) {
                    response[i + 4]["qs_ans_status"] = "Not Applicable";
                    response[i + 5]["qs_ans_status"] = "Not Applicable";
                  }
                }
              } else if (response[i + 3]["qs_ans"] == "Self") {
                // i = 9
                response[i + 5]["qs_ans_status"] = "Not Applicable"; // i= 11
                response[i + 6]["qs_ans_status"] = "Not Applicable"; // i = 12
                if (response[i + 4]["qs_ans_status"] == "Not Answered") {
                  localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                  this.displayedQuestion = this.allQuestions[7];
                  this.isContentVisible = true;
                  registrationComplete = true;
                  break;
                }
              } else if (response[i + 3]["qs_ans"] == "Spouse") {
                // i = 9
                response[i + 6]["qs_ans_status"] = "Not Applicable";
                response[i + 4]["qs_ans_status"] = "Not Applicable";
                if (response[i + 5]["qs_ans_status"] == "Not Answered") {
                  localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                  this.displayedQuestion = this.allQuestions[12];
                  this.isContentVisible = true;
                  registrationComplete = true;
                  break;
                }
              } else if (response[i + 3]["qs_ans"] == "None") {
                response[i + 5]["qs_ans_status"] = "Not Applicable";
                response[i + 6]["qs_ans_status"] = "Not Applicable";
                // response[i + 4]["qs_ans_status"] = "Not Applicable"; // i = 10
                if (response[i + 4]["qs_ans_status"] == "Not Answered") {
                  localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                  this.displayedQuestion = this.allQuestions[7];
                  this.isContentVisible = true;
                  registrationComplete = true;
                  break;
                }
              }
            }
          }

          // if (employeeFlag == false) {
          //   if (response[i + 2] != undefined) {
          //     if (response[i]["qsCode"] == "Q_CENTRAL" && response[i]["qs_ans_status"] == "Uploaded") {
          //       response[i + 1]["qs_ans_status"] = "Not Applicable";
          //       response[i + 2]["qs_ans_status"] = "Not Applicable";
          //       employeeFlag = true;
          //     } else if (response[i + 1]["qsCode"] == "Q_STATE" && response[i + 1]["qs_ans_status"] == "Uploaded") {
          //       response[i]["qs_ans_status"] = "Not Applicable";
          //       response[i + 2]["qs_ans_status"] = "Not Applicable";
          //       employeeFlag = true;
          //     } else if (
          //       response[i + 2]["qsCode"] == "Q_MHADA" &&
          //       (response[i + 2]["qs_ans_status"] == "Verified" || response[i + 2]["qs_ans_status"] == "Rejected")
          //     ) {
          //       response[i]["qs_ans_status"] = "Not Applicable";
          //       response[i + 1]["qs_ans_status"] = "Not Applicable";
          //       employeeFlag = true;
          //     }
          //   }
          // }

          if (response[i]["qs_ans_status"] == "Not Answered" || response[i]["qs_ans_status"] == null) {
            if (
              response[1]["qs_ans_status"] == "Not Answered" ||
              response[1]["qs_ans_status"].startsWith("Rejected") ||
              response[1]["qs_ans_status"] == null
            ) {
              // AADHAR
              this.viewIntroVideo(this.allQuestions[1]);
              localStorage.setItem("pkQsid", response[i]["pkQsid"]);
              this.displayedQuestion = this.allQuestions[1];
              this.isContentVisible = true;
              registrationComplete = true;
              break;
            } else if (response[0]["qs_ans_status"] == "Not Answered" || response[0]["qs_ans_status"] == null) {
              // CONSENT
              localStorage.setItem("pkQsid", response[i]["pkQsid"]);
              this.displayedQuestion = this.allQuestions[0];
              this.isContentVisible = true;
              registrationComplete = true;
              break;
            } else if (response[7]["qs_ans_status"] == "Not Answered" || response[7]["qs_ans_status"] == null) {
              // EMAIL & MOBILE NO
              localStorage.setItem("pkQsid", response[i]["pkQsid"]);
              this.displayedQuestion = this.allQuestions[4];
              this.isContentVisible = true;
              registrationComplete = true;
              this.isEmailVisible = true;
              break;
            } else if (
              response[2]["qs_ans_status"] == "Not Answered" ||
              // response[2]["qs_ans_status"].startsWith("Rejected") ||
              response[2]["qs_ans_status"] == null
            ) {
              // PAN
              localStorage.setItem("pkQsid", response[i]["pkQsid"]);
              this.displayedQuestion = this.allQuestions[2];

              if (this.displayedQuestion.qsQuestion["en"].toLowerCase().includes("spouse")) {
                this.isContentVisible = true;
              } else {
                this.isContentVisible = false;
              }
              registrationComplete = true;
              break;
            }

            // CENTRAL, STATE and MHADA resp.

            if (
              response[3]["qsCode"] == "Q_CENTRAL" ||
              response[4]["qsCode"] == "Q_STATE" ||
              response[5]["qsCode"] == "Q_MHADA"
            ) {
              if (
                (response[3]["qs_ans_status"] == "Not Answered" || response[3]["qs_ans_status"] == null) &&
                (response[4]["qs_ans_status"] == "Not Answered" || response[4]["qs_ans_status"] == null) &&
                (response[5]["qs_ans_status"] == "Not Answered" || response[5]["qs_ans_status"] == null)
              ) {
                // DISPLAYING CENTRAL
                localStorage.setItem("pkQsid", response[3]["pkQsid"]);
                this.displayedQuestion = this.allQuestions[19];
                this.isContentVisible = true;
                registrationComplete = true;
                break;
              } else {
                // checking if MHADA answered
                if (response[5]["qs_ans_status"] != "Not Answered") {
                  // MHADA answered
                  // DOMICILE
                  if (response[6]["qs_ans_status"] == "Not Answered" || response[6]["qs_ans_status"] == null) {
                    localStorage.setItem("pkQsid", response[6]["pkQsid"]);
                    this.displayedQuestion = this.allQuestions[3];
                    this.isContentVisible = true;
                    registrationComplete = true;
                    break;
                  } else {
                    if (response[i]["qs_ans_status"] == "Not Answered") {
                      if (response[i]["qsCode"] != "Q_CENTRAL" && response[i]["qsCode"] != "Q_STATE") {
                        localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                        registrationComplete = true;
                        this.changeDisplayedQuestion();
                        break;
                      }
                    }
                  }
                }

                // checking if STATE answered
                else if (response[4]["qs_ans_status"] != "Not Answered") {
                  // STATE answered
                  // DOMICILE
                  if (response[4]["qs_ans"] == "No") {
                    localStorage.setItem("pkQsid", response[5]["pkQsid"]);
                    this.displayedQuestion = this.allQuestions[21];
                    this.isContentVisible = true;
                    registrationComplete = true;
                    break;
                  } else if (response[6]["qs_ans_status"] == "Not Answered" || response[6]["qs_ans_status"] == null) {
                    localStorage.setItem("pkQsid", response[6]["pkQsid"]);
                    this.displayedQuestion = this.allQuestions[3];
                    this.isContentVisible = true;
                    registrationComplete = true;
                    break;
                  } else {
                    if (response[i]["qs_ans_status"] == "Not Answered") {
                      if (response[i]["qsCode"] != "Q_CENTRAL" && response[i]["qsCode"] != "Q_MHADA") {
                        localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                        registrationComplete = true;
                        this.changeDisplayedQuestion();
                        break;
                      }
                    }
                  }
                }

                // checking if CENTRAL answered
                else if (response[3]["qs_ans_status"] != "Not Answered") {
                  // CENTRAL answered

                  if (response[3]["qs_ans"] == "No") {
                    // DOMICILE
                    if (response[6]["qs_ans_status"] == "Not Answered" || response[6]["qs_ans_status"] == null) {
                      localStorage.setItem("pkQsid", response[4]["pkQsid"]);
                      this.displayedQuestion = this.allQuestions[20];
                      this.isContentVisible = true;
                      registrationComplete = true;
                      break;
                    } else {
                      if (response[i]["qs_ans_status"] == "Not Answered") {
                        localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                        registrationComplete = true;
                        this.changeDisplayedQuestion();
                        break;
                      }
                    }
                  } else {
                    if (response[i]["qs_ans_status"] == "Not Answered") {
                      if (response[i]["qsCode"] != "Q_STATE" && response[i]["qsCode"] != "Q_MHADA") {
                        localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                        registrationComplete = true;
                        this.changeDisplayedQuestion();
                        break;
                      }
                    }
                  }
                }
              }
            }

            // else if (
            //   response[3]["qs_ans_status"] == "Not Answered" ||
            //   response[3]["qs_ans_status"] == null ||
            //   response[3]["qs_ans_status"].startsWith("Rejected")
            // ) {
            //   // DOMICILE
            //   localStorage.setItem("pkQsid", response[i]["pkQsid"]);
            //   this.displayedQuestion = this.allQuestions[3];
            //   this.isContentVisible = true;
            //   registrationComplete = true;
            //   break;
            // }
            else {
              if (response[i]["qs_ans_status"] == "Not Answered") {
                localStorage.setItem("pkQsid", response[i]["pkQsid"]);
                registrationComplete = true;
                this.changeDisplayedQuestion();
                break;
              }
              // localStorage.setItem("pkQsid", response[i]["pkQsid"]);
              // for (let j = 0; j < this.allQuestions.length; j++) {
              //   if (+this.allQuestions[j]["pkQsid"] == +localStorage.getItem("pkQsid")) {
              //     this.displayedQuestion = this.allQuestions[j];
              //     this.isContentVisible = true;
              //     registrationComplete = true;
              //     localStorage.setItem("editRecords", JSON.stringify(response));
              //     break;
              //   }
              // }
            }
          }
        }

        if (registrationComplete == false) {
          this.router.navigate(["/profile"]);
        }
        // }
      } else {
        this.backendWarningToast(response.error);
      }
    } else {
      this.errorToast(response);
    }
  }

  // setting the displayed question based on question id => pkQsid
  async changeDisplayedQuestion() {
    for (let i = 0; i < this.allQuestions.length; i++) {
      if (this.allQuestions[i]["pkQsid"] == localStorage.getItem("pkQsid")) {
        this.displayedQuestion = this.allQuestions[i];
        this.isContentVisible = true;
      }
    }
  }

  // GET list of all the questions
  async loadQuestions() {
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.loadQuestions();
    localStorage.setItem("lastRoute", this.router.url);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.length > 0) {
        this.allQuestions = response;
        this.allQuestions.sort((a, b) => a.pkQsid - b.pkQsid);
        if (localStorage.getItem("isEdit") == "true") {
          this.currentQuestion();
        } else if (localStorage.getItem("callDigi") == "true" && localStorage.getItem("userExists") == "true") {
          this.userExists();
        } else {
          if(localStorage.getItem("isSpouseDigiComplete") == "true"){
            // TODO check
            this.userExists();
          } else {
            this.getEaadharFromDigi();
          }
        }
        if (localStorage.getItem("platform") == "android") {
          this.setFirebaseToken();
        }
      } else {
        this.frontendWarningToast(this.translocoService.translate("warning-no-data"));
      }
    } else {
      this.errorToast(response);
    }
  }

  // set firebase device token for android
  async setFirebaseToken() {
    const response: any = await this.questionAnswerService.updateFcmToken(localStorage.getItem("firebase-token"));
  }

  // if user is editing the profile, based on question id and grouping question, displaying relevant question
  // else, displaying question based on question id
  async currentQuestion() {
    this.selectedRadioOption = "";
    this.displayProgressSpinner();
    this.editRecordList = JSON.parse(localStorage.getItem("editRecords"));
    localStorage.setItem("lastRoute", this.router.url);
    console.log(this.editRecordList)
    if (this.isEdit == "true") {
      const id = localStorage.getItem("pkQsid");
      for (let i = 0; i < this.editRecordList.length; i++) {
        if (+id == 15) {
          this.displayedQuestion = this.editRecordList[16];
          this.selectedRadioOption = this.editRecordList[16]["qs_ans"];
          break;
        } else {
          if (+this.editRecordList[i]["pkQsid"] == +id) {

            if (+id == 9 || +id == 10 || +id == 11 || +id == 12 || +id == 28 || +id == 29 || +id == 30) {
              if(localStorage.getItem("isSpouseDigiComplete") === "true"){
                this.displayedQuestion = this.editRecordList[12];
                localStorage.removeItem("isSpouseDigiComplete");
                break;
              } else {
                this.displayedQuestion = this.editRecordList[9];
                this.selectedRadioOption = this.editRecordList[9]["qs_ans"];
                localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
                if(this.selectedRadioOption == 'Divorcee' || this.selectedRadioOption == 'Widow') {
                  if (this.displayedQuestion.qs_doc_document != null) {
                    this.showStaticRadioButtons = true;
                    this.selectedStaticRadioOption = 'Yes';
                    this.isUploadImageVisible = true;
                    this.viewPreuploadImages(this.displayedQuestion);
                  }
                  else {
                    this.showStaticRadioButtons = true;
                    this.selectedStaticRadioOption = 'No';
                  }
                }
                break;
              }

              // if (+id == 9) {
                // Married
                // this.displayedQuestion = this.editRecordList[9];
                // this.selectedRadioOption = this.editRecordList[9]["qs_ans"];
                // localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
                // if(this.selectedRadioOption == 'Divorcee' || this.selectedRadioOption == 'Widow') {
                //   if (this.displayedQuestion.qs_doc_document != null) {
                //     this.showStaticRadioButtons = true;
                //     this.selectedStaticRadioOption = 'Yes';
                //     this.isUploadImageVisible = true;
                //     this.viewPreuploadImages(this.displayedQuestion);
                //   }
                //   else {
                //     this.showStaticRadioButtons = true;
                //     this.selectedStaticRadioOption = 'No';
                //   }
                // }
                // break;
              // } else {
              //   this.displayedQuestion = this.editRecordList[9];// Change this.editRecordList[9] to this.editRecordList[10]
              //   this.selectedRadioOption = this.editRecordList[9]["qs_ans"];// Change this.editRecordList[9] to this.editRecordList[10]
              //   localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
              // }
              // break;
            }
            else if (+id == 5) {
              this.displayedQuestion = this.editRecordList[i];
              this.selectedRadioOption = this.editRecordList[i]["qs_ans"];
              localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
              this.emailId = this.displayedQuestion['qs_ans'].split(', ')[0];
              this.mobileNo = this.displayedQuestion['qs_ans'].split(', ')[1];
              this.isEmailVisible = true;
              // this.isContentVisible = true;//check if needed
              break;
            }
            // else if (+id == 18 || +id == 23) {
            //   // Freedom Fighter and Ex Serviceman
            //   this.displayedQuestion = this.editRecordList[19];
            //   this.selectedRadioOption = this.editRecordList[19]["qs_ans"];
            //   localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            //   if (this.displayedQuestion.qs_doc_document != null) {
            //     this.viewPreuploadImages(this.displayedQuestion);
            //   }
            //   break;
            // }
            else if (+id == 16) {
              // Caste Validity Certificate
              this.displayedQuestion = this.editRecordList[17];

              localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
              if (this.displayedQuestion.qs_doc_document != null) {
                this.selectedRadioOption = "Yes";
                this.viewPreuploadImages(this.displayedQuestion);
              } else {
                this.selectedRadioOption = "No";
              }
              break;
            } else if (+id == 4 || +id == 20 || +id == 21 || +id == 22) {
              // Central, State and Mhada
              this.displayedQuestion = this.editRecordList[3];
              this.selectedRadioOption = this.editRecordList[3]["qs_ans"];
              localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
              if (this.displayedQuestion.qs_doc_document != null) {
                this.viewPreuploadImages(this.displayedQuestion);
              }
              break;
            } else if (+id == 6) {
              // Address same as aadhar
              this.displayedQuestion = this.editRecordList[8];
              let splitData = this.editRecordList[8]["qs_ans"].split("###");
              this.selectedRadioOption = splitData[0];
              if (this.selectedRadioOption == "No") {
                this.selectTypeOfDocToUploadVisible = true;
                this.domicileTokenTextFieldVisible = false;
                this.selectedDocToUpload = splitData[1];
                this.currentAddress = splitData[1];
              }
              localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
              if (this.displayedQuestion.qs_doc_document != null) {
                this.viewPreuploadImages(this.displayedQuestion);
              }
              break;
            } else if (+id == 14) {
              // Caste
              this.displayedQuestion = this.editRecordList[16];
              this.selectedRadioOption = this.editRecordList[16]["qs_ans"];
              localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
              break;
            } else if (+id == 19 || +id == 18 || +id == 26) {
              // Allowed with condition for Artist / Freedom Fighter / MP MLA
              this.displayedQuestion = this.editRecordList[i];
              localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
              if (
                this.editRecordList[i]["qs_ans"] == "I do not have certificate as of now" &&
                this.editRecordList[i]["qs_ans_status"] == "Allowed with Condition"
              ) {
                this.selectedRadioOption = "Yes";
                // this.selectedAllowedWithConditionRadioOption = "No";

                setTimeout(()=> {
                  this.selectedAllowedWithConditionRadioOption = "No";
                }, 1000);

                break;
              } else if (
                this.editRecordList[i]["qs_ans"] == "I have certificate" &&
                this.editRecordList[i]["qs_ans_status"].toLowerCase().includes("verified") &&
                this.displayedQuestion.qs_doc_document != null
              ) {
                this.selectedRadioOption = "Yes";
                // this.selectedAllowedWithConditionRadioOption = "Yes";
                setTimeout(()=> {
                  this.selectedAllowedWithConditionRadioOption = "Yes";
                  this.viewPreuploadImages(this.displayedQuestion);
                }, 1000);
                break;
              } else if(this.editRecordList[i]["qs_ans"] == null) {
                this.selectedRadioOption = "";
              } else {
                this.selectedRadioOption = "No";
              }
            } else {
              this.displayedQuestion = this.editRecordList[i];

              // rushi
              if(this.displayedQuestion?.qsCode == 'Q_EXSERVICEMAN') {
                if(this.displayedQuestion["qs_ans"] == 'None of the above' || this.displayedQuestion["qs_ans"] == 'Defence Family'){
                  this.selectedRadioOption = 'test';
                } else {
                  this.selectedRadioOption = this.displayedQuestion["qs_ans"];
                }
                if(this.displayedQuestion["qs_ans"] == 'Ex Serviceman'){
                  if (this.displayedQuestion.qs_doc_document != null) {
                    this.showExservicemanFile = true;
                    this.viewPreuploadImages(this.displayedQuestion);
                  }
                }

                
                if(this.displayedQuestion["qs_ans"] == 'Defence Family'){
                  if (this.displayedQuestion.qs_doc_document != null) {
                    this.showDefenceFamilyFile = true;
                    this.viewPreuploadImages(this.displayedQuestion);
                  }
                }
                
                localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
                break;
              } else {
                this.selectedRadioOption = this.displayedQuestion["qs_ans"];
                localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
                if (this.displayedQuestion.qs_doc_document != null) {
                  this.viewPreuploadImages(this.displayedQuestion);
                }
                break;
              }
            }
            if (
              this.editRecordList[i]["qs_ans_status"] == "Answered" ||
              this.editRecordList[i]["qs_ans_status"] == "Verified" ||
              this.editRecordList[i]["qs_ans_status"] == "Uploaded"
            ) {
              this.selectedRadioOption = this.editRecordList[i]["qs_ans"];
              if (this.editRecordList[i]["qsCode"] == "Q_ADDRESS") {
                if (this.selectedRadioOption == "Same As Aadhar") {
                  this.selectedRadioOption = "Yes";
                } else {
                  this.selectedRadioOption = "No";
                  this.selectTypeOfDocToUploadVisible = true;
                  this.domicileTokenTextFieldVisible = false;
                }
              } else if (this.editRecordList[i]["qsCode"] == "Q_CASTE") {
                this.selectedRadioOption = this.editRecordList[i]["qs_ans"];
              }
              if (this.editRecordList[i]["qs_ans"] == "Yes") {
                const resp: any = await this.profileService.downloadFile(this.editRecordList[i]["qs_doc_document"].split("/").pop());
                this.isUploadImageVisible = true;
                let file = new Blob([resp], { type: "image/png" });

                var fileURL = URL.createObjectURL(file);
                setTimeout(() => {
                  this.selectedImage = this.domSanitizer.bypassSecurityTrustResourceUrl(fileURL);
                }, 100);
              }
            }
            this.toggleDivVisibility();
          }
        }
      }
      this.isContentVisible = true;
      this.progressSpinnerDialog.close();
    } else {
      if (localStorage.getItem("pkQsid") != null) {
        const id = localStorage.getItem("pkQsid");
        for (let i = 0; i < this.allQuestions.length; i++) {
          if (id == this.allQuestions[i].pkQsid) {
            this.displayedQuestion = this.allQuestions[i];
            this.toggleDivVisibility();
          }
        }
      } else {
        this.viewIntroVideo(this.allQuestions[1]);
        this.displayedQuestion = this.allQuestions[1];
        this.toggleDivVisibility();
      }
      this.isContentVisible = true;
      this.progressSpinnerDialog.close();
    }

    if (this.refresherEvent != null) {
      this.refresherEvent.target.complete();
    }
  }

  // for handling consent and email question
  toggleDivVisibility() {
    if (
      this.displayedQuestion.qsOption1[this.activeLang] == null &&
      this.displayedQuestion.qsOption2[this.activeLang] == null &&
      this.displayedQuestion.qsCode == "Q_EMAIL"
    ) {
      this.isEmailVisible = true;
    } else if (
      this.displayedQuestion.qsOption1[this.activeLang] == null &&
      this.displayedQuestion.qsOption2[this.activeLang] == null &&
      this.displayedQuestion.qsCode != "Q_CONSENT"
    ) {
      this.isUploadImageVisible = true;
    }
  }

  // DIGILOCKER API to enter AADHAR NUMBER for user registration
  async processToDigiLocker() {
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.createDigilockerUrl(
      localStorage.getItem("regId"),
      this.platform
    );
    this.progressSpinnerDialog.close();
    if (!response.error) {
      const options: InAppBrowserOptions = {
        zoom: "no",
        hideurlbar: "yes",
        toolbar: "no",
        location: "no",
        hidenavigationbuttons: "no",
        usewkwebview: "yes",
      };
      // window.open(response.result.url, "_self");
      // this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(response.result.url);
      let target = "";
      const deviceType = this.platform;
      if (deviceType == "ios") {
        target = "_blank";
      } else {
        target = "_self";
      }

      if (
        response.task != null &&
        response.task != "null" &&
        response.task != "" &&
        response.task.startsWith("Error")
      ) {
        // alert("Network error - " + response.task.substring(7));
        alert(this.translocoService.translate("digilocker-error"));
        this.routeToHome();
      } else if (response.result.url == null || response.result.url == "null" || response.result.url == "") {
        alert("Digilocker URL empty - " + response.result.url);
        this.routeToHome();
      } else {
        const browser = this.iab.create(response.result.url, target, options);
        browser.on("loadstart").subscribe((ev: InAppBrowserEvent) => {
          if (ev.url.startsWith("http://localhost/question-answer?requestId=")) {
            // for android apk
            browser.close();
            let status = ev.url.split("&");
            if (status[1].split("=")[1] == "failure") {
              localStorage.setItem("callDigi", "false");
              localStorage.setItem("lastRoute", "/");
              this.router.navigate(["/landing"], { replaceUrl: true });
              window.location.reload();
            } else {
              let requestId = status[0].split("=");
              localStorage.setItem("digiRequestId", requestId[1]);
              localStorage.setItem("lastRoute", "/question-answer");
              localStorage.setItem("callDigi", "true");
              localStorage.setItem("callEaadhar", "true");
              this.router.navigate(["/question-answer"], { replaceUrl: true });
              window.location.reload();
            }
          } else if (
            ev.url.startsWith("https://cidcohousing.probitysoftware.in/question-answer?requestId=") ||
            ev.url.startsWith("https://uatilms.mhada.gov.in/question-answer?requestId=") ||
            ev.url.startsWith("http://localhost:8100/question-answer?requestId=") ||
            ev.url.startsWith("https://housing.pmrda.gov.in/question-answer?requestId=")
          ) {
            // for browser
            browser.close();
            let status = ev.url.split("&");
            if (status[1].split("=")[1] == "failure") {
              localStorage.setItem("callDigi", "false");
              localStorage.setItem("lastRoute", "/");
              this.router.navigate(["/landing"], { replaceUrl: true });
              window.location.reload();
            } else {
              let requestId = status[0].split("=");
              localStorage.setItem("digiRequestId", requestId[1]);
              localStorage.setItem("lastRoute", "/question-answer");
              localStorage.setItem("callDigi", "true");
              localStorage.setItem("callEaadhar", "true");
              this.router.navigate(["/question-answer"], { replaceUrl: true });
              window.location.reload();
            }
          }
        });
        browser.on("exit").subscribe((ev: InAppBrowserEvent) => {
          if (ev.url == undefined && localStorage.getItem("digiRequestId") == null) {
            localStorage.setItem("lastRoute", "/");
            this.router.navigate(["/landing"], { replaceUrl: true });
            window.location.reload();
          }
        });
      }
      // browser.on("loadstop").subscribe((ev: InAppBrowserEvent) => {
      //   if (ev.url.startsWith("http://localhost/question-answer?requestId=")) {
      //     // for android apk
      //     browser.close();
      //     let status = ev.url.split("&");
      //     if (status[1].split("=")[1] == "failure") {
      //       localStorage.setItem("callDigi", "false");
      //       localStorage.setItem("lastRoute", "/question-answer");
      //       this.router.navigate(["/question-answer"], { replaceUrl: true });
      //     } else {
      //       let requestId = status[0].split("=");
      //       localStorage.setItem("digiRequestId", requestId[1]);
      //       localStorage.setItem("lastRoute", "/question-answer");
      //       localStorage.setItem("callDigi", "true");
      //       this.router.navigate(["/question-answer"], { replaceUrl: true });
      //       window.location.reload();
      //     }
      //   } else if (
      //     ev.url.startsWith("https://cidcohousing.probitysoftware.in/question-answer?requestId=") ||
      //     ev.url.startsWith("http://localhost:8100/question-answer?requestId=")
      //   ) {
      //     // for browser
      //     browser.close();
      //     let status = ev.url.split("&");
      //     if (status[1].split("=")[1] == "failure") {
      //       localStorage.setItem("callDigi", "false");
      //       localStorage.setItem("lastRoute", "/question-answer");
      //       this.router.navigate(["/question-answer"], { replaceUrl: true });
      //     } else {
      //       let requestId = status[0].split("=");
      //       localStorage.setItem("digiRequestId", requestId[1]);
      //       localStorage.setItem("lastRoute", "/question-answer");
      //       localStorage.setItem("callDigi", "true");
      //       this.router.navigate(["/question-answer"], { replaceUrl: true });
      //       window.location.reload();
      //     }
      //   }
      // });
      // this.browser._loadAfterBeforeload(response.result.url);
      // browser._loadAfterBeforeload(response.result.url);
      // window.open("https://ionicframework.com/", "_system", "location=yes");

      // var ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');
      // console.log(this.url);
    } else {
      // alert("error at : " + response.url);
      alert(this.translocoService.translate("digilocker-service-error"));
      // this.errorToast(response);
      // this.routeToHome();
      localStorage.clear();
      this.sharedService.setAuthentication(false);
      this.router.navigate(["/landing"]);
      window.location.reload();
    }
  }

  // called when user click on proceed button on the UI
  // specific condition is called based on type of question i.e
  // whether its
  // consent, only image upload, email and mob no, radio
  
  proceed(type: string) {
    this.scrollIntoView();
    this.snackBar.dismiss();
    setTimeout(() => {
      this.isUploadImageVisible = false;
    }, 10);

    this.ocrMessage = "";
    if (type == "consent") {
      if (
        this.displayedQuestion.qsOption1[this.activeLang] == null &&
        this.displayedQuestion.qsOption2[this.activeLang] == null
      ) {
        this.updateConsent();
      }
    } else if (type == "image") {
      if (this.displayedQuestion.qsCode == "Q_PAN") {
        // alert('Something went wrong. Please contact to admin. verify');
        if (this.isEdit == "true" && this.isOcrDone == "No") {
          this.editWorkingStatus();
        }
        else {
          this.recordEditing();
        }
        // this.verifyPanDetails();
      } else if (this.displayedQuestion.qsCode == "Q_CAST_CERT") {
        this.verifyCasteCert();
      } else if (this.displayedQuestion.qsCode == "Q_DOMICILE") {
        this.verifyDomicile(this.responseDomicile);
      } else if (
        this.displayedQuestion.qsCode == "Q_ITR" ||
        this.displayedQuestion.qsCode == "Q_ITR_SPOUSE" ||
        this.displayedQuestion.qsCode == "Q_SELF_ITR" ||
        this.displayedQuestion.qsCode == "Q_SPOUSE_ITR"
      ) {
        if (this.isEdit == "true") {
          if (this.isOcrDone == "Yes") {
            this.verifyYear("T");
          } else {
            if (this.displayedQuestion.qsCode == "Q_ITR") {
              this.selectedImage = "";
              this.displayedQuestion = this.allQuestions[28];
              if (
                this.editRecordList[14].qs_ans_status == "Verified" ||
                this.editRecordList[14].qs_ans_status == "Not-Verified"
              ) {
                this.viewPreuploadImages(this.editRecordList[14]);
                this.isImageUploaded = true;
              }
            } else {
              this.recordEditing();
            }
          }
        } else {
          this.verifyYear("T");
        }
        // this.verifyIncomeCert("T");
      } else if (this.displayedQuestion.qsCode == "Q_INCOME_CERT") {
        if (this.isEdit == "true" && this.isOcrDone == "No") {
          this.recordEditing();
        } else {
          this.verifyFamilyIncomeCert();
        }
      } else if (
        this.displayedQuestion.qsCode != "Q_DOMICILE" &&
        this.displayedQuestion.qsCode != "Q_PAN" &&
        this.displayedQuestion.qsOption1[this.activeLang] == null &&
        this.displayedQuestion.qsOption2[this.activeLang] == null
      ) {
        this.nextQuestion(this.displayedQuestion);
      }
    } else if (type == "email") {
      this.verifyOtp();
    } else if (type == "radio") {
      if (this.displayedQuestion.qsCode == "Q_PAN") {
        if (this.selectedRadioOption == "Yes") {
          // this.verifyPanDetails();
          alert('Something went wrong. Please contact to admin. selectedRadioOption 1');
        } else {
          alert('Something went wrong. Please contact to admin. selectedRadioOption 2');
          // this.updateSpousePanStatus();
        }
      } else if (this.displayedQuestion.qsCode == "Q_HANDICAPED") {
        if (this.isEdit == "true") {
          if (this.selectedRadioOption == "Yes" && this.isOcrDone == "Yes") {
            // this.uploadPredefinedDoc("uploadDisability", "Disability");
            this.verifyDisablityCert();
          } else if (this.selectedRadioOption == "Yes" && this.isOcrDone == "No") {
            this.recordEditing();
          } else {
            this.uploadPredefinedDoc("uploadDisability", "Disability");
          }
          // if (this.editRecordList[18]["qs_ans"] == this.selectedRadioOption) {
          //   this.recordEditing();
          // } else {
          //   this.uploadPredefinedDoc("uploadDisability", "Disability");
          // }
        } else {
          if (this.selectedRadioOption == "Yes") {
            this.verifyDisablityCert();
          } else {
            this.uploadPredefinedDoc("uploadDisability", "Disability");
          }
        }
      } else if (this.displayedQuestion.qsCode == "Q_CAST_VALID") {
        this.verifyCasteCertValidity(this.responseCasteValidity);
      } else if (this.displayedQuestion.qsCode == "Q_ADDRESS") {
        let address = this.currentAddress.trim();
        if (this.selectedRadioOption == "No" && address.length == 0) {
          this.currentAddress = "";
          this.frontendWarningToast(this.translocoService.translate("warning-address"));
          this.selectedRadioOption = "No";
        } else {
          this.currentAddress = this.currentAddress.trim();
          this.updateAddress();
        }
        // this.updateAddress();
        // if (this.isEdit == "true") {
        //   if (this.selectedRadioOption == "No") {
        //     // if (
        //     //   (this.selectedDocToUpload == "51" ||
        //     //     this.selectedDocToUpload == "52" ||
        //     //     this.selectedDocToUpload == "53" ||
        //     //     this.selectedDocToUpload == "54" ||
        //     //     this.selectedDocToUpload == "55" ||
        //     //     this.selectedDocToUpload == "56" ||
        //     //     this.selectedDocToUpload == "57") &&
        //     //   this.isOcrDone == "Yes"
        //     // ) {
        //     //   this.updateAddress();
        //     // } else if (
        //     //   (this.selectedDocToUpload == "51" ||
        //     //     this.selectedDocToUpload == "52" ||
        //     //     this.selectedDocToUpload == "53" ||
        //     //     this.selectedDocToUpload == "54" ||
        //     //     this.selectedDocToUpload == "55" ||
        //     //     this.selectedDocToUpload == "56" ||
        //     //     this.selectedDocToUpload == "57") &&
        //     //   this.isOcrDone == "No"
        //     // ) {
        //     //   this.recordEditing();
        //     // } else {
        //     this.updateAddress();
        //     // }
        //   } else if (this.selectedRadioOption == "Yes") {
        //     localStorage.removeItem("docuLocation");
        //     this.updateAddress();
        //   }
        // } else {
        //   if (this.selectedRadioOption == "Yes") {
        //     this.updateAddress();
        //   } else {
        //     if (this.selectedRadioOption == "No") {
        //       this.updateAddress();
        //     } else {
        //       this.nextQuestion(this.displayedQuestion);
        //     }
        //   }
        // }
      } else if (this.displayedQuestion.qsCode == "Q_DOMICILE") {
        if (this.isEdit == "true") {
          if (this.selectedRadioOption == "No") {
            this.updateDomicileToken();
          } else if (this.selectedRadioOption == "Yes") {
            if (this.isOcrDone == "Yes") {
              this.verifyDomicile(this.responseDomicile);
            } else {
              this.recordEditing();
            }
          }
        } else {
          if (this.selectedRadioOption == "Yes") {
            this.verifyDomicile(this.responseDomicile);
          } else if (this.selectedRadioOption == "No") {
            this.updateDomicileToken();
          }
        }
      } else if (this.displayedQuestion.qsCode == "Q_MHADA") {
        if (this.selectedRadioOption == "Yes") {
          this.verifyMhadaEmployee();
        } else {
          this.uploadPredefinedDoc("uploadMhadaEmployee", "MHADA Employee");
        }
      } else if (this.displayedQuestion.qsCode == "Q_PMAY") {
        if (this.isEdit == "true") {
          if (this.selectedRadioOption == "Yes" && this.isOcrDone == "Yes") {
            // this.verifyPmay();
            // this.verifyPredefinedDocs("", "", "verifyPmay");
            this.router.navigate(["/profile"]);
          } else if (this.selectedRadioOption == "Yes" && this.isOcrDone == "No") {
            this.recordEditing();
          } else {
            this.uploadPredefinedDoc("uploadPmay", "PMAY");
          }
        } else {
          if (this.selectedRadioOption == "Yes") {
            // this.verifyPmay();
            this.router.navigate(["/profile"]);
            // this.verifyPredefinedDocs("", "", "verifyPmay");
          } else {
            this.uploadPredefinedDoc("uploadPmay", "PMAY");
          }
        }
      } else if (this.displayedQuestion.qsCode == "Q_SELF_WORKING") {
        this.updateWorkingStatus();
      } else if (this.displayedQuestion.qsCode == "Q_SELF_ITR" || this.displayedQuestion.qsCode == "Q_SPOUSE_ITR") {
        if (
          (this.displayedQuestion.qsCode == "Q_SELF_ITR" ||
            this.displayedQuestion.qsCode == "Q_SPOUSE_ITR" ||
            this.displayedQuestion.qsCode == "Q_ITR") &&
          this.selectedRadioOption == "No"
        ) {
          this.verifyIncomeCert("I");
        } else if (
          (this.displayedQuestion.qsCode == "Q_SELF_ITR" ||
            this.displayedQuestion.qsCode == "Q_SPOUSE_ITR" ||
            this.displayedQuestion.qsCode == "Q_ITR") &&
          this.selectedRadioOption == "Yes"
        ) {
          // this.verifyIncomeCert("T");
          if (this.isEdit == "true") {
            if (this.isOcrDone == "Yes") {
              this.verifyYear("T");
            } else {
              if (this.displayedQuestion.qsCode == "Q_ITR") {
                this.selectedImage = "";
                this.displayedQuestion = this.allQuestions[28];
                if (
                  this.editRecordList[14].qs_ans_status == "Verified" ||
                  this.editRecordList[14].qs_ans_status == "Not-Verified"
                ) {
                  this.viewPreuploadImages(this.editRecordList[14]);
                  this.isImageUploaded = true;
                }
              } else {
                this.recordEditing();
              }
            }
          } else {
            this.verifyYear("T");
          }
        }
      } else if (this.displayedQuestion.qsCode == "Q_FIC_ITR") {
        if (this.isEdit == "true") {
          if (this.selectedRadioOption == "Yes") {
            this.displayedQuestion = this.allQuestions[27];
            // this.isOcrDone = "Yes";
            if (
              this.editRecordList[13].qs_ans_status == "Verified" ||
              this.editRecordList[13].qs_ans_status == "Not-Verified"
            ) {
              this.viewPreuploadImages(this.editRecordList[13]);
              this.isImageUploaded = true;
            }
          } else {
            this.displayedQuestion = this.allQuestions[29];
            if (
              this.editRecordList[15].qs_ans_status == "Verified" ||
              this.editRecordList[15].qs_ans_status == "Not-Verified"
            ) {
              this.viewPreuploadImages(this.editRecordList[15]);
              this.isUploadImageVisible = true;
            }
          }
        } else {
          if (this.selectedRadioOption == "Yes") {
            this.nextQuestion(this.displayedQuestion);
          } else {
            this.jumpToQuestion(this.displayedQuestion);
          }
        }
      } else if (this.displayedQuestion.qsCode == "Q_ARTIST") {
        // this.uploadPredefinedDoc("uploadArtist", "Artist");
        this.verifyPredefinedDocs("Artist", "uploadArtist", "verifyArtist");
      } else if (this.displayedQuestion.qsCode == "Q_FREEDOM") {
        // if (this.isEdit == "true" && this.selectedRadioOption == this.displayedQuestion.qs_ans) {
        //   if (this.selectedRadioOption == "No") {
        //     // this.displayedQuestion = this.editRecordList[20];
        //     // this.selectedRadioOption = this.displayedQuestion.qs_ans;
        //     // if (this.displayedQuestion.qs_ans == "Yes") {
        //     //   this.viewPreuploadImages(this.displayedQuestion);
        //     // }
        //     this.recordEditing();
        //   } else {
        //     this.recordEditing();
        //   }
        // } else {
        //   this.uploadPredefinedDoc("uploadFreedomFighter", "Freedom Fighter");
        // }
        this.verifyPredefinedDocs("Freedom Fighter", "uploadFreedomFighter", "verifyFreedomFighter");
      } else if (this.displayedQuestion.qsCode == "Q_CENTRAL") {
        // if (this.isEdit == "true") {
        //   if (this.selectedRadioOption == "Yes") {
        //     this.uploadPredefinedDoc("uploadCentralEmployee", "Central Employee");
        //   } else {
        //     this.uploadPredefinedDoc("uploadCentralEmployee", "Central Employee");
        //   }
        // } else {
        //   this.uploadPredefinedDoc("uploadCentralEmployee", "Central Employee");
        // }
        this.verifyPredefinedDocs("Central Employee", "uploadCentralEmployee", "verifyCentralEmployee");
      } else if (this.displayedQuestion.qsCode == "Q_STATE") {
        // if (this.isEdit == "true") {
        //   if (this.selectedRadioOption == "Yes") {
        //     this.uploadPredefinedDoc("uploadStateEmployee", "State Employee");
        //   } else {
        //     this.uploadPredefinedDoc("uploadStateEmployee", "State Employee");
        //   }
        // } else {
        //   this.uploadPredefinedDoc("uploadStateEmployee", "Central Employee");
        // }
        this.verifyPredefinedDocs("State Employee", "uploadStateEmployee", "verifyStateEmployee");
      } else if (this.displayedQuestion.qsCode == "Q_EXSERVICEMAN") {
        // if (this.isEdit == "true" && this.selectedRadioOption == this.displayedQuestion.qs_ans) {
        //   this.recordEditing();
        // } else {
        //   this.uploadPredefinedDoc("uploadxService", "Ex Servicemen");
        // }
        this.verifyPredefinedDocs("Ex Servicemen", "uploadxService", "verifyExservice");
      } else if (this.displayedQuestion.qsCode == "Q_JOURNALIST") {
        // this.uploadPredefinedDoc("uploadJournalist", "Journalist");
        this.verifyPredefinedDocs("Journalist", "uploadJournalist", "verifyJournlist");
      } else if (this.displayedQuestion.qsCode == "Q_MLA") {
        // this.uploadPredefinedDoc("uploadMpMlaMlc", "MP / MLA / MLC");
        this.verifyPredefinedDocs("MP / MLA / MLC", "uploadMpMlaMlc", "verifyMpMla");
      } else {
        if (this.displayedQuestion.qsOption1NextQuestion != 99 && this.displayedQuestion.qsOption2NextQuestion == 99) {
          this.nextQuestion(this.displayedQuestion);
        } else if (
          this.displayedQuestion.qsOption1NextQuestion == 99 &&
          this.displayedQuestion.qsOption2NextQuestion != 99
        ) {
          this.jumpToQuestion(this.displayedQuestion);
        } else if (
          this.displayedQuestion.qsOption1NextQuestion != 99 &&
          this.displayedQuestion.qsOption2NextQuestion != 99
        ) {
          if (this.selectedRadioOption == "Yes") {
            this.nextQuestion(this.displayedQuestion);
          } else if (this.selectedRadioOption == "No") {
            this.jumpToQuestion(this.displayedQuestion);
          }
        }
      }
    } else if (type == "allowedWithCondition") {
      let docType = "";
      let allowedWithConditionWs = "";
      let uploadWsNameForNoOption = "";
      let verifyWsName = "";
      if (this.displayedQuestion.qsCode == "Q_ARTIST") {
        docType = "Artist";
        allowedWithConditionWs = "updateArtist";
        uploadWsNameForNoOption = "uploadArtist";
        verifyWsName = "verifyArtist";
      } else if (this.displayedQuestion.qsCode == "Q_FREEDOM") {
        docType = "Freedom Fighter";
        allowedWithConditionWs = "updateFreedomFighter";
        uploadWsNameForNoOption = "uploadFreedomFighter";
        verifyWsName = "verifyFreedomFighter";
      } else if (this.displayedQuestion.qsCode == "Q_MLA") {
        docType = "MP / MLA / MLC";
        allowedWithConditionWs = "updateMpMlaMlc";
        uploadWsNameForNoOption = "uploadMpMlaMlc";
        verifyWsName = "verifyMpMla";
      }
      if (this.isEdit == "true") {
        if (
          this.selectedRadioOption == "Yes" &&
          this.selectedAllowedWithConditionRadioOption == "Yes" &&
          this.exServicemanImageReuploaded == true
        ) {
          this.verifyPredefinedDocs(docType, uploadWsNameForNoOption, verifyWsName);
        } else if (this.selectedRadioOption == "Yes" && this.selectedAllowedWithConditionRadioOption == "No") {
          this.allowedWithConditionDocs(allowedWithConditionWs);
        } else if (this.selectedRadioOption == "No") {
          this.uploadPredefinedDoc(uploadWsNameForNoOption, docType);
        } else {
          this.recordEditing();
        }
      } else {
        if (
          this.selectedRadioOption == "Yes" &&
          this.selectedAllowedWithConditionRadioOption == "Yes" &&
          this.exServicemanImageReuploaded == true
        ) {
          this.verifyPredefinedDocs(docType, uploadWsNameForNoOption, verifyWsName);
        } else if (this.selectedRadioOption == "Yes" && this.selectedAllowedWithConditionRadioOption == "No") {
          this.allowedWithConditionDocs(allowedWithConditionWs);
        } else {
          this.uploadPredefinedDoc(uploadWsNameForNoOption, docType);
        }
      }
    }
  }

  // depending on the qsOption{1/2}NextQuestion parameter from loadQuestions(), which is the next question id,
  // displaying relevant question
  nextQuestion(previousQuestion) {
    console.log('next question');
    this.scrollIntoView();
    setTimeout(() => {
      this.aadharNameFromDigi = "";
      // this.clearTimer();
      this.errorMessageVisible = false;
      this.isOtpVerificationVisible = false;
      this.selectedImage = "";
      this.selectedBackImage = "";
      this.frontImageBlob = null;
      this.backImageBlob = null;
      this.ocrIdOnImage = "";
      this.selectTypeOfDocToUploadVisible = false;
      this.domicileTokenTextFieldVisible = false;
      this.isEmailVisible = false;
      this.ocrMessage = "";
      setTimeout(() => {
        this.isUploadImageVisible = false;
        this.selectedRadioOption = "";
      }, 10);
    }, 10);

    if (this.isEdit == "true") {
      if (this.displayedQuestion.qsCode == "Q_STATE" || this.displayedQuestion.qsCode == "Q_MHADA") {
        this.displayedQuestion = this.editRecordList[6];
        this.ocrMessage = "";
        this.selectedImage = "";
        localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
        if (this.displayedQuestion.qs_doc_document != null) {
          this.selectedRadioOption = "Yes";
          this.viewPreuploadImages(this.displayedQuestion);
        } else if (this.displayedQuestion.qs_ans_status == "Allowed with Condition") {
          this.selectedRadioOption = "No";
          this.domicileTokenTextFieldVisible = true;
          this.domicileToken = this.displayedQuestion.appToken;
        }
      } else if (this.displayedQuestion.qsCode == "Q_CENTRAL") {
        this.recordEditing();
      } else if (
        +this.displayedQuestion.pkQsid == 5 ||
        +this.displayedQuestion.pkQsid == 9 ||
        +this.displayedQuestion.pkQsid == 7 ||
        +this.displayedQuestion.pkQsid == 10 ||
        +this.displayedQuestion.pkQsid == 8 ||
        +this.displayedQuestion.pkQsid == 11 ||
        +this.displayedQuestion.pkQsid == 12 ||
        +this.displayedQuestion.pkQsid == 13 ||
        +this.displayedQuestion.pkQsid == 27
      ) {
        this.recordEditing();
      } else {
        this.ngOnInit();
      }
    } else {
      if (this.displayedQuestion.pkQsid == 11) {
        this.jumpToQuestion(this.displayedQuestion);
      } else {
        for (let i = 0; i < this.allQuestions.length; i++) {
          // console.log(this.displayedQuestion.pkQsid)
          if (previousQuestion.qsOption1NextQuestion == this.allQuestions[i].pkQsid) {
            this.displayedQuestion = this.allQuestions[i];
            localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            this.toggleDivVisibility();
            if (
              +this.displayedQuestion.pkQsid != 9 &&
              +this.displayedQuestion.pkQsid != 7 &&
              +this.displayedQuestion.pkQsid != 10 &&
              +this.displayedQuestion.pkQsid != 8 &&
              +this.displayedQuestion.pkQsid != 11 &&
              +this.displayedQuestion.pkQsid != 12 &&
              +this.displayedQuestion.pkQsid != 13 &&
              +this.displayedQuestion.pkQsid != 27 &&
              +this.displayedQuestion.pkQsid != 28 &&
              +this.displayedQuestion.pkQsid != 29 &&
              +this.displayedQuestion.pkQsid != 30
            ) {
              this.ngOnInit();
            }
          }
        }
      }
    }
  }

  // depending on the qsOption{1/2}NextQuestion parameter from loadQuestions(), which is the next question id,
  // displaying relevant question
  jumpToQuestion(previousQuestion) {
    this.scrollIntoView();
    setTimeout(() => {
      this.aadharNameFromDigi = "";
      // this.clearTimer();
      this.errorMessageVisible = false;
      this.isOtpVerificationVisible = false;
      this.selectedImage = "";
      this.selectedBackImage = "";
      this.frontImageBlob = null;
      this.backImageBlob = null;
      this.ocrIdOnImage = "";
      this.selectTypeOfDocToUploadVisible = false;
      this.domicileTokenTextFieldVisible = false;
      this.isEmailVisible = false;
      this.ocrMessage = "";
      setTimeout(() => {
        this.isUploadImageVisible = false;
        this.selectedRadioOption = "";
      }, 10);
    }, 10);

    if (this.isEdit == "true") {
      this.recordEditing();
    } else {
      if (this.displayedQuestion.pkQsid == 31) {
        this.router.navigate(["/profile"]);
      } else {
        for (let i = 0; i < this.allQuestions.length; i++) {
          if (previousQuestion.qsOption2NextQuestion == this.allQuestions[i].pkQsid) {
            this.displayedQuestion = this.allQuestions[i];
            localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            if (
              +this.displayedQuestion.pkQsid != 9 &&
              +this.displayedQuestion.pkQsid != 7 &&
              +this.displayedQuestion.pkQsid != 10 &&
              +this.displayedQuestion.pkQsid != 8 &&
              +this.displayedQuestion.pkQsid != 11 &&
              +this.displayedQuestion.pkQsid != 12 &&
              +this.displayedQuestion.pkQsid != 13 &&
              +this.displayedQuestion.pkQsid != 27 &&
              +this.displayedQuestion.pkQsid != 28 &&
              +this.displayedQuestion.pkQsid != 29 &&
              +this.displayedQuestion.pkQsid != 30
            ) {
              this.ngOnInit();
            }
          }
        }
      }
    }
  }

  // called when user is editing records from profile
  // used for checking which next question is NOT ANSWERED
  recordEditing() {
    this.scrollIntoView();
    this.aadharNameFromDigi = "";
    // this.clearTimer();
    setTimeout(() => {
      this.selectedRadioOption = "";
    }, 10);

    this.ocrMessage = "";
    this.selectedImage = "";
    for (let i = 0; i < this.editRecordList.length; i++) {
      if (+this.editRecordList[i]["pkQsid"] > +this.displayedQuestion.pkQsid) {
        if (
          this.editRecordList[i]["pkQsid"] == "9" ||
          this.editRecordList[i]["pkQsid"] == "14" ||
          this.editRecordList[i]["pkQsid"] == "17" ||
          this.editRecordList[i]["pkQsid"] == "18" ||
          this.editRecordList[i]["pkQsid"] == "19" ||
          // this.editRecordList[i]["pkQsid"] == "20" ||
          // this.editRecordList[i]["pkQsid"] == "21" ||
          // this.editRecordList[i]["pkQsid"] == "22" ||
          this.editRecordList[i]["pkQsid"] == "23" ||
          this.editRecordList[i]["pkQsid"] == "25" ||
          this.editRecordList[i]["pkQsid"] == "26" ||
          this.editRecordList[i]["pkQsid"] == "31"
        ) {
          if (this.editRecordList[i]["qs_ans_status"] == "Not Answered") {
            // this.displayedQuestion = this.editRecordList[i];
            // localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            // break;
            this.userExists();
            break;
          } else {
            if (this.editRecordList[i]["pkQsid"] == "31") {
              // this.router.navigate(["/profile"]);
              this.userExists();
              break;
            }
          }
        }
      } else {
        if (this.editRecordList[i]["pkQsid"] == "31") {
          // this.router.navigate(["/profile"]);
          this.userExists();
          break;
        }
      }
    }
  }

  // AADHAR OCR and VERIFICATIOn for SELF and SPOUSE
  async uploadAadharImage() {
    localStorage.setItem("lastRoute", this.router.url);
    this.changeOcrFlagIfEditTrue();
    this.displayProgressSpinner();
    this.isQrScan = false;
    // let regId = null;
    // if(this.displayedQuestion.qsQuestion.toLowerCase().includes('spouse')){
    //   regId = localStorage.getItem('regId');
    // }
    // else{
    //   regId = null;
    // }
    const fileObj = {
      quesId: this.displayedQuestion.pkQsid,
      quesCode: this.displayedQuestion.qsCode,
      regId: localStorage.getItem("regId"),
      ansOption: "",
      aadharNo: "",
      docuLocation: "",
      mediaType: "image",
      qrCodeDto: this.scannedQrData[0],
      frontImage: "",
      backImage: "",
    };

    this.spouseFlag();
    // if (this.selfSpouseSw == "S") {
    //   this.ocrAadharV4(fileObj);
    // } else {
    //   this.ocrAadharV3(fileObj);
    // }
    this.ocrAadharV3(fileObj);
  }

  async ocrAadharV3(fileObj: any) {
    const response: any = await this.questionAnswerService.ocrAadharV3(
      this.frontImageBlob,
      this.backImageBlob,
      JSON.stringify(fileObj),
      this.selfSpouseSw
    );
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        let ocrResult: any = JSON.parse(response.ocrString);
        if (ocrResult.status.toLowerCase() == "success") {
          localStorage.setItem("aadhar_ocr", JSON.stringify(ocrResult.data));
          this.ocrIdOnImage = ocrResult.data.aadhar_number;
          this.aadharNo = this.ocrIdOnImage;
          response.qusId = this.displayedQuestion.pkQsid;
          response.selfSpouseSw = this.selfSpouseSw;
          response.aadharNo = this.aadharNo;
          response.ocrString = JSON.parse(response.ocrString);
          // response.ocrString = '';
          localStorage.setItem("aadhar_number", this.aadharNo);
          if (localStorage.aadhar_name == null) {
            localStorage.setItem("aadhar_name", ocrResult.data.aadhar_name);
            localStorage.setItem("aadhar_address", ocrResult.data.aadhar_address);
            localStorage.setItem("aadhar_card_holder_photo", ocrResult.data.aadhar_card_holder_photo);
          }
          localStorage.setItem("aadhar_response", JSON.stringify(response));
          localStorage.setItem("docuLocation", response.documentLocation);
          // this.successToast("Aadhar card uploaded successfully.");
          // if (+this.displayedQuestion.pkQsid == 2) {
          this.customSnackBar([ocrResult.data.aadhar_name, this.ocrIdOnImage, "aadhar", "Aadhar"]);
          // } else {
          //   this.scrollIntoView();
          //   this.isImageUploaded = true;
          //   this.progressSpinnerDialog.close();
          // }

          if (this.selfSpouseSw == "S" && response.ocrAlisName != "" && response.ocrAlisName != null) {
            this.multipleNameCheck(ocrResult.data.aadhar_name, response.ocrAlisName, "aadhar");
          }
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          this.backendWarningToast(ocrResult);
        }
      } else {
        this.selectedImage = "";
        this.selectedBackImage = "";
        this.ocrMessage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }

  // async ocrAadharV4(fileObj: any) {
  //   const response: any = await this.questionAnswerService.ocrAadharV4(
  //     this.frontImageBlob,
  //     this.backImageBlob,
  //     JSON.stringify(fileObj),
  //     this.selfSpouseSw
  //   );
  //   if (response != null && !response.error) {
  //     if (response.status.toLowerCase() == "success") {
  //       let ocrResult: any = JSON.parse(response.ocrString);
  //       if (ocrResult.status.toLowerCase() == "success") {
  //         localStorage.setItem("aadhar_ocr", JSON.stringify(ocrResult.data));
  //         this.ocrIdOnImage = ocrResult.data.aadhar_number;
  //         this.aadharNo = this.ocrIdOnImage;
  //         response.qusId = this.displayedQuestion.pkQsid;
  //         response.selfSpouseSw = this.selfSpouseSw;
  //         response.aadharNo = this.aadharNo;
  //         response.ocrString = JSON.parse(response.ocrString);
  //         // response.ocrString = '';
  //         localStorage.setItem("aadhar_number", this.aadharNo);
  //         if (localStorage.aadhar_name == null) {
  //           localStorage.setItem("aadhar_name", ocrResult.data.aadhar_name);
  //           localStorage.setItem("aadhar_address", ocrResult.data.aadhar_address);
  //           localStorage.setItem("aadhar_card_holder_photo", ocrResult.data.aadhar_card_holder_photo);
  //         }
  //         localStorage.setItem("aadhar_response", JSON.stringify(response));
  //         localStorage.setItem("docuLocation", response.documentLocation);
  //         // this.successToast("Aadhar card uploaded successfully.");
  //         this.customSnackBar([ocrResult.data.aadhar_name, this.ocrIdOnImage, "aadhar", "Aadhar"]);
  //         if (this.selfSpouseSw == "S" && response.ocrAlisName != "" && response.ocrAlisName != null) {
  //           this.multipleNameCheck(ocrResult.data.aadhar_name, response.ocrAlisName, "aadhar");
  //         }
  //       } else {
  //         this.backendWarningToast(ocrResult);
  //       }
  //     } else {
  //       this.selectedImage = "";
  //       this.selectedBackImage = "";
  //       this.ocrMessage = "";
  //       this.ocrIdOnImage = "";
  //       this.isUploadImageVisible = false;
  //       this.backendWarningToast(response);
  //     }
  //   } else {
  //     this.errorToast(response);
  //   }
  // }
  async verifyAadhar() {
    this.aadharNameFromDigi = "";
    this.displayProgressSpinner();
    this.spouseFlag();
    const response: any = await this.questionAnswerService.verifyAadhar(localStorage.getItem("aadhar_response"));
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        this.isOcrDone = "No";
        this.aadharNameFromDigi = "";
        localStorage.setItem("regId", response.regId);
        this.successToast(this.translocoService.translate("aadhar-card-success"));
        if (this.isEdit == "true") {
          this.editSpousePan();
        } else {
          this.nextQuestion(this.displayedQuestion);
        }
      } else if (response.status.toLowerCase() == "same as applicant") {
        this.reUploadImage();
        this.frontendWarningToast(this.translocoService.translate("warning-same-aadhar-for-spouse"));
      } else {
        this.reUploadImage();
        this.frontendWarningToast(this.translocoService.translate("warning-document-mismatch-for-self-aadhar"));
      }
    } else {
      this.errorToast(response);
    }
  }

  // Called for AADHAR Question only for setting button labels in either ENGLISH or MARATHI
  async next() {
    if (this.displayedQuestion.qsCode == "Q_AADHAR") {
      if (this.isQrScan == true) {
        if (this.activeLang == "mr") {
          if (this.nextButtonLabel == "पुढे") {
            this.nextButtonLabel = "पडताळणी करा";
            this.isQrScan = false;
            this.selectedImage = "";
            this.selectedBackImage = "";
          } else {
            this.isQrScan = false;
          }
        } else {
          if (this.nextButtonLabel == "Next") {
            this.nextButtonLabel = "Verify";
            this.isQrScan = false;
            this.selectedImage = "";
            this.selectedBackImage = "";
          } else {
            this.isQrScan = false;
          }
        }
      } else {
        if (this.selectedImage == "" && this.selectedBackImage == "") {
          this.frontendWarningToast(this.translocoService.translate("warning-upload-aadhar-back-image"));
        } else {
          this.ocrMessage = "";
          if (this.isEdit == "true" && this.isOcrDone == "No") {
            this.editSpousePan();
          } else {
            this.verifyAadhar();
          }
        }
      }
    }
  }
  // END

  // PAN OCR and VERIFICATIOn for SELF and SPOUSE
  async uploadPanImage() {
    this.panAliasName = "null";
    this.changeOcrFlagIfEditTrue();
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    this.spouseFlag();
    const response: any = await this.questionAnswerService.ocrPanV3(
      this.frontImageBlob,
      JSON.stringify(this.fileObj),
      this.selfSpouseSw
    );
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        let ocrResult: any = JSON.parse(response.ocrString);
        if (ocrResult.status.toLowerCase() == "success") {
          this.ocrIdOnImage = ocrResult.data.pan_number;
          this.panName = ocrResult.data.pan_name;
          if (localStorage.getItem("main_pan_no") == null) {
            localStorage.setItem("main_pan_no", ocrResult.data.pan_number);
          }
          localStorage.setItem("pan_number", ocrResult.data.pan_number);
          localStorage.setItem("docuLocation", response.documentLocation);
          // this.successToast("PAN card uploaded successfully.");
          this.customSnackBar([this.ocrIdOnImage, "common", "PAN"]);
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          this.backendWarningToast(ocrResult);
        }
      } else if (response.status.toLowerCase() == "rejected-mismatch") {
        this.selectedImage = "";
        this.isUploadImageVisible = false;
        this.frontendWarningToast(this.translocoService.translate("warning-rejected-mismatch"));
      } else if (response.status.toLowerCase() == "same-as-applicant") {
        this.selectedImage = "";
        this.isUploadImageVisible = false;
        this.frontendWarningToast(this.translocoService.translate("spouse-pan-same-as-applicant"));
      } else {
        this.selectedImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }

  async verifyPan(panNo: any) {
    if (this.isEdit == "true" && this.isOcrDone == "No") {
      this.editWorkingStatus();
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      const response: any = await this.questionAnswerService.verifyPan(
        this.fileObj,
        this.selfSpouseSw,
        this.panAliasName
      );
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success" || response.status.toLowerCase() == "verified") {
          this.successToast(this.translocoService.translate("pan-card-success"));
          if (+this.displayedQuestion.pkQsid == 3 || +this.displayedQuestion.pkQsid == 11) {
            this.nextQuestion(this.displayedQuestion);
          } else if (this.isEdit == "true") {
            this.editWorkingStatus();
          } else {
            this.nextQuestion(this.displayedQuestion);
          }
        } else if (response.status == "PAN-API-FAIL") {
          alert(this.translocoService.translate("pan-api-fail"));
        } else if (response.status == "API-FAILURE") {
          alert(this.translocoService.translate("pan-api-down"));
        } else if (response.status.toLowerCase() == "rejected-duplicate") {
          const eSignDoc = this.dialog.open(CheckMhadaLotteryWinnerComponent, {
            disableClose: true,
            width: "600px",
            data: [this.displayedQuestion, this.selfSpouseSw],
          });
          eSignDoc.afterClosed().subscribe((result) => {
            if (result == "No") {
              this.progressSpinnerDialog.close();
              if (+this.displayedQuestion.pkQsid == 3) {
                this.nextQuestion(this.displayedQuestion);
              } else {
                if (this.isEdit == "true") {
                  this.editWorkingStatus();
                } else {
                  this.nextQuestion(this.displayedQuestion);
                }
              }
            } else if (result == "reupload") {
              this.reUploadImage();
              this.frontendWarningToast(this.translocoService.translate("warning-unable-to-verify-doc"));
            } else {
              this.frontendWarningToast(this.translocoService.translate("warning-pan-already-verified"));
              // this.displayProgressSpinner();
              // setTimeout(() => {
              //   this.progressSpinnerDialog.close();
              //   this.routeToHome();
              // }, 4000);
              if (+this.displayedQuestion.pkQsid == 3) {
                this.nextQuestion(this.displayedQuestion);
              } else {
                if (this.isEdit == "true") {
                  this.editWorkingStatus();
                } else {
                  this.nextQuestion(this.displayedQuestion);
                }
              }
            }
          });
        } else {
          this.reUploadImage();
          this.frontendWarningToast(this.translocoService.translate("warning-document-mismatch"));
        }
      } else {
        this.errorToast(response);
      }
    }
  }

  async verifyPanDetails() {
    if (this.isEdit == "true" && this.isOcrDone == "No") {
      this.editWorkingStatus();
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      const response: any = await this.questionAnswerService.verifyPanDetails(this.fileObj, this.selfSpouseSw);
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          this.successToast(this.translocoService.translate("pan-card-success"));
          // if (this.selfSpouseSw == "S" && response.alisName != "" && response.alisName != null) {
          if (response.alisName != "" && response.alisName != null) {
            this.panAliasName = response.alisName;
            this.multipleNameCheck(this.panName, response.alisName, "pan");
          }
          //  else if (this.selfSpouseSw == "W" && response.spouseAlisName != "" && response.spouseAlisName != null) {
          //   this.panAliasName = response.spouseAlisName;
          //   this.multipleNameCheck(this.panName, response.alisName, "pan");
          // }
          else {
            this.verifyPan("");
          }

          // if (this.isEdit == "true") {
          //   this.editWorkingStatus();
          // } else {
          //   this.nextQuestion(this.displayedQuestion);
          // }
        } else if (response.status == "PAN-API-FAIL") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedImage = "";
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          setTimeout(() => {
            this.isUploadImageVisible = false;
          }, 10);
          alert(this.translocoService.translate("pan-api-fail"));
        } else if (response.status == "API-FAILURE") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedImage = "";
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          setTimeout(() => {
            this.isUploadImageVisible = false;
          }, 10);
          alert(this.translocoService.translate("pan-api-down"));
        } else if (response.status.toLowerCase() == "rejected-duplicate") {
          const eSignDoc = this.dialog.open(CheckMhadaLotteryWinnerComponent, {
            disableClose: true,
            width: "600px",
            data: [this.displayedQuestion, this.selfSpouseSw],
          });
          eSignDoc.afterClosed().subscribe((result) => {
            if (result == "No") {
              this.progressSpinnerDialog.close();
              if (+this.displayedQuestion.pkQsid == 3) {
                this.nextQuestion(this.displayedQuestion);
              } else {
                if (this.isEdit == "true") {
                  this.editWorkingStatus();
                } else {
                  this.nextQuestion(this.displayedQuestion);
                }
              }
            } else if (result == "reupload") {
              this.reUploadImage();
              this.frontendWarningToast(this.translocoService.translate("warning-unable-to-verify-doc"));
            } else {
              this.frontendWarningToast(this.translocoService.translate("warning-pan-already-verified"));
              // this.displayProgressSpinner();
              // setTimeout(() => {
              //   this.progressSpinnerDialog.close();
              //   this.routeToHome();
              // }, 4000);
              if (+this.displayedQuestion.pkQsid == 3) {
                this.nextQuestion(this.displayedQuestion);
              } else {
                if (this.isEdit == "true") {
                  this.editWorkingStatus();
                } else {
                  this.nextQuestion(this.displayedQuestion);
                }
              }
            }
          });
        } else {
          this.reUploadImage();
          this.frontendWarningToast(this.translocoService.translate("warning-document-mismatch"));
        }
      } else {
        this.errorToast(response);
      }
    }
  }
  // END

  // DOMICILE OCR and Verify
  async uploadDomicileImage() {
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.ocrDomicileV3(
      this.frontImageBlob,
      JSON.stringify(this.fileObj)
    );
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      this.isOcrDone = "Yes";
      if (response.status.toLowerCase() == "success") {
        localStorage.setItem("docuLocation", response.documentLocation);
        let ocrResult: any = JSON.parse(response.ocrString);
        if (ocrResult.status.toLowerCase() == "success") {
          this.ocrIdOnImage = ocrResult.data.domicile_certificate_number;
          this.responseDomicile = this.ocrIdOnImage;
          // this.successToast("Domicile uploaded successfully.");
          this.customSnackBar([this.ocrIdOnImage, "common", "Domicile"]);
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          // this.backendWarningToast(ocrResult);
        }
      } else {
        this.selectedImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }

  async updateDomicileToken() {
    this.ocrIdOnImage = this.domicileToken;
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.updateDomicileApplicationToken(this.fileObj);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.toLowerCase() == "success") {
        this.successToast(this.translocoService.translate("domicile-token-success"));
        this.jumpToQuestion(this.displayedQuestion);
      } else {
        this.reUploadImage();
        this.errorToast(this.translocoService.translate("error-network-related"));
      }
    } else {
      this.errorToast(response);
    }
  }

  async verifyDomicile(responseDomicile: any) {
    if (this.isEdit == "true" && this.isOcrDone == "No") {
      this.recordEditing();
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      const response: any = await this.questionAnswerService.verifyDomicile(this.fileObj);
      this.isOcrDone = "No";
      this.progressSpinnerDialog.close();
      if (response != null && !response.error) {
        if (response != null) {
          if (this.isEdit == "true") {
            if (response.status != "FAILURE") {
              this.recordEditing();
            } else {
              this.displayProgressSpinner();
              const toast = await this.toastController.create({
                message: this.translocoService.translate("document-verification-pending"),
                icon: "information-circle",
                position: "top",
                cssClass: "toast warning-toast",
                duration: 5000,
              });
              toast.present();
              setTimeout(() => {
                this.progressSpinnerDialog.close();
                this.jumpToQuestion(this.displayedQuestion);
              }, 5000);
            }
          } else {
            if (response.status.toLowerCase() == "success" || response.status.toLowerCase() == "verified") {
              this.successToast(this.translocoService.translate("domicile-success"));
              this.jumpToQuestion(this.displayedQuestion);
            } else {
              // this.frontendWarningToast("Could not verify domicile.");
              this.displayProgressSpinner();
              const toast = await this.toastController.create({
                message: this.translocoService.translate("document-verification-pending"),
                icon: "checkmark-circle-outline",
                position: "top",
                cssClass: "toast success-toast",
                duration: 5000,
              });
              toast.present();
              setTimeout(() => {
                this.progressSpinnerDialog.close();
                this.jumpToQuestion(this.displayedQuestion);
              }, 5000);
            }
          }
        } else {
          this.reUploadImage();
          this.frontendWarningToast(this.translocoService.translate("warning-document-mismatch"));
        }
      } else {
        this.errorToast(response);
      }
    }
  }
  // END

  // SELF and SPOUSE INCOME CERT and ITR OCR and VERIFY
  itrOcrResponse: any = null;
  // async uploadSelfItrImage() {
  //   this.itrOcrResponse = "";
  //   this.changeOcrFlagIfEditTrue();
  //   this.displayProgressSpinner();
  //   this.requestDtoStringForMcq();
  //   this.spouseFlag();
  //   const response: any = await this.questionAnswerService.ocrSelfItrV3(
  //     this.frontImageBlob,
  //     JSON.stringify(this.fileObj),
  //     this.selfSpouseSw
  //   );
  //   this.isOcrDone = "Yes";
  //   if (response != null && !response.error) {
  //     if (response.status.toLowerCase() == "success") {
  //       localStorage.setItem("docuLocation", response.documentLocation);
  //       let ocrResult: any = JSON.parse(response.ocrString);
  //       this.itrOcrResponse = response.ocrString;
  //       if (ocrResult.status.toLowerCase() == "success") {
  //         this.ocrIdOnImage = ocrResult.data.itr_acknowledgement_number;
  //         this.itrOcrResponseString = ocrResult;
  //         // this.successToast("ITR uploaded successfully.");
  //         this.scrollIntoView();
  //         this.isImageUploaded = true;
  //         this.progressSpinnerDialog.close();
  //         alert(
  //           this.translocoService.translate("custom-itr-name") +
  //             ocrResult.data.itr_name +
  //             this.translocoService.translate("custom-itr-acknowledgement-no") +
  //             this.ocrIdOnImage +
  //             this.translocoService.translate("custom-for-ay") +
  //             ocrResult.data.itr_assessment_year +
  //             this.translocoService.translate("custom-total-income") +
  //             ocrResult.data.itr_total_income
  //         );
  //         // this.customSnackBar([
  //         //   this.ocrIdOnImage,
  //         //   "itr",
  //         //   ocrResult.data.itr_assessment_year,
  //         //   ocrResult.data.itr_total_income,
  //         //   ocrResult.data.itr_name,
  //         // ]);
  //       } else if (ocrResult.status == "Unable to Connect") {
  //         this.ocrWarningToast(ocrResult.status);
  //       } else {
  //         this.backendWarningToast(ocrResult);
  //       }
  //     } else {
  //       this.selectedImage = "";
  //       this.ocrIdOnImage = "";
  //       this.isUploadImageVisible = false;
  //       this.backendWarningToast(response);
  //     }
  //   } else {
  //     this.reUploadImage();
  //     this.errorToast(response);
  //   }
  // }

  itrAssessmentYear: string = "";
  itrIncome: string = "";
  itrName: string = "";
  itrEdited: string = "";
  async uploadSelfItrImage() {
    this.itrAssessmentYear = "";
    this.itrIncome = "";
    this.itrName = "";
    this.itrEdited = "";
    this.itrOcrResponse = "";
    this.changeOcrFlagIfEditTrue();
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    this.spouseFlag();
    const response: any = await this.questionAnswerService.ocrSelfItrV3(
      this.frontImageBlob,
      JSON.stringify(this.fileObj),
      this.selfSpouseSw
    );
    this.isOcrDone = "Yes";
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        localStorage.setItem("docuLocation", response.documentLocation);
        let ocrResult: any = JSON.parse(response.ocrString);
        this.itrOcrResponse = response.ocrString;
        this.ocrIdOnImage = "null";
        this.itrOcrResponseString = ocrResult;
        // this.successToast("ITR uploaded successfully.");
        this.scrollIntoView();
        this.isImageUploaded = true;
        this.progressSpinnerDialog.close();
        if (ocrResult.status.toLowerCase() == "success") {
          // alert(
          //   this.translocoService.translate("custom-itr-name") +
          //     ocrResult.data.itr_name +
          //     this.translocoService.translate("custom-itr-acknowledgement-no") +
          //     this.ocrIdOnImage +
          //     this.translocoService.translate("custom-for-ay") +
          //     ocrResult.data.itr_assessment_year +
          //     this.translocoService.translate("custom-total-income") +
          //     ocrResult.data.itr_total_income
          // );
          const itrDialog = this.dialog.open(EnterItrDetailsComponent, {
            disableClose: true,
            width: "600px",
            data: [
              this.translocoService.translate("custom-itr-name"),
              ocrResult.data.itr_name,
              this.translocoService.translate("custom-for-ay"),
              ocrResult.data.itr_assessment_year,
              this.translocoService.translate("custom-total-income"),
              ocrResult.data.itr_total_income,
            ],
          });
          itrDialog.afterClosed().subscribe((result) => {
            if (result == "No") {
              this.isImageUploaded = false;
              this.selectedImage = "";
              this.selectedBackImage = "";
              this.ocrMessage = "";
              this.frontImageBlob = null;
              this.backImageBlob = null;
              this.selectedRadioOption = "";
              setTimeout(() => {
                this.isUploadImageVisible = false;
              }, 10);
              return;
            }
            this.itrAssessmentYear = result.itrAssessmentYear;
            this.itrIncome = result.itrIncome;
            this.itrName = result.itrName;
            this.itrEdited = result.isEdit;
            let data = JSON.parse(this.itrOcrResponse);
            data.data.itr_assessment_year = result.itrAssessmentYear;
            data.data.itr_total_income = result.itrIncome;
            data.data.itr_name = result.itrName;
            this.itrOcrResponse = JSON.stringify(data);
            if (
              this.displayedQuestion.qsCode == "Q_ITR" ||
              this.displayedQuestion.qsCode == "Q_ITR_SPOUSE" ||
              this.displayedQuestion.qsCode == "Q_SELF_ITR" ||
              this.displayedQuestion.qsCode == "Q_SPOUSE_ITR"
            ) {
              if (this.isEdit == "true") {
                if (this.isOcrDone == "Yes") {
                  this.verifyYear("T");
                } else {
                  if (this.displayedQuestion.qsCode == "Q_ITR") {
                    this.selectedImage = "";
                    this.displayedQuestion = this.allQuestions[28];
                    if (
                      this.editRecordList[14].qs_ans_status == "Verified" ||
                      this.editRecordList[14].qs_ans_status == "Not-Verified"
                    ) {
                      this.viewPreuploadImages(this.editRecordList[14]);
                      this.isImageUploaded = true;
                    }
                  } else {
                    this.recordEditing();
                  }
                }
              } else {
                this.verifyYear("T");
              }
            }
          });

          // this.customSnackBar([
          //   this.ocrIdOnImage,
          //   "itr",
          //   ocrResult.data.itr_assessment_year,
          //   ocrResult.data.itr_total_income,
          //   ocrResult.data.itr_name,
          // ]);
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          this.backendWarningToast(ocrResult);
        }
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }

  async uploadSelfIncomeCertificateImage() {
    this.changeOcrFlagIfEditTrue();
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    this.spouseFlag();
    this.itrAssessmentYear = "";
    this.itrIncome = "";
    this.itrName = "";
    this.itrEdited = "";
    this.itrOcrResponse = "";
    const response: any = await this.questionAnswerService.ocrIncomeVertV3(
      this.frontImageBlob,
      JSON.stringify(this.fileObj),
      this.selfSpouseSw
    );
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        localStorage.setItem("docuLocation", response.documentLocation);
        let ocrResult: any = JSON.parse(response.ocrString);
        this.itrOcrResponseString = ocrResult;
        if (ocrResult.status.toLowerCase() == "success") {
          this.ocrIdOnImage = ocrResult.data.income_certificate_number;
          // this.successToast("Income certificate uploaded successfully.");
          this.customSnackBar([this.ocrIdOnImage, "common", "Income Certificate"]);
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          // this.backendWarningToast(ocrResult);
          this.progressSpinnerDialog.close();
          const toast = await this.toastController.create({
            message: this.translocoService.translate("warning-income-certificate"),
            icon: "checkmark-circle-outline",
            position: "top",
            cssClass: "toast success-toast",
            duration: 5000,
          });
          toast.present();
        }
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast(response);
      }
    } else {
      this.reUploadImage();
      this.errorToast(response);
    }
  }

  async verifyYear(type: string) {
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.verifyYear(this.itrOcrResponse);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.toLowerCase() == "success") {
        this.verifyIncomeCert(type);
      } else if (response.toLowerCase() == "failure") {
        this.frontendWarningToast(this.translocoService.translate("warning-unable-to-verify-doc"));
        setTimeout(() => {
          this.selectedImage = "";
          this.ocrIdOnImage = "";
          this.isUploadImageVisible = false;
          this.selectedRadioOption = "";
        }, 10);
      } else {
        setTimeout(() => {
          this.selectedImage = "";
          this.ocrIdOnImage = "";
          this.isUploadImageVisible = false;
          this.selectedRadioOption = "";
        }, 10);
        this.frontendWarningToast(
          "Uploaded ITR seems to be of older period. Kindly upload ITR of <b>" + response + "</b>, to proceed."
        );
      }
    } else {
      this.errorToast(response);
    }
  }

  async verifyIncomeCert(type: any) {
    if (this.isEdit == "true" && +this.displayedQuestion.pkQsid == 28 && this.isOcrDone == "No") {
      this.displayedQuestion = this.allQuestions[28];
      // this.isOcrDone = "Yes";
    } else if (this.isEdit == "true" && +this.displayedQuestion.pkQsid == 28 && this.isOcrDone == "Yes") {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      this.spouseFlag();
      const response: any = await this.questionAnswerService.verifyIncomeCertV1(
        JSON.stringify(this.fileObj),
        this.selfSpouseSw,
        type,
        this.itrName,
        this.itrAssessmentYear,
        "null",
        this.itrIncome,
        this.itrEdited
      );
      this.itrOcrResponseString = null;
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success" || response.status.toLowerCase() == "verified") {
          this.successToast(this.translocoService.translate("itr-success"));
          this.displayedQuestion = this.allQuestions[28];
          this.selectedImage = "";
          this.isImageUploaded = false;
          this.isOcrDone = "Yes";
        } else if (response.status.toLowerCase() == "not-verified") {
          this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
          this.displayedQuestion = this.allQuestions[28];
          this.selectedImage = "";
          this.isImageUploaded = false;
          this.isOcrDone = "Yes";
        } else if (response.status.toLowerCase() == "rejected-mismatch") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          alert(this.translocoService.translate("document-rejected-mismatch"));
          setTimeout(() => {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        } else if (response.status.toLowerCase() == "rejected" && type == "I") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          setTimeout(() => {
            this.selectedImage = "";
            this.ocrIdOnImage = "";
            this.isUploadImageVisible = false;
            this.selectedRadioOption = "";
          }, 10);
          this.frontendWarningToastPlain(
            "Uploaded income certificate seems to be of older period. Kindly upload latest income certificate, to proceed."
          );
        } else {
          this.frontendWarningToast(this.translocoService.translate("warning-unable-to-verify-doc"));

          setTimeout(() => {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        }
      } else {
        this.errorToastServer(response);
      }
    } else if (this.isEdit == "true" && +this.displayedQuestion.pkQsid == 29 && this.isOcrDone == "No") {
      this.recordEditing();
    } else if (this.isEdit == "true" && +this.displayedQuestion.pkQsid == 29 && this.isOcrDone == "Yes") {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      this.spouseFlag();
      const response: any = await this.questionAnswerService.verifyIncomeCertV1(
        JSON.stringify(this.fileObj),
        this.selfSpouseSw,
        type,
        this.itrName,
        this.itrAssessmentYear,
        "null",
        this.itrIncome,
        this.itrEdited
      );
      this.itrOcrResponseString = null;
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success" || response.status.toLowerCase() == "verified") {
          this.successToast(this.translocoService.translate("itr-success"));
          this.recordEditing();
          this.selectedImage = "";
          this.isImageUploaded = false;
        } else if (response.status.toLowerCase() == "not-verified") {
          this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
          this.recordEditing();
          this.selectedImage = "";
          this.isImageUploaded = false;
        } else if (response.status.toLowerCase() == "rejected-mismatch") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          alert(this.translocoService.translate("document-rejected-mismatch"));
          setTimeout(() => {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        } else if (response.status.toLowerCase() == "rejected" && type == "I") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          setTimeout(() => {
            this.selectedImage = "";
            this.ocrIdOnImage = "";
            this.isUploadImageVisible = false;
            this.selectedRadioOption = "";
          }, 10);
          this.frontendWarningToastPlain(
            "Uploaded income certificate seems to be of older period. Kindly upload latest income certificate, to proceed."
          );
        } else {
          // this.frontendWarningToast("Unable to verify the document.");
          // this.customSnackBar(["custom"]);
          this.progressSpinnerDialog.close();
          this.frontendWarningToastPlain(this.translocoService.translate("warning-unable-to-verify-doc"));
          setTimeout(() => {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        }
      } else {
        this.errorToastServer(response);
      }
    } else if (this.isEdit == "true" && +this.displayedQuestion.pkQsid == 8 && this.isOcrDone == "Yes") {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      this.spouseFlag();
      const response: any = await this.questionAnswerService.verifyIncomeCertV1(
        JSON.stringify(this.fileObj),
        this.selfSpouseSw,
        type,
        this.itrName,
        this.itrAssessmentYear,
        "null",
        this.itrIncome,
        this.itrEdited
      );
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success" || response.status.toLowerCase() == "verified") {
          let message = "";
          if (type == "I") {
            message = this.translocoService.translate("income-success");
          } else {
            message = this.translocoService.translate("itr-success");
          }
          this.successToast(message);
          this.recordEditing();
        } else if (response.status.toLowerCase() == "not-verified") {
          this.progressSpinnerDialog.close();
          this.frontendWarningToastPlain(this.translocoService.translate("document-verification-pending"));
          this.recordEditing();
        } else if (type == "T" && response.status.toLowerCase() == "rejected-mismatch") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          alert(this.translocoService.translate("document-rejected-mismatch"));
          setTimeout(() => {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        } else if (response.status.toLowerCase() == "rejected" && type == "I") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          // this.selectedRadioOption = "";
          this.selectedImage = "";
          this.ocrIdOnImage = "";
          // setTimeout(() => {
          //   this.isUploadImageVisible = false;
          //   // this.selectedRadioOption = "";
          // }, 10);
          this.reUploadImageIncCert();
          this.frontendWarningToastPlain(
            "Uploaded income certificate seems to be of older period. Kindly upload latest income certificate, to proceed."
          );
        } else if(response.status.toLowerCase() == "rejected-income-mismatch" && type == "I") {
          this.isImageUploaded = false;
          this.ocrMessage = "";
          this.backImageBlob = null;
          this.frontImageBlob = null;
          this.progressSpinnerDialog.close();
          this.selectedImage = "";
          this.ocrIdOnImage = "";
          // this.isUploadImageVisible = false;
          this.reUploadImageIncCert();
          this.frontendWarningToastPlain(
            "Income from Uploaded income certificate does not match Income details entered by Applicant."
          );
        } else {
          this.progressSpinnerDialog.close();
          if (type == "I") {
            this.frontendWarningToastPlain(this.translocoService.translate("document-verification-pending"));
            this.recordEditing();
          } else {
            this.frontendWarningToastPlain(this.translocoService.translate("warning-unable-to-verify-doc"));
            setTimeout(() => {
              this.selectedImage = "";
              this.isUploadImageVisible = false;
            }, 10);
          }
        }
      } else {
        this.errorToastServer(response);
      }
    } else if (this.isEdit == "true" && this.isOcrDone == "No") {
      this.editItrIncomeCert();
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      this.spouseFlag();
      const response: any = await this.questionAnswerService.verifyIncomeCertV1(
        JSON.stringify(this.fileObj),
        this.selfSpouseSw,
        type,
        this.itrName,
        this.itrAssessmentYear,
        "null",
        this.itrIncome,
        this.itrEdited
      );
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success" || response.status.toLowerCase() == "verified") {
          let message = "";
          if (type == "I") {
            message = this.translocoService.translate("income-success");
          } else {
            message = this.translocoService.translate("itr-success");
          }
          this.successToast(message);
          this.nextQuestion(this.displayedQuestion);
        } else if (response.status.toLowerCase() == "not-verified") {
          this.progressSpinnerDialog.close();
          this.frontendWarningToastPlain(this.translocoService.translate("document-verification-pending"));
          this.nextQuestion(this.displayedQuestion);
        } else if (type == "T" && response.status.toLowerCase() == "rejected-mismatch") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          alert(this.translocoService.translate("document-rejected-mismatch"));
          setTimeout(() => {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        } else if (response.status.toLowerCase() == "rejected" && type == "I") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          setTimeout(() => {
            this.selectedImage = "";
            this.ocrIdOnImage = "";
            this.isUploadImageVisible = false;
            this.selectedRadioOption = "";
          }, 10);
          this.frontendWarningToastPlain(
            "Uploaded income certificate seems to be of older period. Kindly upload latest income certificate, to proceed."
          );
        } else {
          if (type == "I") {
            this.progressSpinnerDialog.close();
            this.frontendWarningToastPlain(this.translocoService.translate("document-verification-pending"));
            if (this.isEdit == "true") {
              this.recordEditing();
            } else {
              this.nextQuestion(this.displayedQuestion);
            }
          } else {
            this.progressSpinnerDialog.close();
            this.frontendWarningToastPlain(this.translocoService.translate("warning-unable-to-verify-doc"));
            setTimeout(() => {
              this.selectedImage = "";
              this.isUploadImageVisible = false;
            }, 10);
          }
          setTimeout(() => {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
          // if (this.isEdit == "true") {
          //   this.recordEditing();
          // } else {
          //   this.nextQuestion(this.displayedQuestion);
          // }
        }
      } else {
        this.errorToastServer(response);
      }
    }
  }
  // END

  // CASTE selection, CASTE CERTIFICATE and CASTE VALIDITY OCR and VERIFICATION
  async verifyCasteCertValidity(panNo: any) {
    this.requestDtoStringForMcq();
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.verifyCasteCertValidity(JSON.stringify(this.fileObj));
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        this.successToast(this.translocoService.translate("caste-validity-success"));
        if (this.isEdit == "true") {
          this.recordEditing();
        } else {
          this.jumpToQuestion(this.displayedQuestion);
        }
      } else if (response.status.toLowerCase() == "verified") {
        this.successToast(this.translocoService.translate("detail-saved-success"));
        if (this.isEdit == "true") {
          this.recordEditing();
        } else {
          this.jumpToQuestion(this.displayedQuestion);
        }
      } else {
        this.reUploadImage();
        this.frontendWarningToast(this.translocoService.translate("warning-income-certificate"));
        this.jumpToQuestion(this.displayedQuestion);
      }
    } else {
      this.errorToast(response);
    }
  }

  async verifyCasteCert() {
    this.requestDtoStringForMcq();
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.verifyCasteCert(JSON.stringify(this.fileObj));
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        this.successToast(this.translocoService.translate("caste-certificate-success"));
        if (this.isEdit == "true") {
          if (response.caste.toLowerCase() == "open") {
            this.recordEditing();
          } else {
            this.jumpToQuestion(this.displayedQuestion);
          }
        } else {
          this.nextQuestion(this.displayedQuestion);
        }
      } else if (response.status.toLowerCase() == "rejected") {
        this.selectedBackImage = "";
        this.frontImageBlob = null;
        this.backImageBlob = null;
        this.ocrIdOnImage = "";
        this.selectTypeOfDocToUploadVisible = false;
        this.domicileTokenTextFieldVisible = false;
        this.selectedRadioOption = "";
        this.ocrMessage = "";
        setTimeout(() => {
          this.selectedImage = "";
        }, 10);
        this.progressSpinnerDialog.close();
        alert(this.translocoService.translate("document-caste-cert-rejected"));
      } else {
        this.reUploadImage();
        this.frontendWarningToast(this.translocoService.translate("warning-income-certificate"));
        this.displayedQuestion = this.allQuestions[15];
        // setTimeout(() => {
        //   // if (this.isEdit == "true") {
        //   //   this.recordEditing();
        //   // } else {
        //   //   this.nextQuestion(this.displayedQuestion);
        //   // }
        //   this.displayedQuestion = this.allQuestions[15];
        // }, 3000);
      }
    } else {
      this.errorToast(response);
    }
  }
  // END

  // PMAY OCR and VERIFICATION
  async predefinedDocsYesNo(ocrDocWsName: string, docType: string) {
    if (this.isEdit == "true") {
      // if (this.selectedRadioOption == "Yes") {
      if (this.predefinedDocEditFlowOcrDone == false) {
        this.performOcrForPredefinedDocs(ocrDocWsName, docType);
      } else {
        this.recordEditing();
      }
      // }
      // else {
      //   this.uploadPredefinedDoc(uploadDocWsName, question);
      // }
    } else {
      // if (this.selectedRadioOption == "Yes") {
      this.performOcrForPredefinedDocs(ocrDocWsName, docType);
      // }
      // else {
      //   this.uploadPredefinedDoc(uploadDocWsName, question);
      // }
    }
  }

  async allowedWithConditionDocs(wsName: string) {
    if (this.selectedRadioOption == "No") {
      this.frontImageBlob = null;
    }
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.updateForAllowedWithCondition(
      JSON.stringify(this.fileObj),
      wsName
    );
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      this.scrollIntoView();
      if (response.status.toLowerCase() == "success") {
        this.successToast("Detail saved successfully.");
        this.jumpToQuestion(this.displayedQuestion);
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.frontendWarningToast("Unable to save the details");
      }
    } else {
      this.errorToast(response);
    }
  }

  async verifyPredefinedDocs(question: string, uploadDocWsName: string, verifyDocWsName: string) {
    if (this.isEdit == "true") {
      if (
        this.displayedQuestion.qsCode == "Q_ARTIST" ||
        this.displayedQuestion.qsCode == "Q_FREEDOM" ||
        this.displayedQuestion.qsCode == "Q_MLA"
      ) {
        if (this.predefinedDocEditFlowOcrDone == false) {
          this.verifyPredefinedDocWsCall(verifyDocWsName);
        } else {
          this.recordEditing();
        }
      } else if (
        this.selectedRadioOption == "Yes" ||
        this.selectedRadioOption == "Ex Serviceman" ||
        this.selectedRadioOption == "Defence Family"
      ) {
        if (this.predefinedDocEditFlowOcrDone == false) {
          this.verifyPredefinedDocWsCall(verifyDocWsName);
        } else if (this.exServicemanImageReuploaded == true) {
          this.verifyPredefinedDocWsCall(verifyDocWsName);
        } else {
          if (this.displayedQuestion.qsCode == "Q_STATE" || this.displayedQuestion.qsCode == "Q_MHADA") {
            this.displayedQuestion = this.editRecordList[6];
            this.ocrMessage = "";
            this.selectedImage = "";
            localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            if (this.displayedQuestion.qs_doc_document != null) {
              this.selectedRadioOption = "Yes";
              this.viewPreuploadImages(this.displayedQuestion);
            } else if (this.displayedQuestion.qs_ans_status == "Allowed with Condition") {
              this.selectedRadioOption = "No";
              this.domicileTokenTextFieldVisible = true;
              this.domicileToken = this.displayedQuestion.appToken;
            }
          } else {
            this.recordEditing();
          }
        }
      } else {
        this.uploadPredefinedDoc(uploadDocWsName, question);
      }
    } else {
      if (
        this.selectedRadioOption == "Yes" ||
        this.selectedRadioOption == "Ex Serviceman" ||
        this.selectedRadioOption == "Defence Family"
      ) {
        this.verifyPredefinedDocWsCall(verifyDocWsName);
      } else {
        this.uploadPredefinedDoc(uploadDocWsName, question);
      }
    }
  }

  predefinedDocType: string = "";
  async performOcrForPredefinedDocs(ocrDocWsName: string, docType: string) {
    this.predefinedDocType = docType;
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.ocrPredefinedDocs(
      this.frontImageBlob,
      JSON.stringify(this.fileObj),
      ocrDocWsName
    );
    if (response != null && !response.error) {
      this.exServicemanImageReuploaded = true;
      localStorage.setItem("docuLocation", response.documentLocation);
      if (response.status.toLowerCase() == "success") {
        let ocrResult: any = JSON.parse(response.ocrString);
        this.itrOcrResponseString = ocrResult;
        if (ocrResult.status.toLowerCase() == "success") {
          // got seal in OCR
          if (ocrResult.data.certificate_valid_status == true) {
            let isSignStamped = "";
            // ocr document name matches with question
            if (ocrResult.data.certificate_type.toLowerCase().includes(docType.toLowerCase())) {
              isSignStamped = "Sign Stamped";
              this.customSnackBar([ocrResult.data.certificate_type, isSignStamped, "predefined"]);
            } else {
              // isSignStamped = "Non Sign Stamped";
              this.frontendWarningToast(
                this.translocoService.translate("predefined-doc-ocr-doc-type-mismatch-part-1") +
                " " +
                docType +
                " " +
                this.translocoService.translate("predefined-doc-ocr-doc-type-mismatch-part-2")
              );
            }
          } else {
            this.progressSpinnerDialog.close();
            this.frontendWarningToast(this.translocoService.translate("predefined-doc-ocr-seal-status-fail"));
          }
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          // OCR failed
          this.progressSpinnerDialog.close();
          // this.frontendWarningToast(this.translocoService.translate("predefined-doc-ocr-fail"));
          const toast = await this.toastController.create({
            message: this.translocoService.translate("predefined-doc-ocr-fail"),
            icon: "information-circle",
            position: "top",
            cssClass: "toast warning-toast",
            duration: 5000,
          });
          toast.present();
        }
      } else if (response.status == "CertName-Mismatch") {
        this.frontendWarningToast(
          this.translocoService.translate("predefined-doc-ocr-doc-type-mismatch-part-1") +
          " " +
          docType +
          " " +
          this.translocoService.translate("predefined-doc-ocr-doc-type-mismatch-part-2")
        );
      } else if (response.status.toLowerCase() == "rejected") {
        this.frontendWarningToast(
          this.translocoService.translate("predefined-doc-verification-rejected-part-1") +
          this.predefinedDocType +
          this.translocoService.translate("predefined-doc-verification-rejected-part-2")
        );
        this.displayProgressSpinner();
        setTimeout(() => {
          this.progressSpinnerDialog.close();
          this.router.navigate(["/cert-entry", "pan-validation"], { replaceUrl: true });
        }, 5000);
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.frontendWarningToast(this.translocoService.translate("warning-unable-to-upload-doc"));
      }
    } else {
      this.errorToast(response);
    }
  }

  async predefinedDocForState(ocrDocWsName: string, docType: string) {
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.ocrPredefinedDocs(
      this.frontImageBlob,
      JSON.stringify(this.fileObj),
      ocrDocWsName
    );
    if (response != null && !response.error) {
      localStorage.setItem("docuLocation", response.documentLocation);
      if (response.status.toLowerCase() == "success") {
        if (this.isEdit == "true") {
          this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
          this.displayedQuestion = this.editRecordList[6];
          this.selectedRadioOption = this.displayedQuestion.qs_ans;
          this.selectedImage = "";
          if (this.displayedQuestion.qs_doc_document != null) {
            this.selectedRadioOption = "Yes";
            this.viewPreuploadImages(this.displayedQuestion);
          } else if (this.displayedQuestion.qs_ans_status == "Allowed with Condition") {
            this.selectedRadioOption = "No";
            this.domicileTokenTextFieldVisible = true;
            this.domicileToken = this.displayedQuestion.appToken;
          }
        } else {
          this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
          this.nextQuestion(this.displayedQuestion);
        }
      } else if (response.status == "failure") {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.frontendWarningToast(this.translocoService.translate("warning-unable-to-upload-doc"));
      } else if (response.status.toLowerCase() == "rejected") {
        this.frontendWarningToast(
          this.translocoService.translate("predefined-doc-verification-rejected-part-1") +
          this.predefinedDocType +
          this.translocoService.translate("predefined-doc-verification-rejected-part-2")
        );
        this.displayProgressSpinner();
        setTimeout(() => {
          this.progressSpinnerDialog.close();
          this.router.navigate(["/cert-entry", "pan-validation"], { replaceUrl: true });
        }, 5000);
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.frontendWarningToast(this.translocoService.translate("warning-unable-to-upload-doc"));
      }
    } else {
      this.errorToast(response);
    }
  }

  async verifyPredefinedDocWsCall(wsName: string) {
    this.requestDtoStringForMcq();
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.verifyPredefinedDoc(JSON.stringify(this.fileObj), wsName);
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "verified") {
        if (
          (this.displayedQuestion.qsCode == "Q_CENTRAL" || this.displayedQuestion.qsCode == "Q_STATE") &&
          this.selectedRadioOption == "Yes"
        ) {
          this.successToast(this.translocoService.translate("predefined-doc-verified"));
          this.nextQuestion(this.displayedQuestion);
        } else if (this.displayedQuestion.qsCode == "Q_MHADA") {
          this.successToast(this.translocoService.translate("predefined-doc-verified"));
          this.jumpToQuestion(this.displayedQuestion);
        } else if (this.displayedQuestion.qsCode == "Q_EXSERVICEMAN") {
          if (this.isEdit == "true") {
            this.successToast(this.translocoService.translate("predefined-doc-verified"));
            this.jumpToQuestion(this.displayedQuestion);
          } else {
            for (let i = 0; i < this.allQuestions.length; i++) {
              if (this.displayedQuestion.qsOption3NextQuestion == this.allQuestions[i]["pkQsid"]) {
                this.progressSpinnerDialog.close();
                this.ngOnInit();
              }
            }
          }
        } else {
          this.successToast(this.translocoService.translate("predefined-doc-verified"));
          this.jumpToQuestion(this.displayedQuestion);
        }
      } else if (response.status.toLowerCase() == "not-verified") {
        if (
          (this.displayedQuestion.qsCode == "Q_CENTRAL" || this.displayedQuestion.qsCode == "Q_STATE") &&
          this.selectedRadioOption == "Yes"
        ) {
          this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
          this.nextQuestion(this.displayedQuestion);
        } else if (this.displayedQuestion.qsCode == "Q_MHADA") {
          this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
          this.jumpToQuestion(this.displayedQuestion);
        } else if (this.displayedQuestion.qsCode == "Q_EXSERVICEMAN") {
          if (this.isEdit == "true") {
            this.successToast(this.translocoService.translate("predefined-doc-verified"));
            this.jumpToQuestion(this.displayedQuestion);
          } else {
            for (let i = 0; i < this.allQuestions.length; i++) {
              if (this.displayedQuestion.qsOption3NextQuestion == this.allQuestions[i]["pkQsid"]) {
                this.progressSpinnerDialog.close();
                this.ngOnInit();
              }
            }
          }
        } else {
          this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
          this.jumpToQuestion(this.displayedQuestion);
        }

        // this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
        // this.jumpToQuestion(this.displayedQuestion);
      } else {
        this.frontendWarningToast(
          this.translocoService.translate("predefined-doc-verification-rejected-part-1") +
          this.predefinedDocType +
          this.translocoService.translate("predefined-doc-verification-rejected-part-2")
        );
        setTimeout(() => {
          this.progressSpinnerDialog.close();
          this.router.navigate(["/cert-entry", "pan-validation"], { replaceUrl: true });
        }, 5000);
      }
    } else {
      this.errorToast(response);
    }
  }
  // END

  // HANDICAP OCR and VERIFICATION
  // UPLOADING image for OCR
  async uploadHandicapImage() {
    if (this.isEdit == "true") {
      this.isOcrDone = "Yes";
    }
    if (this.selectedRadioOption == "No") {
      this.frontImageBlob = null;
    }
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.ocrDisabledV3(
      this.frontImageBlob,
      JSON.stringify(this.fileObj)
    );
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        localStorage.setItem("docuLocation", response.documentLocation);
        let ocrResult: any = JSON.parse(response.ocrString);
        if (ocrResult.status.toLowerCase() == "success") {
          this.ocrIdOnImage = ocrResult.data.physically_handicapped_number;
          if (this.selectedRadioOption == "No") {
            this.jumpToQuestion(this.displayedQuestion);
            // this.successToast('Handicapped image uploaded successfully.');
            this.customSnackBar([this.ocrIdOnImage, "common", "Handicap"]);
          } else {
            // this.successToast("Handicapped image uploaded successfully.");
            this.customSnackBar([this.ocrIdOnImage, "common", "Handicap"]);
          }
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          // this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          const toast = await this.toastController.create({
            message: this.translocoService.translate("document-verification-pending"),
            icon: "information-circle",
            position: "top",
            cssClass: "toast warning-toast",
            duration: 5000,
          });
          toast.present();
        }
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.frontendWarningToast(this.translocoService.translate("warning-unable-to-upload-doc"));
      }
    } else {
      this.errorToast(response);
    }
  }
  // OCR verification
  async verifyDisablityCert() {
    this.requestDtoStringForMcq();
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.verifyDisablityCert(JSON.stringify(this.fileObj));
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        this.successToast(this.translocoService.translate("disability-success"));
        this.jumpToQuestion(this.displayedQuestion);
      } else {
        this.jumpToQuestion(this.displayedQuestion);
        this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
      }
    } else {
      this.errorToast(response);
    }
  }
  // END

  // MHADA OCR and VERIFICATION
  async uploadMhadaImage() {
    if (this.selectedRadioOption == "No") {
      this.frontImageBlob = null;
    }
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.ocrMhadaEmployeeV2(
      this.frontImageBlob,
      JSON.stringify(this.fileObj)
    );
    this.isOcrDone = "Yes";
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        let ocrResult: any = JSON.parse(response.ocrString);
        if (ocrResult.status.toLowerCase() == "success") {
          this.ocrIdOnImage = ocrResult.data.mhada_card_number;
          localStorage.setItem("docuLocation", response.documentLocation);
          if (this.selectedRadioOption == "No") {
            this.jumpToQuestion(this.displayedQuestion);
          } else {
            // this.successToast("Mhada employee image uploaded successfully.");
            this.customSnackBar([this.ocrIdOnImage, "common", "MHADA"]);
          }
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          this.backendWarningToast(ocrResult);
        }
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.frontendWarningToast(this.translocoService.translate("warning-unable-to-upload-doc"));
      }
    } else {
      this.errorToast(response);
    }
  }
  async verifyMhadaEmployee() {
    if (this.isEdit == "true" && this.isOcrDone == "No") {
      this.displayedQuestion = this.editRecordList[6];
      if (this.editRecordList[6]["appToken"] != null && this.editRecordList[6]["appToken"] != "") {
        this.selectedRadioOption = "No";
        this.domicileToken = this.editRecordList[6]["appToken"];
      } else {
        this.selectedRadioOption = "Yes";
        if (this.editRecordList[6]["qs_doc_document"] != null) {
          this.viewPreuploadImages(this.displayedQuestion);
        }
      }
    } else {
      this.requestDtoStringForMcq();
      this.displayProgressSpinner();
      const response: any = await this.questionAnswerService.verifyMhadaEmployee(JSON.stringify(this.fileObj));
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          if (this.isEdit == "true") {
            this.successToast("MHADA employee verified successfully.");
            this.displayedQuestion = this.editRecordList[6];
            if (this.editRecordList[6]["appToken"] != null && this.editRecordList[6]["appToken"] != "") {
              this.selectedRadioOption = "No";
              this.domicileToken = this.editRecordList[6]["appToken"];
            } else {
              // this.selectedRadioOption = "Yes";
              // this.isImageUploaded = true;
              // if (this.editRecordList[6]["qs_doc_document"] != null) {
              //   this.viewPreuploadImages(this.displayedQuestion);
              // }
            }
          } else {
            this.successToast("MHADA employee verified successfully.");
            this.jumpToQuestion(this.displayedQuestion);
          }
        } else {
          this.reUploadImage();
          this.frontendWarningToast(this.translocoService.translate("warning-document-mismatch"));
        }
      } else {
        this.errorToast(response);
      }
    }
  }
  // END

  // FAMILY INCOME CERTIFICATE OCR and VERIFICATION
  async uploadFamilyIncomeImage() {
    this.changeOcrFlagIfEditTrue();
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.ocrFamilyIncomeV3(
      this.frontImageBlob,
      JSON.stringify(this.fileObj)
    );
    if (response != null && !response.error) {
      if (this.isEdit == "true") {
        this.isOcrDone == "Yes";
      }
      if (response.status.toLowerCase() == "success") {
        localStorage.setItem("docuLocation", response.documentLocation);
        let ocrResult: any = JSON.parse(response.ocrString);
        if (ocrResult.status.toLowerCase() == "success") {
          this.ocrIdOnImage = ocrResult.data.income_certificate_number;
          // this.successToast("Family income certificate uploaded successfully.");
          this.customSnackBar([this.ocrIdOnImage, "common", "Family Income Certificate"]);
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          // this.backendWarningToast(ocrResult);
          this.progressSpinnerDialog.close();
          const toast = await this.toastController.create({
            message: this.translocoService.translate("warning-income-certificate"),
            icon: "checkmark-circle-outline",
            position: "top",
            cssClass: "toast success-toast",
            duration: 5000,
          });
          toast.present();
        }
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }

  async verifyFamilyIncomeCert() {
    if (this.isEdit == "true" && this.isOcrDone == "No") {
      this.editItrIncomeCert();
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      this.spouseFlag();
      const response: any = await this.questionAnswerService.verifyFamilyIncomeCert(
        JSON.stringify(this.fileObj),
        this.selfSpouseSw,
        "income"
      );
      this.progressSpinnerDialog.close();
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          let message = "";
          message = "Income certificate verified successfully.";
          this.successToast(message);
          if (this.isEdit == "true" && this.isOcrDone == "No") {
            this.recordEditing();
          } else if (this.isEdit == "true" && this.isOcrDone == "Yes") {
            this.userExists();
          } else {
            this.nextQuestion(this.displayedQuestion);
          }
        } else if (response.status.toLowerCase() == "rejected") {
          this.isImageUploaded = false;
          this.progressSpinnerDialog.close();
          this.selectedBackImage = "";
          this.ocrMessage = "";
          this.frontImageBlob = null;
          this.backImageBlob = null;
          this.selectedRadioOption = "";
          setTimeout(() => {
            this.selectedImage = "";
            this.ocrIdOnImage = "";
            this.isUploadImageVisible = false;
            this.selectedRadioOption = "";
          }, 10);
          this.frontendWarningToast(
            "Uploaded income certificate seems to be of older period. Kindly upload latest income certificate, to proceed."
          );
        } else {
          this.reUploadImage();
          this.frontendWarningToast(this.translocoService.translate("warning-income-certificate"));
          if (this.isEdit == "true" && this.isOcrDone == "No") {
            this.recordEditing();
          } else if (this.isEdit == "true" && this.isOcrDone == "Yes") {
            this.userExists();
          } else {
            this.nextQuestion(this.displayedQuestion);
          }
        }
      } else {
        this.errorToast(response);
      }
    }
  }
  // END

  // COMMON WS for uploading docs for documents that does not have OCR operation
  async uploadPredefinedDoc(wsName: any, question: string) {
    if (this.selectedRadioOption == "No") {
      this.frontImageBlob = null;
    }
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.predefinedWS(
      this.frontImageBlob,
      JSON.stringify(this.fileObj),
      wsName
    );
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      this.scrollIntoView();
      if (response.status.toLowerCase() == "success") {
        if (
          this.displayedQuestion.qsCode == "Q_CENTRAL" ||
          this.displayedQuestion.qsCode == "Q_STATE" ||
          this.displayedQuestion.qsCode == "Q_MHADA"
        ) {
          if (this.isEdit == "true") {
            if (this.displayedQuestion.qsCode == "Q_CENTRAL") {
              if (this.selectedRadioOption == "No") {
                this.successToast("Detail saved successfully.");
                this.displayedQuestion = this.editRecordList[4];
                this.selectedRadioOption = this.displayedQuestion.qs_ans;
                if (this.displayedQuestion.qs_doc_document != null) {
                  this.viewPreuploadImages(this.displayedQuestion);
                }
              } else {
                this.successToast("This document is under verification, will be verified within next 24 hours.");
                this.recordEditing();
              }
            } else if (this.displayedQuestion.qsCode == "Q_STATE") {
              if (this.selectedRadioOption == "No") {
                this.successToast("Detail saved successfully.");
                this.displayedQuestion = this.editRecordList[5];
                this.selectedRadioOption = this.displayedQuestion.qs_ans;
                if (this.displayedQuestion.qs_doc_document != null) {
                  this.viewPreuploadImages(this.displayedQuestion);
                }
              } else {
                this.successToast("This document is under verification, will be verified within next 24 hours.");
                // this.recordEditing();
                this.displayedQuestion = this.editRecordList[6];
                this.selectedRadioOption = this.displayedQuestion.qs_ans;
                this.selectedImage = "";
                if (this.displayedQuestion.qs_doc_document != null) {
                  this.selectedRadioOption = "Yes";
                  this.viewPreuploadImages(this.displayedQuestion);
                } else if (this.displayedQuestion.qs_ans_status == "Allowed with Condition") {
                  this.selectedRadioOption = "No";
                  this.domicileTokenTextFieldVisible = true;
                  this.domicileToken = this.displayedQuestion.appToken;
                }
              }
            } else {
              if (this.selectedRadioOption == "No") {
                this.successToast("Detail saved successfully.");
                // this.recordEditing();
                this.displayedQuestion = this.editRecordList[6];
                this.selectedRadioOption = this.displayedQuestion.qs_ans;
                if (this.displayedQuestion.qs_doc_document != null) {
                  this.selectedRadioOption = "Yes";
                  this.viewPreuploadImages(this.displayedQuestion);
                } else if (this.displayedQuestion.qs_ans_status == "Allowed with Condition") {
                  this.selectedRadioOption = "No";
                  this.domicileTokenTextFieldVisible = true;
                  this.domicileToken = this.displayedQuestion.appToken;
                }
              } else {
                this.successToast("This document is under verification, will be verified within next 24 hours.");
                this.recordEditing();
              }
            }
          } else {
            if (this.selectedRadioOption == "No") {
              this.successToast("Detail saved successfully.");
              this.jumpToQuestion(this.displayedQuestion);
            } else {
              this.successToast("This document is under verification, will be verified within next 24 hours.");
              this.nextQuestion(this.displayedQuestion);
            }
          }
        } else if (this.displayedQuestion.qsCode == "Q_FREEDOM" || this.displayedQuestion.qsCode == "Q_EXSERVICEMAN") {
          if (
            this.isEdit == "true" &&
            this.displayedQuestion.qsCode == "Q_FREEDOM" &&
            this.selectedRadioOption == "No"
          ) {
            this.successToast("Detail saved successfully.");
            // this.displayedQuestion = this.editRecordList[20];
            this.recordEditing();
          } else {
            if (this.selectedRadioOption == "No") {
              this.successToast("Detail saved successfully.");
              this.jumpToQuestion(this.displayedQuestion);
            } else {
              this.successToast("This document is under verification, will be verified within next 24 hours.");
              // if (this.displayedQuestion.qsCode == "Q_EXSERVICEMAN") {
              this.jumpToQuestion(this.displayedQuestion);
              // } else {
              //   this.nextQuestion(this.displayedQuestion);
              // }
            }
          }
        } else if (this.selectedRadioOption == "No") {
          this.successToast("Detail saved successfully.");
          this.jumpToQuestion(this.displayedQuestion);
        } else {
          this.successToast("This document is under verification, will be verified within next 24 hours.");
          this.jumpToQuestion(this.displayedQuestion);
        }
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        if (this.selectedRadioOption == "No") {
          this.frontendWarningToast("Unable to save the details");
        } else {
          this.frontendWarningToast(this.translocoService.translate("warning-unable-to-upload-doc"));
        }
      }
    } else {
      this.errorToast(response);
    }
  }

  // COMMON WS for uploading docs for documents that does not have OCR operation
  async allowedWithCondition(wsName: any, question: string) {
    if (this.selectedRadioOption == "No") {
      this.frontImageBlob = null;
    }
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.predefinedWS(
      this.frontImageBlob,
      JSON.stringify(this.fileObj),
      wsName
    );
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      this.scrollIntoView();
      if (response.status.toLowerCase() == "success") {
        if (this.selectedRadioOption == "No") {
          this.successToast("Detail saved successfully.");
          this.jumpToQuestion(this.displayedQuestion);
        } else {
          this.successToast("This document is under verification, will be verified within next 24 hours.");
          this.jumpToQuestion(this.displayedQuestion);
        }
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        if (this.selectedRadioOption == "No") {
          this.frontendWarningToast("Unable to save the details");
        } else {
          this.frontendWarningToast(this.translocoService.translate("warning-unable-to-upload-doc"));
        }
      }
    } else {
      this.errorToast(response);
    }
  }

  reUploadSpouseAadhaar(){
    setTimeout(() => {
      this.isUploadImageVisible = false;
    }, 10);
    this.selectedImage = "";
    this.selectedBackImage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.ocrMessage = "";
    this.fileUploadVisible = true;
    this.ocrIdOnImage = "";

    this.selectedRadioOption = "";
    this.exServicemanImageReuploaded = true;
    if (this.isEdit == "true") {
      this.predefinedDocEditFlowOcrDone = false;
    }
  }

  reUploadImageIncCert() {
    this.isUploadImageVisible = true;
    this.selectedImage = "";
    this.selectedBackImage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.ocrMessage = "";
    this.fileUploadVisible = true;
    this.ocrIdOnImage = "";

    this.exServicemanImageReuploaded = true;
    if (this.isEdit == "true") {
      this.predefinedDocEditFlowOcrDone = false;
    }
  }

  showReVerifyItr() {
    this.showItrErrorMessage = null;
    this.showReVerifySelfItr = false;
    this.showReVerifySpouseItr = false;
    this.itrStatus = null;
    this.itrPortalOtp = null;
    this.itrPortalPassword = null;
    this.itrPortalConfirmPassword = null;
    this.iAgree = null;
    if(this.displayedQuestion.qsCode == 'Q_SELF_ITR' || this.displayedQuestion.qsCode == 'Q_ITR') {
      this.selfItrPasswordBlock = true;
      this.firstItrApi = true;
    }
    else if(this.displayedQuestion.qsCode == 'Q_SPOUSE_ITR' || this.displayedQuestion.qsCode == 'Q_ITR_SPOUSE') {
      this.spouseItrPasswordBlock = true;
      this.firstItrApi = true;
    }
  }

  reUploadImage() {

    console.log('Pan Test',this.displayedQuestion);
    this.selectedStaticRadioOption="";
    this.showStaticRadioButtons=false;
    if(this.displayedQuestion?.qsCode === 'Q_PAN') {
      this.reUploadSpouseAadhaar();
    } else {
      setTimeout(() => {
        this.isUploadImageVisible = false;
      }, 10);
      this.selectedImage = "";
      this.selectedBackImage = "";
      this.frontImageBlob = null;
      this.backImageBlob = null;
      this.ocrMessage = "";
      this.fileUploadVisible = true;
      this.ocrIdOnImage = "";
  
      this.selectedRadioOption = "";
      this.exServicemanImageReuploaded = true;
      if (this.isEdit == "true") {
        this.predefinedDocEditFlowOcrDone = false;
      }
      
    }
  }

  radioButtonClicked(event: any) {
    this.ocrMessage = "";
    this.selectedImage = "";
    this.selectedBackImage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.ocrIdOnImage = "";
    this.isUploadImageVisible = false;
    this.selfItrPasswordBlock = false;
    this.spouseItrPasswordBlock = false;
    this.selectedDocToUpload = null;

    this.firstItrApi = false;
    this.secondItrApi = false;
    this.secondItrApiOtp = false;
    this.secondItrApiPassword = false;
    this.showReVerifySelfItr = false;
    this.showReVerifySpouseItr = false;
    this.itrStatus = null;
    this.showItrErrorMessage = null;

    console.log('this.displayedQuestion.qsCode', this.displayedQuestion.qsCode, event.target.value, this.isEdit);
    if (this.displayedQuestion.qsCode == 'Q_MARITAL' &&
      (this.selectedRadioOption == 'Divorcee' || this.selectedRadioOption == 'Widow') &&
      this.selectedStaticRadioOption == 'Yes') {
      this.isUploadImageVisible = true;
    }
    else if (this.displayedQuestion.qsCode == "Q_SELF_ITR") {

      if(this.isEdit == "true") {
        if(this.editRecordList[13].qs_ans_status != "Not Answered") {
          if(event.target.value == 'Yes') {
            if (this.editRecordList[13].qs_ans.split("###")[1] == 4) {
              this.itrStatus = this.editRecordList[13].qs_ans_status;
              if(this.editRecordList[13].qs_ans_status == 'Verified') {
                //show pdf and verified status
              }
              else {
                //show error message if rejected
                this.showItrErrorMessage = this.editRecordList[13].mlRemarks;
                this.showReVerifySelfItr = true;
              }
            }
            else {
              this.selfItrPasswordBlock = true;
              this.firstItrApi = true;
            }
          }
          else {
            if (this.editRecordList[13].qs_ans.split("###")[1] == 4) {
              this.isUploadImageVisible = true;
            }
            else {
              this.viewPreuploadImages(this.editRecordList[13]);    
            }
          }
          // console.log(this.editRecordList);
        }
        else {
          if(event.target.value == 'Yes') {
            this.selfItrPasswordBlock = true;
            this.firstItrApi = true;
          }
          else if(event.target.value == 'No') {
            this.isUploadImageVisible = true;              
          }
          else {
          }
        }
      }
      else {
        if(event.target.value == 'Yes') {
          this.selfItrPasswordBlock = true;
          this.firstItrApi = true;
        }
        else {
          this.isUploadImageVisible = true;
        }
      }

    } else if (this.displayedQuestion.qsCode == "Q_SPOUSE_ITR") {
      if(this.isEdit == "true") {
        if(this.editRecordList[14].qs_ans_status != "Not Answered") {
          if(event.target.value == 'Yes') {
            if (this.editRecordList[14]?.qs_ans?.split("###")[1] == 8) {
              this.itrStatus = this.editRecordList[14].qs_ans_status;
              if(this.editRecordList[14].qs_ans_status == 'Verified') {
                //show pdf and verified status
              }
              else {
                //show error message if rejected
                this.showItrErrorMessage = this.editRecordList[14].mlRemarks;
                this.showReVerifySpouseItr = true;
              }
            }
            else {
              this.spouseItrPasswordBlock = true;
              this.firstItrApi = true;   
            } 
          }
          else {
            if (this.editRecordList[14]?.qs_ans?.split("###")[1] == 9) {
              if (this.editRecordList[14]?.qs_doc_document != null && this.editRecordList[14]?.qs_doc_document?.length > 0) {
                this.viewPreuploadImages(this.editRecordList[14]);    
              }
              // else {
              //   this.isUploadImageVisible = true;
              // }
            }
            else if (this.editRecordList[14]?.qs_ans?.split("###")[1] == 8) {
              this.isUploadImageVisible = true;
            }
          }
        }
        else {
          // this.spouseItrPasswordBlock = true;
          // this.firstItrApi = true;
          if(event.target.value == 'Yes') {
            this.spouseItrPasswordBlock = true;
            this.firstItrApi = true;
          }
          else if(event.target.value == 'No') {
            this.isUploadImageVisible = true;              
          }
          else {
          }
        }
      }
      else {
        if(event.target.value == 'Yes') {
          this.spouseItrPasswordBlock = true;
          this.firstItrApi = true;
        }
        else {
          this.isUploadImageVisible = true;
        }
      }
    }
    // else if (this.displayedQuestion.qsCode == "Q_FREEDOM" && this.selectedRadioOption == "Yes") {
    //   this.isUploadImageVisible = true;
    // }
    else if (
      this.displayedQuestion.qsCode == "Q_EXSERVICEMAN"
    ) {
      // TODO
      if(this.selectedRadioOption == "Ex Serviceman"){
        this.showExservicemanFile = true;
        this.isUploadImageVisible = true;
      } else if(this.selectedRadioOption == "Defence Family") {
        this.showDefenceFamilyFile = true;
        this.isUploadImageVisible = true;
      }
    } else if (
      this.displayedQuestion.qsOption1[this.activeLang] != null &&
      this.displayedQuestion.qsOption2[this.activeLang] != null &&
      this.displayedQuestion.qsCode == "Q_CAST_VALID" &&
      this.selectedRadioOption == "Yes"
    ) {
      this.isUploadImageVisible = true;
    } else if (this.displayedQuestion.qsCode == "Q_CENTRAL") {
      if (this.selectedRadioOption == "Yes") {
        this.isUploadImageVisible = true;
      }
      // this.uploadPredefinedDoc('uploadCentralEmployee');
    } else if (this.displayedQuestion.qsCode == "Q_STATE") {
      if (this.selectedRadioOption == "Yes") {
        this.isUploadImageVisible = true;
      }
      // this.uploadPredefinedDoc('uploadStateEmployee');
    } else if (this.displayedQuestion.qsCode == "Q_DOMICILE") {
      if (this.selectedRadioOption == "No") {
        this.domicileTokenTextFieldVisible = true;
      } else if (this.selectedRadioOption == "Yes") {
        this.domicileTokenTextFieldVisible = false;
        this.isUploadImageVisible = true;
      }
    } else if (
      this.displayedQuestion.qsCode == "Q_ARTIST" ||
      this.displayedQuestion.qsCode == "Q_FREEDOM" ||
      this.displayedQuestion.qsCode == "Q_MLA"
    ) {
      if (this.selectedRadioOption == "Yes") {
        this.selectedAllowedWithConditionRadioOption = "";
        this.isUploadImageVisible = false;
      }
    } else {
      if (this.selectedRadioOption == "No") {
        if (this.displayedQuestion.qsOption2NextQuestion == 99) {
          if (this.displayedQuestion.qsCode == "Q_ADDRESS") {
            this.selectTypeOfDocToUploadVisible = true;
          }
        }
      } else if (this.selectedRadioOption == "Yes") {
        if (this.displayedQuestion.qsOption1NextQuestion == 99) {
          this.isUploadImageVisible = true;
        }
        this.selectTypeOfDocToUploadVisible = false;
      }
    }
  }

  radioButtonForAllowedWithCondition() {
    if (this.selectedAllowedWithConditionRadioOption == "Yes") {
      this.isUploadImageVisible = true;
    } else {
      this.isUploadImageVisible = false;
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async multipleNameCheck(ocrName: string, aliasName: any, docType: any) {
    const multipleNames = this.dialog.open(MultipleNamesComponent, {
      disableClose: true,
      width: "600px",
      data: [ocrName, aliasName],
    });
    multipleNames.afterClosed().subscribe((result) => {
      if (result == "No") {
        this.reUploadImage();
      } else {
        if (docType == "aadhar") {
          this.verifyAadhar();
        } else {
          this.verifyPan("");
        }
      }
    });
  }

  async uploadCasteCertificateImage() {
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.ocrCasteCertV3(
      this.frontImageBlob,
      JSON.stringify(this.fileObj)
    );
    this.isOcrDone = "Yes";
    if (response != null && !response.error) {
      // if (response.status.toLowerCase() == "success") {
      //   if (response.error != null) {
      //     this.selectedImage = "";
      //     this.ocrIdOnImage = "";
      //     this.isUploadImageVisible = false;
      //     // this.backendWarningToast(response);
      //     this.customSnackBar([this.ocrIdOnImage, "caste-cert", "Caste Certificate"]);
      //   } else {
      //     this.responseCasteValidity = response.data.cast_validity_certificate_number;
      //     // this.successToast("Caste validity uploaded successfully.");
      //     this.customSnackBar([this.ocrIdOnImage, "common", "Caste Certificate"]);
      //   }
      // } else {
      //   this.selectedImage = "";
      //   this.ocrIdOnImage = "";
      //   this.isUploadImageVisible = false;
      //   // this.backendWarningToast(response);
      // }
      if (response.status.toLowerCase() == "success" || response.status == "Not-Verified") {
        localStorage.setItem("docuLocation", response.documentLocation);
        let ocrResult: any = JSON.parse(response.ocrString);
        if (ocrResult.status.toLowerCase() == "success") {
          this.ocrIdOnImage = ocrResult.data.cast_certificate_number;
          this.responseDomicile = this.ocrIdOnImage;
          // this.successToast("Caste validity uploaded successfully.");
          this.customSnackBar([this.ocrIdOnImage, "common", "Caste Certificate"]);
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          this.customSnackBar(["Moderation Team", "caste-cert", "Caste Certificate"]);
        }
      } else {
        this.selectedImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }

  async uploadCasteValidityImage() {
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.ocrCasteValV3(
      this.frontImageBlob,
      JSON.stringify(this.fileObj)
    );
    this.isOcrDone = "Yes";
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success" || response.status == "Not-Verified") {
        let ocrResult: any = JSON.parse(response.ocrString);
        localStorage.setItem("docuLocation", response.documentLocation);
        if (ocrResult.status.toLowerCase() == "success") {
          this.ocrIdOnImage = ocrResult.data.cast_validity_certificate_number;
          this.responseDomicile = this.ocrIdOnImage;
          // this.successToast("Caste validity uploaded successfully.");
          this.customSnackBar([this.ocrIdOnImage, "common", "Caste Validity"]);
        } else if (ocrResult.status == "Unable to Connect") {
          this.ocrWarningToast(ocrResult.status);
        } else {
          // this.backendWarningToast(ocrResult);
          this.customSnackBar(["Moderation Team", "caste-cert", "Caste Validity Certificate"]);
        }
      } else {
        this.selectedImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }

  async uploadIncomeCertificateImage() {
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.ocrIncomeCertV1(this.frontImageBlob);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == "success") {
        if (response.error != null) {
          this.selectedImage = "";
          this.ocrIdOnImage = "";
          this.isUploadImageVisible = false;
          this.backendWarningToast(response);
        } else {
          this.responseIncomeCertificate = response.data.income_certificate_number;
          this.ocrIdOnImage = this.responseIncomeCertificate;
          // this.successToast("Income certificate uploaded successfully.");
          this.customSnackBar([this.ocrIdOnImage, "common", "Income Certificate"]);
        }
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }

  proceedForWorkStatus() {
    this.scrollIntoView();
    this.selectedImage = "";
    this.isUploadImageVisible = false;
    console.log("this.selectedRadioOption ",this.selectedRadioOption);
    
    if (this.selectedRadioOption == "Both") {
      for (let i = 0; i < this.allQuestions.length; i++) {
        if (
          this.displayedQuestion.qsOption1NextQuestion == this.allQuestions[i]["pkQsid"] &&
          this.displayedQuestion.qsCode == "Q_WORK_STATUS"
        ) {
          this.displayedQuestion = this.allQuestions[i];
          localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
          setTimeout(() => {
            this.selectedRadioOption = "";
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        }
      }
    } else if (
      this.selectedRadioOption == "Self" ||
      this.selectedRadioOption == "Yes" ||
      this.selectedRadioOption == "None" ||
      this.selectedRadioOption == "No"
    ) {
      for (let i = 0; i < this.allQuestions.length; i++) {
        if (
          this.displayedQuestion.qsOption1NextQuestion == this.allQuestions[i]["pkQsid"] &&
          this.displayedQuestion.qsCode == "Q_SELF_WORKING"
        ) {
          this.displayedQuestion = this.allQuestions[i];
          localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
          setTimeout(() => {
            this.selectedRadioOption = "";
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        } else if (
          this.displayedQuestion.qsOption2NextQuestion == this.allQuestions[i]["pkQsid"] &&
          this.displayedQuestion.qsCode == "Q_WORK_STATUS"
        ) {
          this.displayedQuestion = this.allQuestions[i];
          localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
          setTimeout(() => {
            this.selectedRadioOption = "";
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        }
      }
    } else if (this.selectedRadioOption == "Spouse") {
      for (let i = 0; i < this.allQuestions.length; i++) {
        if (
          this.displayedQuestion.qsOption3NextQuestion == this.allQuestions[i]["pkQsid"] &&
          this.displayedQuestion.qsCode == "Q_WORK_STATUS"
        ) {
          this.displayedQuestion = this.allQuestions[i];
          localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
          setTimeout(() => {
            this.selectedRadioOption = "";
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        }
      }
    } else if (this.selectedRadioOption == "None" || this.selectedRadioOption == "No") {
      for (let i = 0; i < this.allQuestions.length; i++) {
        if (
          this.displayedQuestion.qsOption2NextQuestion == this.allQuestions[i]["pkQsid"] &&
          this.displayedQuestion.qsCode == "Q_SELF_WORKING"
        ) {
          this.displayedQuestion = this.allQuestions[i];
          localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
          setTimeout(() => {
            this.selectedRadioOption = "";
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        } else if (
          this.displayedQuestion.qsOption4NextQuestion == this.allQuestions[i]["pkQsid"] &&
          this.displayedQuestion.qsCode == "Q_WORK_STATUS"
        ) {
          this.displayedQuestion = this.allQuestions[i];
          localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
          setTimeout(() => {
            this.selectedRadioOption = "";
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        }
      }
    }
    setTimeout(() => {
      this.selectedRadioOption = "";
      this.selectedImage = "";
      this.isUploadImageVisible = false;
    }, 10);
  }

  async updateWorkingStatus() {
    // if((this.displayedQuestion.qsCode==="Q_WORK_STATUS" && this.selectedFinancialYear!=null && this.incomeAmount!=null && this.spouseIcomeAmount) 
    //   || (this.displayedQuestion.qsCode==="Q_SELF_WORKING" && this.selectedFinancialYear!=null && this.incomeAmount!=null)){
    // console.log("true-->condition is true");
        
    // }else{
    //   this.errorToast("Kahi tr tak ki");
    // }
    //  console.log("this.displayedQuestion.qsCode",this.displayedQuestion, this.isEdit == "true" && +this.displayedQuestion.pkQsid == 7);
    //  console.log(this.selectedRadioOption, this.editRecordList[12], this.editRecordList[13], 
    //   (this.selectedRadioOption == "Yes" || this.selectedRadioOption == "No") &&
    //     (this.editRecordList[12]["qs_ans"] == "Self" ||
    //       this.editRecordList[12]["qs_ans"] == "Spouse" ||
    //       this.editRecordList[12]["qs_ans"] == "No" ||
    //       this.editRecordList[12]["qs_ans"] == "None") &&
    //     this.editRecordList[13]["qs_ans_status"] != "Not Answered"
    //  );
    // console.log(this.selectedRadioOption, this.displayedQuestion.qs_ans
    //   , (this.selectedFinancialYear != this.editRecordList[12]?.fkRfyid)
    //   , (this.incomeAmount != this.editRecordList[12].rwsSelfInc), (this.spouseIcomeAmount != this.editRecordList[12].rwsSpouseInc));
    
    // console.log("this.selectedFinancialYear ---->",this.selectedFinancialYear,this.incomeAmount,this.spouseIcomeAmount);
    // console.log(this.selectedFinancialYear,this.editRecordList[12]?.fkRfyid);
    if(this.isEdit == "true"){
      console.log('Married status ->> ',this.editRecordList[9]["qs_ans"])
    }

    if (this.isEdit == "true" && +this.displayedQuestion.pkQsid == 7) {
      // if (
      //   this.selectedRadioOption == "No" &&
      //   (this.editRecordList[12]["qs_ans"] == "No" || this.editRecordList[12]["qs_ans"] == "None")
      // ) {
      //   this.userExists();
      // } else
      if (
        (this.editRecordList[12]["qs_ans"] == "None" && this.selectedRadioOption == "Yes") ||
        (this.editRecordList[12]["qs_ans"] == "Self" && this.selectedRadioOption == "No")
      ) {
        this.displayProgressSpinner();
        this.requestDtoStringForMcq();

        // set financial year and income in object
        this.fileObj.selectedFinancialYear = this.selectedFinancialYear;
        this.fileObj.incomeAmount=this.incomeAmount;
        this.fileObj.spouseIcomeAmount=this.spouseIcomeAmount;

        const response: any = await this.questionAnswerService.updateWorkingStatus(JSON.stringify(this.fileObj));
        if (response != null && !response.error) {
          if (response.status.toLowerCase() == "success") {
            this.setProfileDetails();
            this.successToast("Working status updated successfully.");
            if (this.selectedRadioOption == "Both") {
              this.displayedQuestion = this.allQuestions[26];
            } else if (
              this.selectedRadioOption == "Self" ||
              this.selectedRadioOption == "Yes" ||
              this.selectedRadioOption == "None" ||
              this.selectedRadioOption == "No"
            ) {
              this.displayedQuestion = this.allQuestions[7];
            } else if (this.selectedRadioOption == "Spouse") {
              this.displayedQuestion = this.allQuestions[12];
            } else if (this.selectedRadioOption == "None" || this.selectedRadioOption == "No") {
              // this.router.navigate(["/profile"]);
              this.userExists();
            }
            this.selectedRadioOption = "";
            setTimeout(() => {
              this.selectedImage = "";
              this.isUploadImageVisible = false;
            }, 10);
          } else {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
            this.frontendWarningToast(response?.errorMsg);
          }
        } else {
          this.errorToast(response);
        }
      } else if (
        (this.selectedRadioOption == "Yes" || this.selectedRadioOption == "No") &&
        (this.editRecordList[12]["qs_ans"] == "Self" ||
          this.editRecordList[12]["qs_ans"] == "Spouse" ||
          this.editRecordList[12]["qs_ans"] == "No" ||
          this.editRecordList[12]["qs_ans"] == "None") &&
        this.editRecordList[13]["qs_ans_status"] != "Not Answered"
      ) {
        if(((this.selectedFinancialYear != this.editRecordList[12]?.fkRfyid)
          || (this.incomeAmount != this.editRecordList[12].rwsSelfInc)
          )) {
            this.displayProgressSpinner();
            this.requestDtoStringForMcq();
            this.fileObj.selectedFinancialYear = this.selectedFinancialYear;
            this.fileObj.incomeAmount=this.incomeAmount;
            this.fileObj.spouseIcomeAmount=this.spouseIcomeAmount;
            const response: any = await this.questionAnswerService.updateWorkingStatus(JSON.stringify(this.fileObj));
            if (response != null && !response.error) {
              this.progressSpinnerDialog.close();
              if (response.status.toLowerCase() == "success") {
                // this.displayedQuestion = this.allQuestions[7];

                // this.itrStatus = this.editRecordList[13].qs_ans_status;
                // if(this.editRecordList[13].qs_ans_status == 'Verified') {
                //   //show pdf and verified status
                //   let file = this.editRecordList[13].qs_doc_document.split(",");
                //   let fileName = file[0].split("/").pop()
                //   if(fileName.toLowerCase().endsWith(".pdf")) {
                //     this.viewPdfFiles(this.editRecordList[13]);
                //   }
                //   else {
                //     this.viewPreuploadImages(this.editRecordList[13]);
                //   }
                // }
                // else {
                //   //show error message if rejected
                //   if (this.editRecordList[13].qs_ans.split("###")[1] == 4) {
                //     this.showItrErrorMessage = this.editRecordList[13].mlRemarks;
                //     this.showReVerifySelfItr = true;
                //   }
                //   else {
                //     this.viewPreuploadImages(this.editRecordList[13]);
                //   }
                // }
                // if (this.editRecordList[13].qs_ans.split("###")[1] == 4) {
                //   setTimeout(() => {
                //     this.selectedRadioOption = "Yes";
                //   }, 100);
                // } else {
                //   setTimeout(() => {
                //     this.selectedRadioOption = "No";
                //     this.isUploadImageVisible = true;
                //   }, 100);
                // }
                this.setProfileDetails();
                this.successToast("Working status updated successfully.");
                if (this.selectedRadioOption == "Both") {
                  this.displayedQuestion = this.allQuestions[26];
                } else if (
                  this.selectedRadioOption == "Self" ||
                  this.selectedRadioOption == "Yes" ||
                  this.selectedRadioOption == "None" ||
                  this.selectedRadioOption == "No"
                ) {
                  this.displayedQuestion = this.allQuestions[7];
                } else if (this.selectedRadioOption == "Spouse") {
                  this.displayedQuestion = this.allQuestions[12];
                } else if (this.selectedRadioOption == "None" || this.selectedRadioOption == "No") {
                  // this.router.navigate(["/profile"]);
                  this.userExists();
                }
                this.selectedRadioOption = "";
                setTimeout(() => {
                  this.selectedImage = "";
                  this.isUploadImageVisible = false;
                }, 10);
              } else {
                this.selectedImage = "";
                this.isUploadImageVisible = false;
                this.frontendWarningToast(response?.errorMsg);
              }
            } else {
              this.progressSpinnerDialog.close();
              this.errorToast(response);
            }
          }
          else {
            this.displayedQuestion = this.allQuestions[7];

            this.itrStatus = this.editRecordList[13].qs_ans_status;
            if(this.editRecordList[13].qs_ans_status == 'Verified') {
              //show pdf and verified status
              let file = this.editRecordList[13].qs_doc_document.split(",");
              let fileName = file[0].split("/").pop()
              if(fileName.toLowerCase().endsWith(".pdf")) {
                this.viewPdfFiles(this.editRecordList[13]);
              }
              else {
                this.viewPreuploadImages(this.editRecordList[13]);
              }
            }
            else {
              //show error message if rejected
              if (this.editRecordList[13].qs_ans.split("###")[1] == 4) {
                this.showItrErrorMessage = this.editRecordList[13].mlRemarks;
                this.showReVerifySelfItr = true;
              }
              else {
                this.viewPreuploadImages(this.editRecordList[13]);
              }
            }
            if (this.editRecordList[13].qs_ans.split("###")[1] == 4) {
              setTimeout(() => {
                this.selectedRadioOption = "Yes";
              }, 100);
            } else {
              setTimeout(() => {
                this.selectedRadioOption = "No";
                this.isUploadImageVisible = true;
              }, 100);
            }
          }

        // this.viewPreuploadImages(this.editRecordList[13]);
        
      } else {
        this.displayProgressSpinner();
        this.requestDtoStringForMcq();

        // set financial year and income in object
        this.fileObj.selectedFinancialYear = this.selectedFinancialYear;
        this.fileObj.incomeAmount=this.incomeAmount;
        this.fileObj.spouseIcomeAmount=this.spouseIcomeAmount;

        const response: any = await this.questionAnswerService.updateWorkingStatus(JSON.stringify(this.fileObj));
        if (response != null && !response.error) {
          if (response.status.toLowerCase() == "success") {
            this.setProfileDetails();
            this.successToast("Working status updated successfully.");
            if (this.selectedRadioOption == "Both") {
              this.displayedQuestion = this.allQuestions[26];
            } else if (
              this.selectedRadioOption == "Self" ||
              this.selectedRadioOption == "Yes" ||
              this.selectedRadioOption == "None" ||
              this.selectedRadioOption == "No"
            ) {
              this.displayedQuestion = this.allQuestions[7];
            } else if (this.selectedRadioOption == "Spouse") {
              this.displayedQuestion = this.allQuestions[12];
            } else if (this.selectedRadioOption == "None" || this.selectedRadioOption == "No") {
              // this.router.navigate(["/profile"]);
              this.userExists();
            }
            this.selectedRadioOption = "";
            setTimeout(() => {
              this.selectedImage = "";
              this.isUploadImageVisible = false;
            }, 10);
          } else {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
            this.frontendWarningToast(response?.errorMsg);
          }
        } else {
          this.errorToast(response);
        }
      }
    } else if (this.isEdit == "true" && (//this.selectedRadioOption != this.displayedQuestion.qs_ans ||
       (this.selectedFinancialYear != this.editRecordList[12]?.fkRfyid)
      || (this.incomeAmount != this.editRecordList[12].rwsSelfInc)
      || (this.spouseIcomeAmount != this.editRecordList[12].rwsSpouseInc)
      )) {
      console.log("hiiii 4072",this.selectedFinancialYear,this.editRecordList[12]?.fkRfyid);
      
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      
      // set financial year and income in object
      this.fileObj.selectedFinancialYear = this.selectedFinancialYear;
      this.fileObj.incomeAmount=this.incomeAmount;
      this.fileObj.spouseIcomeAmount=this.spouseIcomeAmount;

      const response: any = await this.questionAnswerService.updateWorkingStatus(JSON.stringify(this.fileObj));
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          this.setProfileDetails();
          this.successToast("Working status updated successfully.");
          if (this.selectedRadioOption == "Both") {
            this.displayedQuestion = this.allQuestions[26];
          } else if (
            this.selectedRadioOption == "Self" ||
            this.selectedRadioOption == "Yes" ||
            this.selectedRadioOption == "None" ||
            this.selectedRadioOption == "No"
          ) {
            this.displayedQuestion = this.allQuestions[7];
          } else if (this.selectedRadioOption == "Spouse") {
            this.displayedQuestion = this.allQuestions[12];
          } else if (this.selectedRadioOption == "None" || this.selectedRadioOption == "No") {
            // this.router.navigate(["/profile"]);
            this.recordEditing();
          }
          this.selectedRadioOption = "";
          setTimeout(() => {
            this.selectedImage = "";
            this.isUploadImageVisible = false;
          }, 10);
        } else {
          this.selectedImage = "";
          this.isUploadImageVisible = false;
          // this.frontendWarningToast(this.translocoService.translate("warning-unable-to-verify-working-status"));
          this.frontendWarningToast(response?.errorMsg);
        }
      } else {
        this.errorToast(response);
      }
    } else if (this.isEdit == "true" && this.selectedRadioOption == this.displayedQuestion.qs_ans) {
      console.log("hiiii 4116",this.selectedFinancialYear,this.editRecordList[12]?.fkRfyid);
      if (this.selectedRadioOption == "Both") {
        this.displayedQuestion = this.allQuestions[26];

        console.log('this.editRecordList[13]', this.editRecordList);
        if(this.editRecordList[13].qs_ans?.trim()?.length > 0) {
          if (this.editRecordList[13].qs_ans.split("###")[1] == 4) { // this.editRecordList[13] to this.editRecordList[14]
            setTimeout(() => {
              this.selectedRadioOption = "Yes";
            }, 100);
          } else {
            setTimeout(() => {
              this.selectedRadioOption = "No";
            }, 100);
          }
        }
        else if(this.editRecordList[15].qs_ans?.trim()?.length > 0) {
          setTimeout(() => {
            this.selectedRadioOption = "No";
          }, 100);
        }
      } else if (this.selectedRadioOption == "Self" || this.selectedRadioOption == "None") {
        this.displayedQuestion = this.allQuestions[7];
        if (
          this.editRecordList[13].qs_ans_status == "Verified" 
          // || this.editRecordList[13].qs_ans_status == "Not-Verified"
        ) {
          let file = this.editRecordList[13].qs_doc_document.split(",");
          let fileName = file[0].split("/").pop()
          if(fileName.toLowerCase().endsWith(".pdf")) {
            this.viewPdfFiles(this.editRecordList[13]);
          }
          else {
            this.viewPreuploadImages(this.editRecordList[13]);
          }
        }
        console.log(this.editRecordList);
        if(this.editRecordList[13].qs_ans_status != "Not Answered" && this.editRecordList[15].qs_ans_status != "Not Answered") {
          if (this.editRecordList[13].qs_ans.split("###")[1] == 4) { // this.editRecordList[13] to this.editRecordList[14]
            setTimeout(() => {
              this.selectedRadioOption = "Yes";
            }, 100);
          } else {
            setTimeout(() => {
              this.selectedRadioOption = "No";
            }, 100);
          }
        }
      } else if (this.selectedRadioOption == "Spouse") {
        this.displayedQuestion = this.allQuestions[12];
        if (
          this.editRecordList[14].qs_ans_status == "Verified" 
          // || this.editRecordList[14].qs_ans_status == "Not-Verified" ||
          // this.editRecordList[14].qs_ans_status == "Rejected-Mismatch"
        ) {
          let file = this.editRecordList[14].qs_doc_document.split(",");
          let fileName = file[0].split("/").pop()
          if(fileName.toLowerCase().endsWith(".pdf")) {
            this.viewPdfFiles(this.editRecordList[14]);
          }
          else {
            this.viewPreuploadImages(this.editRecordList[14]);
          }
        }
        if(this.editRecordList[14].qs_ans_status != "Not Answered" && this.editRecordList[15]?.qs_ans_status != "Not Answered") {
          if (this.editRecordList[14].qs_ans.split("###")[1] == 8) {
            setTimeout(() => {
              this.selectedRadioOption = "Yes";
            }, 100);
          } else {
            setTimeout(() => {
              this.selectedRadioOption = "No";
            }, 100);
          }
        }
      } else if (this.selectedRadioOption == "None") {
        // this.router.navigate(["/profile"]);
        this.recordEditing();
      }
      this.selectedRadioOption = "";
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();

      console.log("hiiii 4166",this.selectedFinancialYear,this.editRecordList[12]?.fkRfyid);

      // set financial year and income in object
        this.fileObj.selectedFinancialYear = this.selectedFinancialYear;
        this.fileObj.incomeAmount=this.incomeAmount;
        this.fileObj.spouseIcomeAmount=this.spouseIcomeAmount;

      const response: any = await this.questionAnswerService.updateWorkingStatus(JSON.stringify(this.fileObj));
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          this.successToast("Working status updated successfully.");
          this.proceedForWorkStatus();
        } else {
          this.selectedImage = "";
          this.isUploadImageVisible = false;
          this.frontendWarningToast(response?.errorMsg);
        }
      } else {
        this.errorToast(response);
      }
    }

    this.incomeCertificateVisible = false;
    // this.displayProgressSpinner();
    // setTimeout(() => {
    //   this.questionAnswerService
    //     .checkIfCgSgMeItrMandatory()
    //     .subscribe((resp) => {
    //       this.progressSpinnerDialog.close();
    //       if(resp.status === 'SUCCESS') {
    //         if(resp.itrMandatory) {
    //           if(this.displayedQuestion["qsQuestion"]["en"] == "Self ITR / Upload Tahsildar Income Certificate") {
    //             setTimeout(() => {
    //               this.displayedQuestion["qsQuestion"]["en"] = "Self ITR";
    //             }, 10);
    //           }
    //           if(this.displayedQuestion["qsQuestion"]["mr"] == "आपण स्वत:चे आयकर विवरणपत्र किंवा तहसीलदार उत्पन्न प्रमाणपत्र अपलोड करा") {
    //             setTimeout(() => {
    //               this.displayedQuestion["qsQuestion"]["mr"] = "आपण स्वत:चे आयकर विवरणपत्र";
    //             }, 10);
    //           }

    //           this.incomeCertificateVisible = false;
    //         }
    //         else {
    //           this.incomeCertificateVisible = true;
    //         }
    //       }
    //       else {
    //         this.showErrorToastPlain(resp.errorMessage, 5000);
    //       }
    //     }, error => {
    //       this.progressSpinnerDialog.close();
    //       this.showErrorToastPlain(error.errorMessage, 5000);
    //     });
    // }, 50);    
  }

  async updateSpousePanStatus() {
    if (this.isEdit == "true" && this.displayedQuestion.qs_ans_status == "Verified") {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      const response: any = await this.questionAnswerService.updateSpousePanStatus(JSON.stringify(this.fileObj));
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          this.successToast("Spouse PAN status updated successfully.");
          this.jumpToQuestion(this.displayedQuestion);
        } else {
          this.selectedImage = "";
          this.isUploadImageVisible = false;
          this.frontendWarningToast(this.translocoService.translate("warning-unable-to-update-pan"));
        }
      } else {
        this.errorToast(response);
      }
    } else if (this.isEdit == "true" && this.displayedQuestion.qs_ans_status == "Answered") {
      this.editWorkingStatus();
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      const response: any = await this.questionAnswerService.updateSpousePanStatus(JSON.stringify(this.fileObj));
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          this.successToast("Spouse PAN status updated successfully.");
          if (this.isEdit == "true") {
            this.editWorkingStatus();
          } else {
            this.jumpToQuestion(this.displayedQuestion);
          }
        } else {
          this.selectedImage = "";
          this.isUploadImageVisible = false;
          this.frontendWarningToast(this.translocoService.translate("warning-unable-to-update-pan"));
        }
      } else {
        this.errorToast(response);
      }
    }
  }

  proceedForCaste() {
    this.scrollIntoView();
    this.selectedImage = "";
    this.isUploadImageVisible = false;
    localStorage.setItem("caste-option", this.selectedRadioOption);
    if (this.selectedRadioOption == "OPEN") {
      if (this.isEdit == "true") {
        this.recordEditing();
      } else {
        for (let i = 0; i < this.allQuestions.length; i++) {
          if (
            this.displayedQuestion.qsOption5NextQuestion == this.allQuestions[i]["pkQsid"] &&
            this.displayedQuestion.qsCode == "Q_CASTE"
          ) {
            this.displayedQuestion = this.allQuestions[i];
            localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            this.selectedRadioOption = "";
          }
        }
      }
    } else if (this.selectedRadioOption != "OPEN") {
      for (let i = 0; i < this.allQuestions.length; i++) {
        if (this.isEdit == "true") {
          if (this.selectedRadioOption == this.displayedQuestion.qs_ans) {
            // caste certificate
            this.displayedQuestion = this.allQuestions[14];
            localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            this.selectedRadioOption = this.displayedQuestion.qs_ans;
            if (this.editRecordList[16].qs_doc_document != null) {
              this.viewPreuploadImages(this.editRecordList[16]);
            }
          } else {
            this.getProfileDetailsForCasteFlow();
          }
          break;
        } else if (
          this.displayedQuestion.qsOption2NextQuestion == this.allQuestions[i]["pkQsid"] &&
          this.displayedQuestion.qsCode == "Q_CASTE"
        ) {
          this.displayedQuestion = this.allQuestions[i];
          localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
          this.selectedRadioOption = "";
        }
      }
    }
  }

  async getProfileDetailsForCasteFlow() {
    this.displayProgressSpinner();
    const response: any = await this.profileService.getProfileDetails(localStorage.getItem("regId"));
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.length > 0) {
        localStorage.setItem("editRecords", JSON.stringify(response));
        this.editRecordList = JSON.parse(localStorage.getItem("editRecords"));
        let profileDetail = response.pop();
        if (profileDetail[0]["isProfileActive"] == "N") {
          localStorage.clear();
          this.sharedService.setAuthentication(false);
          this.router.navigate(["/"]);
          window.location.reload();
        }
        // caste certificate
        this.displayedQuestion = this.allQuestions[14];
        localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
        this.selectedRadioOption = this.displayedQuestion.qs_ans;
        if (this.editRecordList[16].qs_doc_document != null) {
          this.viewPreuploadImages(this.editRecordList[16]);
        }
      } else {
        this.backendWarningToast(response.error);
      }
    } else {
      this.errorToast(response);
    }
  }

  async updateAddress() {
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    if (this.currentAddress == "") {
      this.currentAddress = "null";
    }
    const response: any = await this.questionAnswerService.updateAddress(
      JSON.stringify(this.fileObj),
      this.selectedDocToUpload,
      this.currentAddress
    );
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        this.successToast("Address status updated successfully.");
        if (this.isEdit == "true") {
          setTimeout(() => {
            this.isUploadImageVisible = false;
            this.selectedRadioOption = "";
          }, 10);
          this.userExists();
        } else {
          this.nextQuestion(this.displayedQuestion);
        }
      } else {
        this.selectedImage = "";
        this.isUploadImageVisible = false;
        this.frontendWarningToast(this.translocoService.translate("warning-unable-to-update-address"));
      }
    } else {
      this.errorToast(response);
    }
  }

  async updateCaste() {
    if (this.isEdit == "true" && this.selectedRadioOption == this.displayedQuestion.qs_ans) {
      this.proceedForCaste();
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      const response: any = await this.questionAnswerService.updateCaste(JSON.stringify(this.fileObj));
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          this.successToast("Caste updated successfully.");
          this.proceedForCaste();
        } else {
          this.selectedImage = "";
          this.isUploadImageVisible = false;
          this.frontendWarningToast(this.translocoService.translate("warning-unable-to-update-caste"));
        }
      } else {
        this.errorToast(response);
      }
    }
  }

  proceedForMaritalStatus() {
    this.scrollIntoView();
    this.selectedImage = "";
    this.isUploadImageVisible = false;
    if (
      this.selectedRadioOption == "Unmarried" ||
      this.selectedRadioOption == "Divorcee" ||
      this.selectedRadioOption == "Widow"
    ) {
      for (let i = 0; i < this.allQuestions.length; i++) {
        if (
          this.displayedQuestion.qsOption1NextQuestion == this.allQuestions[i]["pkQsid"] &&
          this.displayedQuestion.qsCode == "Q_MARITAL"
        ) {
          this.displayedQuestion = this.allQuestions[i];
          localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
          setTimeout(() => {
            this.selectedRadioOption = "";
            this.isUploadImageVisible = false;
          }, 100);
        }
      }
    } else if (this.selectedRadioOption == "Married") {
      for (let i = 0; i < this.allQuestions.length; i++) {
        if (
          this.displayedQuestion.qsOption4NextQuestion == this.allQuestions[i]["pkQsid"] &&
          this.displayedQuestion.qsCode == "Q_MARITAL"
        ) {
          this.displayedQuestion = this.allQuestions[i];
          localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
          this.selectedRadioOption = "";
        }
      }
    }
  }

  // async updateMarriedStatus() {
  //   if (
  //     this.isEdit == "true" &&
  //     this.selectedRadioOption == this.displayedQuestion.qs_ans &&
  //     this.selectedRadioOption == "Married"
  //   ) {
  //     this.editSpouseAadhar();
  //   } else if (
  //     this.isEdit == "true" &&
  //     this.selectedRadioOption == this.displayedQuestion.qs_ans &&
  //     this.selectedRadioOption != "Married" &&
  //     this.selectedRadioOption == this.displayedQuestion.qs_ans
  //   ) {
  //     this.editWorkingStatus();
  //   } else {
  //     this.displayProgressSpinner();
  //     this.requestDtoStringForMcq();
  //     const response: any = await this.questionAnswerService.updateMarriedStatus(JSON.stringify(this.fileObj));
  //     if (response != null && !response.error) {
  //       if (response.status.toLowerCase() == "success") {
  //         this.successToast(this.translocoService.translate("marital-status-success"));
  //         if (this.isEdit == "true") {
  //           if (
  //             this.selectedRadioOption == "Unmarried" ||
  //             this.selectedRadioOption == "Divorcee" ||
  //             this.selectedRadioOption == "Widow"
  //           ) {
  //             this.editWorkingStatus();
  //           } else {
  //             this.editSpouseAadhar();
  //           }
  //         } else {
  //           this.proceedForMaritalStatus();
  //         }
  //       } else {
  //         this.selectedImage = "";
  //         this.isUploadImageVisible = false;
  //         this.frontendWarningToast(this.translocoService.translate("warning-unable-to-update-married-status"));
  //       }
  //     } else {
  //       this.errorToast(response);
  //     }
  //   }
  // }

  // Kachara

  documentEvidenceShowForMaritalStatus: boolean = false;
  selectedStaticRadioOption: string;
  showStaticRadioButtons: boolean = false;
  isProceedButtonEnabled: boolean = false;
  showDigiMsg: boolean = false;


  checkSelectedOption() {
    console.log("selectedRadioOption",this.selectedRadioOption);

    if(this.selectedRadioOption === 'Married'){
      this.showDigiMsg = true;
    } else {
      this.showDigiMsg = false;
    }
    
    this.selectedStaticRadioOption='';
    this.selectedImage='';
    this.showStaticRadioButtons = this.selectedRadioOption === 'Divorcee' || this.selectedRadioOption === 'Widow';
    if (this.showStaticRadioButtons) {
      this.selectedStaticRadioOption = null;
      this.isUploadImageVisible = true;
      this.selectedImage="";
    }
  }

  async updateMarriedStatus() {
    console.log("updateMarriedStatus this.selectedStaticRadioOption-->",this.selectedStaticRadioOption);
    console.log("updateMarriedStatus this.selectedRadioOption-->",this.selectedRadioOption);
    console.log("updateMarriedStatus this.selectedImage-->",this.selectedImage);
    console.log("updateMarriedStatus this.isUploadImageVisible-->",this.isUploadImageVisible);
    if (
      this.isEdit == "true" &&
      this.selectedRadioOption == this.displayedQuestion.qs_ans &&
      this.selectedRadioOption == "Married"
    ) {
      this.editSpouseAadhar();
    } else if (
      this.isEdit == "true" &&
      this.selectedRadioOption == this.displayedQuestion.qs_ans &&
      this.selectedRadioOption == "Unmarried" 
    ) {
      this.editWorkingStatus();
    } else if (
      this.isEdit == "true" &&
      this.selectedRadioOption == this.displayedQuestion.qs_ans &&
      (this.selectedRadioOption == "Divorcee" || this.selectedRadioOption == "Widow") && 
      (this.selectedStaticRadioOption == (this.displayedQuestion.qs_doc_document != null ? "Yes" : "No")) &&
      this.frontImageBlob == null
    ) {
      this.editWorkingStatus();
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      const response: any =
        await this.questionAnswerService.updateMarriedStatus(
          this.frontImageBlob,
          JSON.stringify(this.fileObj)
        );
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          this.selectedImage='';
          console.log("response response--->",response,this.selectedImage);
          this.successToast(
            this.translocoService.translate("marital-status-success")
          );
          if (this.isEdit == "true") {
            if (
              this.selectedRadioOption == "Unmarried" ||
              this.selectedRadioOption == "Divorcee" ||
              this.selectedRadioOption == "Widow"
            ) {
              this.editWorkingStatus();
            } else {
              this.editSpouseAadhar();
            }
          } else {
            this.proceedForMaritalStatus();
          }
        } else {
          this.selectedImage = "";
          this.isUploadImageVisible = false;
          this.frontendWarningToast(
            this.translocoService.translate(
              "warning-unable-to-update-married-status"
            )
          );
        }
      } else {
        this.errorToast(response);
      }
    }
    this.selectedImage='';
    this.isUploadImageVisible=false;
    this.fetchFinancialYearList();
  }

  async fetchFinancialYearList(): Promise<any> {
    try {
      const financialYearList: any = await this.questionAnswerService.financialYearList();
      if (financialYearList) {
        return this.financialYearList=financialYearList;
      } else {
        console.error("No data received from API");
        return [];
      }
    } catch (error) {
      console.error("Error fetching financial year list: ", error);
      return [];
    }
  }

  onFinancialYearChange(event: any) {
    const selectedYear = this.financialYearList.find(year => year.pkRfyid == event.target.value);
    console.log("selectedYear selectedYear",selectedYear,event.target.value);
    
    if (selectedYear) {
      console.log(`Selected Financial Year ID: ${selectedYear.pkRfyid}`);
      this.selectedFinancialYear = selectedYear.pkRfyid;
    }
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.incomeAmount = inputElement.value ? parseInt(inputElement.value, 10) : null;
    console.log('Income Amount:', this.incomeAmount);
    this.updateRadioSelection();
  }

  updateRadioSelection(): void {
    this.ocrMessage = "";
      this.selectedImage = "";
      this.selectedBackImage = "";
      this.frontImageBlob = null;
      this.backImageBlob = null;
      this.ocrIdOnImage = "";
      this.isUploadImageVisible = false;
      this.selectedDocToUpload = null;
      //marital status -start

      console.log("updateRadioSelection this.displayedQuestion.qsCode",this.displayedQuestion.qsCode);
      console.log("updateRadioSelection this.selectedRadioOption",this.selectedRadioOption);
      console.log("updateRadioSelection this.selectedStaticRadioOption",this.selectedStaticRadioOption);
      if (this.incomeAmount > 0) {
        this.selectedRadioOption = 'Yes';
      } else if (this.incomeAmount === 0) {
        this.selectedRadioOption = 'No';
      } else {
        this.selectedRadioOption = null;
      }
  }

  checkMaritalIncomeAmount(): void {
    const incomeAmount = this.incomeAmount != null ? Number(this.incomeAmount) : null;
    const spouseIncomeAmount = this.spouseIcomeAmount != null ? Number(this.spouseIcomeAmount) : null;
  
    if ((incomeAmount !== null && incomeAmount >= 0) || (spouseIncomeAmount !== null && spouseIncomeAmount >= 0)) {
      if (incomeAmount > 0 && (spouseIncomeAmount === null || spouseIncomeAmount === 0)) {
        this.selectedRadioOption = 'Self';
      } else if ((incomeAmount === null || incomeAmount === 0) && spouseIncomeAmount > 0) {
        this.selectedRadioOption = 'Spouse';
      } else if (incomeAmount > 0 && spouseIncomeAmount > 0) {
        this.selectedRadioOption = 'Both';
      } else {
        this.selectedRadioOption = 'None';
      }
    } else {
      this.selectedRadioOption = 'None';
    }
  }

  // sending OTP to entered mobile number and email id
  async sendOtpToMail() {
    this.otp = "";
    this.mobileOtp = "";
    this.displayProgressSpinner();
    const fileObj = {
      pkReid: null,
      fkRegid: localStorage.getItem("regId"),
      fkQsid: this.displayedQuestion.pkQsid,
      reQsAns: "",
      reQsAnsStatus: "Active",
      reQsAnsUpdateDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      reAnsStatus: "Unverified",
      reEmail: this.emailId,
      reOtp: "",
      reMobileNo: this.mobileNo,
      reMobileOtp: "",
      reOtpValidity: "",
      reResendMobileOtpYn: this.resendOtp,
    };
    const response: any = await this.questionAnswerService.sendOtpMail(JSON.stringify(fileObj));
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.reAnsStatus == "OTP limit exceeded") {
        this.frontendWarningToast(response.reAnsStatus);
      } else if (response.fkRegid != null) {
        this.resendOtpTimer(120);
        this.isOtpVerificationVisible = true;
        this.isEmailVisible = false;
        localStorage.setItem("regId", response.fkRegid);
        this.successToast(this.translocoService.translate("success-otp-sent"));
      } else {
        this.selectedImage = "";
        this.ocrIdOnImage = "";
        this.isUploadImageVisible = false;
        this.backendWarningToast("Unable to send OTP.");
      }
    } else {
      this.errorToast(response);
    }
  }

  // verifying entered OTP
  async verifyOtp() {
    this.displayProgressSpinner();
    const fileObj = {
      pkReid: null,
      fkRegid: localStorage.getItem("regId"),
      fkQsid: this.displayedQuestion.pkQsid,
      reQsAns: "",
      reQsAnsStatus: "Active",
      reQsAnsUpdateDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      reAnsStatus: "Unverified",
      reEmail: this.emailId,
      reOtp: this.otp,
      reMobileNo: this.mobileNo,
      reMobileOtp: this.mobileOtp,
      reOtpValidity: "",
    };
    const response: any = await this.questionAnswerService.verifyOtp(JSON.stringify(fileObj));
    this.progressSpinnerDialog.close();
    if (response == "Success") {
      if (
        this.displayedQuestion.qsOption1[this.activeLang] == null &&
        this.displayedQuestion.qsOption2[this.activeLang] == null
      ) {
        this.nextQuestion(this.displayedQuestion);
        localStorage.setItem("mobileNo", this.mobileNo);
      }
      this.successToast("OTP verified.");
    } else {
      this.isOtpVerificationVisible = true;
      this.isEmailVisible = false;
      this.frontendWarningToast(response);
    }
  }

  // converting base64 to blob when user selects image from gallery or device
  async base64ToBlob(base64Image: any) {
    this.errorMessageVisible = false;
    this.isOtpVerificationVisible = false;
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpg" });
    let fileName = "ILMS_" + new Date().getTime() + ".jpg";
    const imageFile = new File([blob], fileName, { type: "image/jpg" });
    this.fileUploadVisible = false;
    if (this.selectedImage == "") {
      this.frontImageBlob = imageFile;
      this.selectedImage = "data:image/jpg;base64," + base64Image;
      if (this.displayedQuestion.qsCode != "Q_AADHAR") {
        this.uploadDocuments();
      }
    } else {
      this.selectedBackImage = "data:image/jpg;base64," + base64Image;
      this.backImageBlob = imageFile;
      this.uploadDocuments();
    }
  }

  // function to get image from device (gallery, downloads, etc.)
  async handleFileInput(event: any) {
    // this.selectedImage = '';
    this.fileUploadVisible = false;
    const files = event.target.files;
    if (files[0].type.split("/")[0] != "image") {
      this.errorMessageVisible = true;
    } else {
      // console.log(files[0]);
      const cropperDialog = this.dialog.open(CropImageComponent, {
        disableClose: true,
        width: "600px",
        // height: "100%",
        data: event,
      });
      cropperDialog.afterClosed().subscribe((result) => {
        if (result != "") {
          if (this.isEdit == "true") {
            this.predefinedDocEditFlowOcrDone = false;
          }
          let data = result.split("data:image/png;base64,");
          this.base64ToBlob(data[1]);
        } else {
          this.reUploadImage();
        }
      });
    }
  }

  // for opening input type file container
  fileUpload() {
    document.getElementById("fileupload").click();
  }

  // Capture Document Image from Camera
  async captureDocImage() {
    // start the document scanner
    const { scannedImages, status } = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
      responseType: ResponseType.Base64,
    });
    if (status == "success") {
      if (this.isEdit == "true") {
        this.predefinedDocEditFlowOcrDone = false;
      }
      const base64 = scannedImages[0];
      const imageName = "name.png";

      const imageBlob: any = this.dataURItoBlob(base64);
      const imageFile = new File([imageBlob], imageName, { type: "image/png" });
    }
  }

  // Converting base64 to Blob
  async dataURItoBlob(base64Image: any) {
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpg" });
    const imageFile = new File([blob], "", { type: "image/jpg" });
    if (this.selectedImage == "") {
      this.frontImageBlob = imageFile;
      this.selectedImage = "data:image/jpeg;base64," + base64Image;
      if (this.displayedQuestion.qsCode != "Q_AADHAR") {
        this.uploadDocuments();
      }
    } else {
      this.selectedBackImage = "data:image/jpeg;base64," + base64Image;
      this.backImageBlob = imageFile;
      this.uploadDocuments();
    }
  }

  // called when user clicks on file upload icon,
  // when platform is desktop (browser), only input type file is allowed
  // in case of mobile app, user is presented with 2 options, camera or file upload
  async presentActionSheet() {
    this.fileUploadVisible = true;
    this.ocrMessage = "";
    this.ocrIdOnImage = "";
    if (
      !window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/") &&
      !window.location.href.toString().startsWith("https://housing.pmrda.gov.in/")
    ) {
      this.fileUploadVisible = true;
      this.ocrIdOnImage = "";
      const actionSheet = await this.actionSheetController.create({
        header: this.uploadFromEnMr,
        cssClass: "my-custom-class",
        buttons: [
          {
            text: this.galleryEnMr,
            icon: "images",
            data: "Data value",
            handler: () => {
              this.fileUpload();
            },
          },
          {
            text: this.cameraEnMr,
            icon: "camera",
            id: "delete-button",
            handler: () => {
              this.captureDocImage();
            },
          },
        ],
      });
      await actionSheet.present();
      const { role, data } = await actionSheet.onDidDismiss();
    } else {
      setTimeout(() => {
        this.fileUploadVisible = true;
        this.fileUpload();
      }, 200);
    }
  }

  // TOAST MESSAGES
  async successToast(message: string) {
    // this.clearTimer();
    this.isImageUploaded = true;
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: message,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }

  async frontendWarningToastPlain(message: string) {
    const toast = await this.toastController.create({
      message: message,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 5000,
    });
    toast.present();
  }

  async frontendWarningToast(message: string) {
    // this.clearTimer();
    this.isImageUploaded = false;
    this.progressSpinnerDialog.close();
    this.selectedImage = "";
    this.selectedBackImage = "";
    this.ocrMessage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.selectedRadioOption = "";
    this.isUploadImageVisible = false;
    const toast = await this.toastController.create({
      message: message,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 10000,
    });
    toast.present();
  }

  async backendWarningToast(message: any) {
    // this.clearTimer();
    this.isImageUploaded = false;
    this.progressSpinnerDialog.close();
    this.selectedImage = "";
    this.selectedBackImage = "";
    this.ocrMessage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.selectedRadioOption = "";
    setTimeout(() => {
      this.isUploadImageVisible = false;
    }, 10);
    const toast = await this.toastController.create({
      message: message.error,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 5000,
    });
    toast.present();
  }

  async ocrWarningToast(message: any) {
    // this.clearTimer();
    this.isImageUploaded = false;
    this.progressSpinnerDialog.close();
    this.selectedImage = "";
    this.selectedBackImage = "";
    this.ocrMessage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.selectedRadioOption = "";
    setTimeout(() => {
      this.isUploadImageVisible = false;
    }, 10);
    const toast = await this.toastController.create({
      message: this.translocoService.translate("error-network-related"),
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();
  }

  async errorToastServer(error: any) {
    this.reUploadImage();
    this.progressSpinnerDialog.close();
    this.selectedRadioOption = "";
    this.selectTypeOfDocToUploadVisible = false;
    this.domicileTokenTextFieldVisible = false;
    if (error.error.message != undefined) {
      if (error.error.message.includes("JWT expired")) {
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
      } else if(error.error.message.includes("Working") || error.error.message.includes("ITR is mandatory")){
        const toast = await this.toastController.create({
          message: error.error.message,
          icon: "information-circle",
          position: "top",
          cssClass: "toast error-toast",
          duration: 5000,
        });
        toast.present();
        // setTimeout(() => {
        //   localStorage.clear();
        //   this.router.navigate([''])
        // }, 2000);
      } else {
        const toast = await this.toastController.create({
          message: this.translocoService.translate("error-network-related"),
          icon: "information-circle",
          position: "top",
          cssClass: "toast error-toast",
          duration: 5000,
        });
        toast.present();
        // setTimeout(() => {
        //   localStorage.clear();
        //   this.router.navigate([''])
        // }, 2000);
      }
    } else {
      // this.clearTimer();
      this.isImageUploaded = false;
      this.selectedImage = "";
      this.selectedBackImage = "";
      this.selectedDocToUpload = null;
      this.progressSpinnerDialog.close();
      this.ocrMessage = "";
      this.frontImageBlob = null;
      this.backImageBlob = null;
      const toast = await this.toastController.create({
        message: this.translocoService.translate("error-network-related"),
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 5000,
      });
      toast.present();
    }
  }

  async errorToast(error: any) {
    this.reUploadImage();
    this.progressSpinnerDialog.close();
    this.selectedRadioOption = "";
    this.selectTypeOfDocToUploadVisible = false;
    this.domicileTokenTextFieldVisible = false;
    if (error.error.message != undefined) {
      if (error.error.message.includes("JWT expired")) {
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
          message: this.translocoService.translate("error-network-related"),
          icon: "information-circle",
          position: "top",
          cssClass: "toast error-toast",
          duration: 5000,
        });
        toast.present();
        // setTimeout(() => {
        //   localStorage.clear();
        //   this.router.navigate([''])
        // }, 2000);
      }
    } else {
      // this.clearTimer();
      this.isImageUploaded = false;
      this.selectedImage = "";
      this.selectedBackImage = "";
      this.selectedDocToUpload = null;
      this.progressSpinnerDialog.close();
      this.ocrMessage = "";
      this.frontImageBlob = null;
      this.backImageBlob = null;
      const toast = await this.toastController.create({
        message: this.translocoService.translate("error-network-related"),
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 5000,
      });
      toast.present();
    }
  }

  customSnackBar(data: any) {
    this.scrollIntoView();
    // this.clearTimer();
    this.isImageUploaded = true;
    this.progressSpinnerDialog.close();
    // this.snackBar.openFromComponent(CustomSnackbarComponent, {
    //   duration: 7500,
    //   data: data,
    //   panelClass: "custom-success-snackbar",
    //   verticalPosition: "top",
    // });
    if (data[1] == "pmay") {
      this.ocrMessage =
        this.translocoService.translate("custom-assessment-id") +
        "<b>" +
        data[0] +
        "</b>" +
        this.translocoService.translate("custom-reupload");
    } else if (data[1] == "address") {
      this.ocrMessage =
        "Please check, Your Address is - <b>" + data[0] + "</b>" + this.translocoService.translate("custom-reupload");
    } else if (data[1] == "common") {
      this.ocrMessage =
        this.translocoService.translate("custom-check") +
        "<b>" +
        data[2] +
        "</b>" +
        this.translocoService.translate("custom-number-check") +
        "<b>" +
        data[0] +
        "</b>" +
        this.translocoService.translate("custom-reupload");
    } else if (data[1] == "itr") {
      this.ocrMessage =
        this.translocoService.translate("custom-itr-name") +
        "<b>" +
        data[4] +
        "</b>" +
        this.translocoService.translate("custom-itr-acknowledgement-no") +
        "<b>" +
        data[0] +
        "</b>" +
        this.translocoService.translate("custom-for-ay") +
        "<b>" +
        data[2] +
        "</b>" +
        this.translocoService.translate("custom-total-income") +
        "<b>" +
        data[3] +
        "</b>" +
        this.translocoService.translate("custom-reupload");
    } else if (data[2] == "aadhar") {
      this.ocrMessage =
        this.translocoService.translate("custom-aadhar-name") +
        "<b>" +
        data[0] +
        "</b>" +
        this.translocoService.translate("custom-number-check") +
        "<b>" +
        data[1] +
        "</b>" +
        this.translocoService.translate("custom-reupload");
    } else if (data[1] == "caste-cert") {
      this.ocrMessage = this.translocoService.translate("document-verification-pending");
    } else if (data[2] == "predefined") {
      this.ocrMessage =
        "Please check, you are uploading " +
        "<b>" +
        data[0] +
        "</b>" +
        " Category & Certificate is " +
        "<b>" +
        data[1] +
        "</b>" +
        ". If correct, please proceed.";
    }
  }
  // END

  async routeToHome() {
    localStorage.setItem("lastRoute", "/");
    this.router.navigate(["/landing"]);
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async spouseFlag() {
    this.selfSpouseSw = "S"; // SELF
    if (this.displayedQuestion.qsQuestion["en"].toLowerCase().includes("spouse")) {
      this.selfSpouseSw = "W"; // SPOUSE
    } else {
      this.selfSpouseSw = "S";
    }
  }

  requestDtoStringForMcq() {
    let localVarSelectedRadioOption: any = null;
    if (this.displayedQuestion.qsCode == "Q_SELF_WORKING") {
      if (this.selectedRadioOption == "Yes") {
        localVarSelectedRadioOption = "Self";
      } else {
        localVarSelectedRadioOption = "None";
      }
    } else if (this.displayedQuestion.qsCode == "Q_CAST_CERT") {
      localVarSelectedRadioOption = localStorage.getItem("caste-option");
    } else if (
      this.displayedQuestion.qsCode == "Q_ARTIST" ||
      this.displayedQuestion.qsCode == "Q_FREEDOM" ||
      this.displayedQuestion.qsCode == "Q_MLA"
    ) {
      if (this.selectedRadioOption == "Yes" && this.selectedAllowedWithConditionRadioOption == "Yes") {
        localVarSelectedRadioOption = "I have certificate";
      } else if (this.selectedRadioOption == "Yes" && this.selectedAllowedWithConditionRadioOption == "No") {
        localVarSelectedRadioOption = "I do not have certificate as of now";
      } else {
        localVarSelectedRadioOption = this.selectedRadioOption;
      }
    } else {
      localVarSelectedRadioOption = this.selectedRadioOption;
    }

    let pkQsid = 0;
    if (+this.displayedQuestion.pkQsid == 7) {
      pkQsid = 12;
    } else {
      pkQsid = this.displayedQuestion.pkQsid;
    }
    this.fileObj = {
      quesId: pkQsid,
      quesCode: this.displayedQuestion.qsCode,
      regId: localStorage.getItem("regId"),
      ansOption: localVarSelectedRadioOption,
      email: this.emailId,
      otp: this.otp,
      // mobileNo:this.mobileNo,
      // mobileOtp:this.mobileOtp,
      barcode: this.ocrIdOnImage.trim(),
      panNo: localStorage.getItem("pan_number"),
      aadharNo: localStorage.getItem("aadhar_number"),
      docuLocation: localStorage.getItem("docuLocation"),
      mediaType: "image",
      docImage: "",
      ocrString: this.itrOcrResponseString,
    };
  }

  // called when user selects image to upload either via camera or file input
  uploadDocuments() {
    // this.startTimer();
    if (this.displayedQuestion.qsCode == "Q_AADHAR") {
      if (this.frontImageBlob != null && this.backImageBlob != null) {
        // this.uploadAadharImage();
      }
    } else if (this.displayedQuestion.qsCode == "Q_PAN") {
      alert('Something went wrong. Please contact to admin. uploadPanImage');
      // this.uploadPanImage();
    } else if (this.displayedQuestion.qsCode == "Q_DOMICILE") {
      this.uploadDomicileImage();
    } else if (this.displayedQuestion.qsCode == "Q_CAST_VALID") {
      this.uploadCasteValidityImage();
    } else if (this.displayedQuestion.qsCode == "Q_CAST_CERT") {
      this.uploadCasteCertificateImage();
    }
    // else if (this.displayedQuestion.qsCode == "Q_ADDRESS" && this.selectedDocToUpload == "electricityBill") {
    //   this.uploadElectricityBill();
    // } else if (this.displayedQuestion.qsCode == "Q_ADDRESS" && this.selectedDocToUpload == "gasBill") {
    //   this.uploadGasImage();
    // } else if (this.displayedQuestion.qsCode == "Q_ADDRESS" && this.selectedDocToUpload == "drivingLicense") {
    //   this.uploadDrivingLicenseImage();
    // }
    // else if (this.displayedQuestion.qsCode == "Q_ADDRESS") {
    //   if (this.selectedDocToUpload == "55" || this.selectedDocToUpload == "56" || this.selectedDocToUpload == "57") {
    //     this.ocrAddressDocument("ocrAddressDocument");
    //   } else if (
    //     this.selectedDocToUpload == "51" ||
    //     this.selectedDocToUpload == "52" ||
    //     this.selectedDocToUpload == "53" ||
    //     this.selectedDocToUpload == "54"
    //   ) {
    //     this.ocrAddressDocument("ocrAddressDocumentElectricity");
    //   }
    // }
    else if (this.displayedQuestion.qsCode == "Q_ITR" || this.displayedQuestion.qsCode == "Q_ITR_SPOUSE") {
      this.uploadSelfItrImage();
    } else if (this.displayedQuestion.qsCode == "Q_HANDICAPED") {
      this.uploadHandicapImage();
    } else if (this.displayedQuestion.qsCode == "Q_MHADA") {
      this.uploadMhadaImage();
      // this.predefinedDocsYesNo("", "");
    } else if (this.displayedQuestion.qsCode == "Q_PMAY") {
      // this.uploadPmay();
      this.uploadPredefinedDoc("uploadPmay", "PMAY");
    } else if (this.displayedQuestion.qsCode == "Q_SELF_ITR" || this.displayedQuestion.qsCode == "Q_SPOUSE_ITR") {
      if (this.selectedRadioOption == "Yes") {
        this.uploadSelfItrImage();
      } else {
        this.uploadSelfIncomeCertificateImage();
      }
    } else if (this.displayedQuestion.qsCode == "Q_INCOME_CERT") {
      // if (this.selectedRadioOption == "No") {
      this.uploadFamilyIncomeImage();
      // }
    } else if (this.displayedQuestion.qsCode == "Q_ARTIST") {
      if (this.displayedQuestion.qs_ans == "No") {
        this.predefinedDocEditFlowOcrDone = false;
      }
      this.predefinedDocsYesNo("ocrArtistV3", "ARTIST");
    } else if (this.displayedQuestion.qsCode == "Q_CENTRAL") {
      this.predefinedDocsYesNo("ocrCetralEmployeeV3", "CENTRAL GOVERNMENT EMPLOYEE");
    } else if (this.displayedQuestion.qsCode == "Q_STATE") {
      this.predefinedDocForState("uploadStateEmployeeV1", "STATE GOVERNMENT EMPLOYEE");
      // this.verifyPredefinedDocs("State Employee", "uploadStateEmployeeV1", "verifyStateEmployee");
    } else if (this.displayedQuestion.qsCode == "Q_FREEDOM") {
      this.predefinedDocsYesNo("ocrFreedomFighterV3", "FREEDOM FIGHTER");
    } else if (this.displayedQuestion.qsCode == "Q_EXSERVICEMAN") {
      if (this.selectedRadioOption == "Ex Serviceman") {
        this.showExservicemanFile = true;
        this.predefinedDocsYesNo("ocrExServicemenV3", "EX-SERVICEMEN");
      } else if (this.selectedRadioOption == "Defence Family") {
        this.showDefenceFamilyFile = true;
        this.predefinedDocsYesNo("ocrDefenceFamilyV3", "DEFENCE FAMILIES");
      }
    } else if (this.displayedQuestion.qsCode == "Q_JOURNALIST") {
      this.predefinedDocsYesNo("ocrJournlistV3", "JOURNALIST");
    } else if (this.displayedQuestion.qsCode == "Q_MLA") {
      this.predefinedDocsYesNo("ocrMpmlaV3", "MPMLAMLC");
    }
  }

  // called when user accepts consent
  async updateConsent() {
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.updateConsent(
      localStorage.getItem("regId"),
      this.displayedQuestion.pkQsid
    );
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.toLowerCase() == "success") {
        this.nextQuestion(this.displayedQuestion);
      } else {
        this.frontendWarningToast(this.translocoService.translate("warning-unable-to-update-consent"));
      }
    } else {
      this.errorToast(response);
    }
  }

  async changeOcrFlagIfEditTrue() {
    if (this.isEdit == "true") {
      this.isOcrDone = "Yes";
    }
  }

  // called when user is editing the profile docs,
  // displays pre-uploaded doc for the question that is currently being edited
  async viewPreuploadImages(document: any) {
    this.predefinedDocEditFlowOcrDone = true;
    let image = document.qs_doc_document.split(",");
    if (image[1] != undefined) {
      const progressSpinnerDialog1 = this.dialog.open(LoaderComponent, {
        disableClose: true,
        panelClass: "progressSpinner",
      });
      const response: any = await this.profileService.downloadFile(image[1].split("/").pop());
      progressSpinnerDialog1.close();
      if (response != null && !response.error) {
        let file = new Blob([response], { type: "image/*" });
        var fileURL = URL.createObjectURL(file);
        this.selectedBackImage = this.domSanitizer.bypassSecurityTrustResourceUrl(fileURL);
      } else {
        this.errorToast(response);
      }
    }
    const progressSpinnerDialog2 = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
    const response: any = await this.profileService.downloadFile(image[0].split("/").pop());
    progressSpinnerDialog2.close();
    if (response != null && !response.error) {
      let file = new Blob([response], { type: "image/*" });
      var fileURL = URL.createObjectURL(file);
      this.isUploadImageVisible = true;
      this.isImageUploaded = true;
      this.selectedImage = this.domSanitizer.bypassSecurityTrustResourceUrl(fileURL);
    }
  }

  // EDIT condition for SPOUSE or SPOUSE related questions like MARRIED or WORKIGN BOTH
  editSpouseAadhar() {
    this.scrollIntoView();
    this.selectedRadioOption = "";
    this.displayedQuestion = this.editRecordList[10];
    if (this.displayedQuestion.qs_ans_status == "Verified") {
      this.isQrScan = false;
      this.viewPreuploadImages(this.displayedQuestion);
    }
  }

  editSpousePan() {
    this.scrollIntoView();
    this.selectedRadioOption = "";
    this.selectedImage = "";
    this.selectedBackImage = "";
    this.isUploadImageVisible = false;
    this.displayedQuestion = this.editRecordList[11];
    if (this.editRecordList[11]["qs_ans_status"] == "Not Answered") {
      this.selectedRadioOption = "";
    } else if (
      this.displayedQuestion.qs_ans_status == "Verified" ||
      this.displayedQuestion.qs_ans_status == "Rejected-Duplicate" ||
      this.displayedQuestion.qs_ans_status == "Surrender"
    ) {
      this.selectedRadioOption = "Yes";
      this.viewPreuploadImages(this.displayedQuestion);
    } else {
      this.selectedRadioOption = "No";
    }
  }

  // async getProfileDetailsForMarriedFlow() {
  //   this.displayProgressSpinner();
  //   const response: any = await this.profileService.getProfileDetails(localStorage.getItem("regId"));
  //   this.progressSpinnerDialog.close();
  //   if (response != null && !response.error) {
  //     if (response.length > 0) {
  //       localStorage.setItem("editRecords", JSON.stringify(response));
  //       this.editRecordList = JSON.parse(localStorage.getItem("editRecords"));
  //       let profileDetail = response.pop();
  //       if (profileDetail[0]["isProfileActive"] == "N") {
  //         localStorage.clear();
  //         this.sharedService.setAuthentication(false);
  //         this.router.navigate(["/"]);
  //         window.location.reload();
  //       }
  //       if (this.displayedQuestion.qsCode == "Q_MARITAL" && this.selectedRadioOption != "Married") {
  //         this.displayedQuestion = this.allQuestions[6];
  //         if (this.editRecordList[12].qs_ans == "Self") {
  //           this.selectedRadioOption = "Yes";
  //         } else if (this.editRecordList[12].qs_ans == "None") {
  //           this.selectedRadioOption = "No";
  //         } else {
  //           this.selectedRadioOption = "";
  //         }
  //       } else {
  //         this.displayedQuestion = this.editRecordList[12]; // couple work status
  //         this.selectedRadioOption = this.displayedQuestion.qs_ans;
  //       }
  //     } else {
  //       this.backendWarningToast(response.error);
  //     }
  //   } else {
  //     this.errorToast(response);
  //   }
  // }

  async getProfileDetailsForMarriedFlow() {
    this.displayProgressSpinner();
    const response: any = await this.profileService.getProfileDetails(
      localStorage.getItem("regId")
    );
    this.progressSpinnerDialog.close();
    console.log("response >> ",response);

    if (response != null && !response.error) {
      if (response.length > 0) {
        localStorage.setItem("editRecords", JSON.stringify(response));
        this.editRecordList = JSON.parse(localStorage.getItem("editRecords"));
        let profileDetail = response.pop();
        if (profileDetail[0]["isProfileActive"] == "N") {
          localStorage.clear();
          this.sharedService.setAuthentication(false);
          this.router.navigate(["/"]);
          window.location.reload();
        }
        if (
          this.displayedQuestion.qsCode == "Q_MARITAL" &&
          this.selectedRadioOption != "Married"
        ) {
          this.displayedQuestion = this.allQuestions[6];
          if (this.editRecordList[12].qs_ans == "Self") { // this. editRecordList[12]... to this.editRecordList[13]
            this.selectedRadioOption = "Yes";
            this.incomeAmount = this.editRecordList[12]?.rwsSelfInc;
            this.selectedFinancialYear = this.editRecordList[12]?.fkRfyid;
            console.log("this.editRecordList[11]?.rwsSelfInc if >>",this.editRecordList[11]?.rwsSelfInc);
            console.log("this.editRecordList[12]?.rwsSelfInc if >>",this.editRecordList[12]?.rwsSelfInc);
            console.log("this.editRecordList[13]?.rwsSelfInc if >>",this.editRecordList[13]?.rwsSelfInc);
          } else if (this.editRecordList[12].qs_ans == "None") {
            this.selectedRadioOption = "No";
            this.incomeAmount = this.editRecordList[12]?.rwsSelfInc;
            this.selectedFinancialYear = this.editRecordList[12]?.fkRfyid;
            console.log("this.editRecordList[11]?.rwsSelfInc",this.editRecordList[11]?.rwsSelfInc);
            console.log("this.editRecordList[12]?.rwsSelfInc",this.editRecordList[12]?.rwsSelfInc);
            console.log("this.editRecordList[13]?.rwsSelfInc",this.editRecordList[13]?.rwsSelfInc);
          } else {
            this.selectedRadioOption = "";
          }
        } else {
          //console.log("marital edit set this.editRecordList[13]?.rwsSelfInc ",this.editRecordList[13]?.rwsSelfInc ,this.editRecordList[13]?.rwsSpouseInc);
          this.displayedQuestion = this.editRecordList[12]; // couple work status this.editRecordList[12] to this.editRecordList[13]
          this.selectedRadioOption = this.displayedQuestion.qs_ans;
          this.incomeAmount = this.editRecordList[12]?.rwsSelfInc;
          this.spouseIcomeAmount = this.editRecordList[12]?.rwsSpouseInc;
          this.selectedFinancialYear = this.editRecordList[12]?.fkRfyid;
          
          console.log("this.incomeAmount >> ",this.incomeAmount, ">> this.spouseIcomeAmount >>", this.spouseIcomeAmount);
          
          //need to set drop down value
          const fkRfyid = this.editRecordList[12]?.fkRfyid;
          console.log("fkRfyid fkRfyid fkRfyid",fkRfyid);
        }
      } else {
        this.backendWarningToast(response.error);
      }
    } else {
      this.errorToast(response);
    }
  }

  async setProfileDetails() {
    const progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
    const response: any = await this.profileService.getProfileDetails(localStorage.getItem("regId"));
    progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.length > 0) {
        localStorage.setItem("editRecords", JSON.stringify(response));
        this.editRecordList = JSON.parse(localStorage.getItem("editRecords"));
        let profileDetail = response.pop();
        if (profileDetail[0]["isProfileActive"] == "N") {
          localStorage.clear();
          this.sharedService.setAuthentication(false);
          this.router.navigate(["/"]);
          window.location.reload();
        }
      } else {
        this.backendWarningToast(response.error);
      }
    } else {
      this.errorToast(response);
    }
  }

  editWorkingStatus() {
    this.scrollIntoView();
    this.selectedRadioOption = "";
    if (this.displayedQuestion.qsCode == "Q_MARITAL" && this.selectedRadioOption != "Married") {
      this.getProfileDetailsForMarriedFlow();
    } else {
      this.getProfileDetailsForMarriedFlow();
    }
    this.progressSpinnerDialog.close();
  }

  editItrIncomeCert() {
    this.selectedRadioOption = "";
    if (+this.displayedQuestion.pkQsid == 8) {
      // self ITR / Income Cert
      this.router.navigate(["/profile"]);
    } else if (+this.displayedQuestion.pkQsid == 13) {
      // self ITR / Income Cert
      this.router.navigate(["/profile"]);
    } else if (this.displayedQuestion.pkQsid == 29) {
      this.router.navigate(["/profile"]);
    }
  }
  // END

  // RESEND OTP TIMER
  resendOtpTimer(remaining: any) {
    var m: any = Math.floor(remaining / 60);
    var s: any = remaining % 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    this.resendOtpIn = m + ":" + s;
    localStorage.setItem("otpResendTimeLeft", this.resendOtpIn);
    remaining -= 1;

    if (remaining >= 0 && this.timerOn) {
      setTimeout(() => {
        this.resendOtpTimer(remaining);
      }, 1000);
      return;
    }

    if (!this.timerOn) {
      // Do validate stuff here
      return;
    } else {
      // Do timeout stuff here
      // alert('Timeout for otp');
      this.isResendOtpButtonVisible = true;
    }
  }

  onResendOtpClick() {
    this.resendOtp = "Y";
    this.isResendOtpButtonVisible = false;
    this.sendOtpToMail();
  }
  // END

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.screenWidth = window.innerWidth;
  }

  scrollIntoView() {
    var myDiv = document.getElementById("containerDiv");
    myDiv.scrollTop = 0;
  }

  viewHelpVideo() {
    if (this.displayedQuestion.qsDescription != "" && this.displayedQuestion.qsDescription != null) {
      this.dialog.open(YoutubeHelpVideoComponent, {
        disableClose: true,
        // width: "600px",
        panelClass: "video-dialog",
        data: this.displayedQuestion,
      });
    } else {
      this.frontendWarningToast(this.translocoService.translate("video-not-available"));
    }
  }

  viewIntroVideo(video: any) {
    if (video.qsDescription != "" && video.qsDescription != null) {
      this.dialog.open(AadharIntroVideoComponent, {
        disableClose: true,
        // width: "600px",
        panelClass: "video-dialog",
        maxWidth: "100vw",
        maxHeight: "100vh",
        height: "100%",
        width: "100%",
        data: video,
      });
    } else {
      this.frontendWarningToast(this.translocoService.translate("video-not-available"));
    }
  }

  async updateExServiceman() {
    let docId = "";
    if (this.selectedRadioOption == "Ex Serviceman") {
      docId = "19";
    } else if (this.selectedRadioOption == "Defence Family") {
      docId = "20";
    } else {
      docId = "0";
      this.frontImageBlob = "null";
    }
    if (
      this.isEdit == "true" &&
      this.selectedRadioOption == this.displayedQuestion.qs_ans &&
      this.exServicemanImageReuploaded == false
    ) {
      this.recordEditing();
    } else if (this.selectedRadioOption == "Ex Serviceman" || this.selectedRadioOption == "Defence Family") {
      this.verifyPredefinedDocs("Ex Servicemen", "uploadxService", "verifyExservice");
    } else {
      this.displayProgressSpinner();
      this.requestDtoStringForMcq();
      const response: any = await this.questionAnswerService.uploadxService(
        this.frontImageBlob,
        JSON.stringify(this.fileObj),
        docId
      );
      if (response != null && !response.error) {
        if (response.status.toLowerCase() == "success") {
          this.successToast("Detail saved successfully.");
          if (this.isEdit == "true") {
            this.recordEditing();
          } else {
            // this.jumpToQuestion(this.displayedQuestion);
            for (let i = 0; i < this.allQuestions.length; i++) {
              if (this.displayedQuestion.qsOption3NextQuestion == this.allQuestions[i]["pkQsid"]) {
                this.progressSpinnerDialog.close();
                this.selectedRadioOption = "";
                this.ngOnInit();
              }
            }
            // for (let i = 0; i < this.allQuestions.length; i++) {
            //   if (this.displayedQuestion.qsOption3NextQuestion == this.allQuestions[i]["pkQsid"]) {
            //     this.displayedQuestion = this.allQuestions[i];
            //     localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            //     this.selectedRadioOption = "";
            //     this.selectedImage = "";
            //     setTimeout(() => {
            //       this.isUploadImageVisible = false;
            //     }, 50);
            //   }
            // }
          }
        } else {
          this.selectedImage = "";
          this.isUploadImageVisible = false;
          this.frontendWarningToast(this.translocoService.translate("warning-unable-to-upload-doc"));
        }
      } else {
        this.errorToast(response);
      }
    }
  }

  domicileCheckBox(event: any) {
    if (event.detail.checked) {
      this.domicileConsentAccepted = event.detail.checked;
    } else if (!event.detail.checked) {
      this.domicileConsentAccepted = event.detail.checked;
    }
  }

  routeToCertEntry() {
    let panNo = localStorage.getItem("panNo");
    let category = "";
    if (panNo != null) {
      if (this.displayedQuestion.qsCode === "Q_JOURNALIST") {
        category = "JR";
      } else if (this.displayedQuestion.qsCode === "Q_FREEDOM") {
        category = "FF";
      } else if (this.displayedQuestion.qsCode === "Q_HANDICAPED") {
        category = "PH";
      } else if (this.displayedQuestion.qsCode === "Q_EXSERVICEMAN") {
        if (this.selectedRadioOption == "Ex Serviceman") {
          category = "EX";
        } else if (this.selectedRadioOption == "Defence Family") {
          category = "DF";
        } else {
          category = "";
        }
      } else if (this.displayedQuestion.qsCode === "Q_MLA") {
        category = "MP_MLA_MLC";
      } else if (this.displayedQuestion.qsCode === "Q_MHADA") {
        category = "ME";
      } else if (this.displayedQuestion.qsCode === "Q_STATE") {
        category = "SG";
      } else if (this.displayedQuestion.qsCode === "Q_CENTRAL") {
        category = "CG";
      } else if (this.displayedQuestion.qsCode === "Q_ARTIST") {
        category = "AR";
      } else if (this.displayedQuestion.qsCode === "Q_PMAY") {
        category = "PY";
      }
      this.router.navigate(["/cert-entry", "category", panNo, category], { replaceUrl: true });
    }
  }

  routeToCertEntryForExServiceAndDefenceFamily(category: any) {
    let panNo = localStorage.getItem("panNo");
    this.router.navigate(["/cert-entry", "category", panNo, category], { replaceUrl: true });
  }

  // JOURNALIST FLOW CHANGE
  journalistRadioButtonClicked() {
    if (this.isEdit == "true") {
      if (this.selectedRadioOption != this.editRecordList[22]["qs_ans"]) {
        this.markUserAsNotJournalist();
      } else {
        this.recordEditing();
      }
    } else {
      this.markUserAsNotJournalist();
    }
  }

  async markUserAsNotJournalist() {
    this.displayProgressSpinner();
    this.requestDtoStringForMcq();
    const response: any = await this.questionAnswerService.updateJournalist(JSON.stringify(this.fileObj));
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success" || response.status.toLowerCase() == "verified") {
        this.progressSpinnerDialog.close();
        this.successToast("Details saved successfully.");
        this.jumpToQuestion(this.displayedQuestion);
      } else if (response.status.toLowerCase() == "rejected") {
        this.progressSpinnerDialog.close();
        this.jumpToQuestion(this.displayedQuestion);
        const toast = await this.toastController.create({
          message: response.message,
          icon: "information-circle",
          position: "top",
          cssClass: "toast warning-toast",
          duration: 5000,
        });
        toast.present();
      } else if (response.status.toLowerCase() == "not-approved") {
        this.frontendWarningToast(
          this.translocoService.translate("predefined-doc-verification-rejected-part-1") +
          "JOURNALIST" +
          this.translocoService.translate("predefined-doc-verification-rejected-part-2")
        );
        setTimeout(() => {
          this.progressSpinnerDialog.close();
          this.router.navigate(["/cert-entry", "pan-validation"], { replaceUrl: true });
        }, 5000);
      } else if (response.status.toLowerCase() == "not-verified") {
        this.progressSpinnerDialog.close();
        this.frontendWarningToast(this.translocoService.translate("document-verification-pending"));
        this.jumpToQuestion(this.displayedQuestion);
      } else {
        this.progressSpinnerDialog.close();
        this.selectedRadioOption = "";
        const toast = await this.toastController.create({
          message: "Unable to save the details",
          icon: "information-circle",
          position: "top",
          cssClass: "toast warning-toast",
          duration: 5000,
        });
        toast.present();
      }
    } else {
      this.progressSpinnerDialog.close();
      this.errorToast(response);
    }
  }
  // END OF JOURNALIST FLOW CHANGE

  // CURRENTLY NOT REQUIRED
  // async uploadElectricityBill() {
  //   if (this.isEdit == "true") {
  //     this.isOcrDone = "Yes";
  //   }
  //   this.displayProgressSpinner();
  //   this.requestDtoStringForMcq();
  //   const response: any = await this.questionAnswerService.ocrElectricityBillV3(
  //     this.frontImageBlob,
  //     JSON.stringify(this.fileObj)
  //   );
  //   if (response != null && !response.error) {
  //     if (response.status.toLowerCase() == "success") {
  //       let ocrResult: any = JSON.parse(response.ocrString);
  //       if (ocrResult.status.toLowerCase() == "success") {
  //         this.ocrIdOnImage = ocrResult.data.electricity_bill_address;
  //         localStorage.setItem("docuLocation", response.documentLocation);
  //         // this.successToast("Electricity bill uploaded successfully.");
  //         this.customSnackBar([this.ocrIdOnImage, "common", "Electricity Bill"]);
  //       } else {
  //         this.backendWarningToast(ocrResult);
  //       }
  //     } else {
  //       this.selectedImage = "";
  //       this.ocrIdOnImage = "";
  //       this.isUploadImageVisible = false;
  //       this.backendWarningToast(response);
  //     }
  //   } else {
  //     this.errorToast(response);
  //   }
  // }

  // async ocrAddressDocument(wsName: string) {
  //   if (this.isEdit == "true") {
  //     this.isOcrDone = "Yes";
  //   }
  //   this.displayProgressSpinner();
  //   this.requestDtoStringForMcq();
  //   const response: any = await this.questionAnswerService.ocrAddressDocument(
  //     this.frontImageBlob,
  //     JSON.stringify(this.fileObj),
  //     this.selectedDocToUpload,
  //     wsName
  //   );
  //   if (response != null && !response.error) {
  //     if (response.status.toLowerCase() == "success") {
  //       let ocrResult: any = JSON.parse(response.ocrString);
  //       if (ocrResult.status.toLowerCase() == "success") {
  //         this.ocrIdOnImage = ocrResult.data.address;
  //         localStorage.setItem("docuLocation", response.documentLocation);
  //         // this.successToast("Document uploaded successfully.");
  //         this.customSnackBar([ocrResult.data.address, "address"]);
  //       } else {
  //         this.backendWarningToast(ocrResult);
  //       }
  //     } else {
  //       this.selectedImage = "";
  //       this.ocrIdOnImage = "";
  //       this.isUploadImageVisible = false;
  //       this.backendWarningToast(response);
  //     }
  //   } else {
  //     this.errorToast(response);
  //     this.isUploadImageVisible = false;
  //   }
  // }

  // async uploadGasImage() {
  //   this.displayProgressSpinner();
  //   this.requestDtoStringForMcq();
  //   const response: any = await this.questionAnswerService.ocrGasBillV3(
  //     this.frontImageBlob,
  //     JSON.stringify(this.fileObj)
  //   );
  //   if (response != null && !response.error) {
  //     if (response.status == "success") {
  //       if (response.error != null) {
  //         this.selectedImage = "";
  //         this.ocrIdOnImage = "";
  //         this.isUploadImageVisible = false;
  //         this.backendWarningToast(response);
  //       } else {
  //         // this.successToast("Gas bill uploaded successfully.");
  //         this.customSnackBar([this.ocrIdOnImage, "common", "Gas Bill"]);
  //       }
  //     } else {
  //       this.selectedImage = "";
  //       this.ocrIdOnImage = "";
  //       this.isUploadImageVisible = false;
  //       this.backendWarningToast(response);
  //     }
  //   } else {
  //     this.errorToast(response);
  //   }
  // }

  // async uploadDrivingLicenseImage() {
  //   if (this.isEdit == "true") {
  //     this.isOcrDone = "Yes";
  //   }
  //   this.displayProgressSpinner();
  //   this.requestDtoStringForMcq();
  //   const response: any = await this.questionAnswerService.ocrDrivingLicenseV3(
  //     this.frontImageBlob,
  //     JSON.stringify(this.fileObj)
  //   );
  //   if (response != null && !response.error) {
  //     if (response.status.toLowerCase() == "success") {
  //       let ocrResult: any = JSON.parse(response.ocrString);
  //       if (ocrResult.status.toLowerCase() == "success") {
  //         this.ocrIdOnImage = ocrResult.data.driving_licence_address;
  //         localStorage.setItem("docuLocation", response.documentLocation);
  //         // this.successToast("Driving licence uploaded successfully.");
  //         this.customSnackBar([this.ocrIdOnImage, "common", "Driving License"]);
  //       } else {
  //         this.backendWarningToast(ocrResult);
  //       }
  //     } else {
  //       this.selectedImage = "";
  //       this.ocrIdOnImage = "";
  //       this.isUploadImageVisible = false;
  //       this.backendWarningToast(response);
  //     }
  //   } else {
  //     this.errorToast(response);
  //   }
  // }
  // docSelectedToUpload() {
  //   this.ocrMessage = "";
  //   this.selectedImage = "";
  //   if (this.selectedDocToUpload != null) {
  //     this.selectedImage = "";
  //     this.isUploadImageVisible = true;
  //     this.ocrIdOnImage = "";
  //   }
  // }
  // requestDtoStringForFileUpload() {
  //   this.fileObj = {
  //     quesId: this.displayedQuestion.pkQsid,
  //     quesCode: this.displayedQuestion.qsCode,
  //     regId: localStorage.getItem("regId"),
  //     ansOption: "",
  //     aadharNo: localStorage.getItem("aadhar_number"),
  //     docuLocation: "",
  //     mediaType: "image",
  //     docImage: "",
  //     panNo: localStorage.getItem("pan_number"),
  //   };
  // }

  // async refreshPage(event: any) {
  //   this.refresherEvent = event;
  //   this.loadQuestions();
  // }

  // startTimer() {
  //   this.timeTaken = null;
  //   this.timerRunning = !this.timerRunning;
  //   if (this.timerRunning) {
  //     const startTime = Date.now() - (this.counter || 0);
  //     this.timerRef = setInterval(() => {
  //       this.counter = Date.now() - startTime;
  //     });
  //   } else {
  //     clearInterval(this.timerRef);
  //   }
  // }

  // clearTimer() {
  //   this.timeTaken = this.counter / 1000;
  //   this.timerRunning = false;
  //   this.counter = undefined;
  //   clearInterval(this.timerRef);
  // }

  // ngOnDestroy() {
  //   clearInterval(this.timerRef);
  // }

  // AADHAR BARCODE SCANNER
  // parseXML(data) {
  //   return new Promise((resolve) => {
  //     const arr = [];
  //     const parser = new xml2js.Parser({
  //       trim: true,
  //       explicitArray: true,
  //     });
  //     parser.parseString(data, function (err, result) {
  //       const obj = result.PrintLetterBarcodeData.$;
  //       arr.push({
  //         co: obj.co,
  //         dist: obj.dist,
  //         gender: obj.gender,
  //         lm: obj.lm,
  //         loc: obj.loc,
  //         name: obj.name,
  //         pc: obj.pc,
  //         po: obj.po,
  //         state: obj.state,
  //         uid: obj.uid,
  //         vtc: obj.vtc,
  //         yob: obj.yob,
  //       });
  //       resolve(arr);
  //     });
  //     this.scannedQrData = arr;
  //     this.isQrScan = false;
  //   });
  // }

  // scanBarcode() {
  //   const options: BarcodeScannerOptions = {
  //     preferFrontCamera: false,
  //     showFlipCameraButton: true,
  //     showTorchButton: true,
  //     torchOn: false,
  //     prompt: "Place a barcode inside the scan area",
  //     resultDisplayDuration: 500,
  //     formats: "EAN_13,EAN_8,QR_CODE,PDF_417 ",
  //     orientation: "portrait",
  //   };

  //   // this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,barcodeData).then(data=>{
  //   //   alert('Barcode data'+ data);
  //   //   this.scannedData = barcodeData.text;
  //   //   this.parseXML(this.scannedData)
  //   // }).catch(err => {
  //   //   alert('Error '+ err);
  //   // });
  //   this.barcodeScanner
  //     .scan(options)
  //     .then((barcodeData) => {
  //       if (barcodeData.text.startsWith("<?xml")) {
  //         alert(barcodeData.text);
  //         this.scannedData = barcodeData.text;
  //         this.parseXML(this.scannedData);
  //       } else {
  //         alert("Unable to read masked QR code.");
  //         this.scannedData = "";
  //       }
  //     })
  //     .catch((err) => {
  //       this.scannedData = "";
  //       alert("Error" + err);
  //     });
  // }

  // async saveImage(photo: Photo) {
  //   const base64Data = await this.readAsBase64(photo);

  //   const fileName = new Date().getTime() + ".jpeg";
  //   const savedFile = await Filesystem.writeFile({
  //     path: `${IMAGE_DIR}/${fileName}`,
  //     data: base64Data,
  //     directory: Directory.Data,
  //   });
  // }

  // async readAsBase64(photo: any) {
  //   const response = await fetch(photo.webPath);
  //   const blob = await response.blob();
  //   if (this.selectedImage == "") {
  //     this.frontImageBlob = new File([blob], "");
  //   } else {
  //     this.backImageBlob = new File([blob], "");
  //   }
  //   return (await this.convertBlobToBase64(blob)) as string;
  // }

  // convertBlobToBase64 = (blob: Blob) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onerror = reject;
  //     reader.onload = () => {
  //       resolve(reader.result);
  //       if (this.selectedImage == "") {
  //         this.selectedImage = reader.result;
  //       } else {
  //         this.selectedBackImage = reader.result;
  //       }
  //       this.uploadDocuments();
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // END

  async proceedForBothFICItr(selfSpouse: string) {
    console.log('this proceedForBothFICItr', this.selectedRadioOption);
    this.isUploadImageVisible = false;
    this.firstItrApi = false;
    this.secondItrApi = false;
    this.secondItrApiOtp = false;
    this.secondItrApiPassword = false;
    this.selfItrPasswordBlock = false;
    this.spouseItrPasswordBlock = false;
    this.itrStatus = null;

    await this.setProfileDetails();

    if((this.displayedQuestion.qsCode === 'Q_ITR_SPOUSE' || this.displayedQuestion.qsCode === 'Q_SPOUSE_ITR') && selfSpouse == 'OTHER' && this.isEdit == "true") {
      this.recordEditing();
      return;
    }

    if((this.displayedQuestion.qsCode === 'Q_SELF_ITR') && this.isEdit == "true") {
      this.recordEditing();
      return;
    }
    
    if(this.displayedQuestion.qsCode === 'Q_FIC_ITR' || this.displayedQuestion.qsCode === 'Q_ITR' || this.displayedQuestion.qsCode === 'Q_ITR_SPOUSE' 
      || this.displayedQuestion.qsCode === 'Q_SELF_ITR' || this.displayedQuestion.qsCode === 'Q_SPOUSE_ITR') {
        
      for (let i = 0; i < this.allQuestions.length; i++) {
        // console.log(this.displayedQuestion.pkQsid)
        if(this.selectedRadioOption == "Yes") {
          if (this.displayedQuestion.qsOption1NextQuestion == this.allQuestions[i].pkQsid) {
            this.displayedQuestion = this.allQuestions[i];
            localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            break;
          }
        }
        else {
          if (this.displayedQuestion.qsOption2NextQuestion == this.allQuestions[i].pkQsid) {
            this.displayedQuestion = this.allQuestions[i];
            localStorage.setItem("pkQsid", this.displayedQuestion.pkQsid);
            break;
          }
        }
      }

      if (this.selectedRadioOption == "Yes") {
        if(selfSpouse === 'SELF') {
          if(this.isEdit == "true") {
            console.log('this.editRecordList[13]', this.editRecordList[13]);
            if(this.editRecordList[13].qs_ans_status != "Not Answered") {
              this.itrStatus = this.editRecordList[13].qs_ans_status;
              if(this.editRecordList[13].qs_ans_status == 'Verified') {
                //show pdf and verified status
                let file = this.editRecordList[13].qs_doc_document.split(",");
                let fileName = file[0].split("/").pop()
                if(fileName.toLowerCase().endsWith(".pdf")) {
                  this.viewPdfFiles(this.editRecordList[13]);
                }
                else {
                  this.viewPreuploadImages(this.editRecordList[13]);
                }
              }
              else {
                //show error message if rejected
                this.showItrErrorMessage = this.editRecordList[13].mlRemarks;
                this.showReVerifySelfItr = true;
              }
              // console.log(this.editRecordList);
            }
            else {
              this.selfItrPasswordBlock = true;
              this.firstItrApi = true;
            }
          }
          else {
            console.log('here', this.displayedQuestion.qsCode);
            this.selfItrPasswordBlock = true;
            this.firstItrApi = true;
          }
        }
        else if(selfSpouse === 'SPOUSE') {
          if(this.isEdit == "true") {
            if(this.editRecordList[14].qs_ans_status != "Not Answered") {
              this.itrStatus = this.editRecordList[14].qs_ans_status;
              if(this.editRecordList[14].qs_ans_status == 'Verified') {
                //show pdf and verified status
                let file = this.editRecordList[14].qs_doc_document.split(",");
                let fileName = file[0].split("/").pop()
                if(fileName.toLowerCase().endsWith(".pdf")) {
                  this.viewPdfFiles(this.editRecordList[14]);
                }
                else {
                  this.viewPreuploadImages(this.editRecordList[14]);
                }
              }
              else {
                //show error message if rejected
                this.showItrErrorMessage = this.editRecordList[14].mlRemarks;
                this.showReVerifySpouseItr = true;
              }
            }
            else {
              this.spouseItrPasswordBlock = true;
              this.firstItrApi = true;
            }
          }
          else {
            console.log('here', this.displayedQuestion);
            if(this.captchaElem) {
              this.captchaElem.reset();
            }
            this.spouseItrPasswordBlock = true;
            this.firstItrApi = true;
    
            this.itrPortalOtp = null;
            this.itrPortalPassword = null;
            this.itrPortalConfirmPassword = null;
            this.iAgree = null;
          }
        }
        else {
          this.selfItrPasswordBlock = false;
          this.spouseItrPasswordBlock = false;
          this.itrPortalOtp = null;
          this.itrPortalPassword = null;
          this.itrPortalConfirmPassword = null;
          this.iAgree = null;
        }
      }
      else {
        if(this.editRecordList[15].qs_ans_status != "Not Answered") {
          this.viewPreuploadImages(this.editRecordList[15]);
        }
        else {
          this.isUploadImageVisible = true;
        }
      }
    }
    else {
      this.recordEditing();
    }
  }

  async viewPdfFiles(document: any) {
    const progressSpinnerDialog2 = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
    let pdfFile = document.qs_doc_document.split(",");
    const response: any = await this.profileService.downloadFile(pdfFile[0].split("/").pop());
    progressSpinnerDialog2.close();
    if (response != null && !response.error) {
      let file = new Blob([response], {type: 'application/pdf'});
      this.selectedPdf = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file));
    }

  }

  resolved(captchaResponse: string) {
    if (captchaResponse !== null) {
      this.captcha = captchaResponse;
      this.isCaptchaClicked = true;
      // `${captchaResponse.substring(0, 7)}...${captchaResponse.substring(captchaResponse.length - 7)}`;
    } else {
      this.isCaptchaVisible = false;
      this.isCaptchaClicked = false;
      this.captcha = "";
      setTimeout(() => {
        this.isCaptchaVisible = true;
      }, 100);
    }
  }

  proceedForFirstITRApi() {
    console.log(this.iAgree, this.displayedQuestion);
    this.selectedImage = null;
    if(this.iAgree) {
      if (this.isCaptchaClicked) {
        this.displayProgressSpinner();
        this.questionAnswerService.itrVerificationFirstAPI(this.captcha, 
          this.displayedQuestion.qsCode
        )
        .subscribe((resp) => {
          this.progressSpinnerDialog.close();
          if(resp.status === 'SUCCESS') {
            if(resp.furtherApiCallRequired) {
              this.firstItrApi = false;
              this.secondItrApi = true;
  
              if(resp.modeOfAuthentication === 'OTP') {
                this.secondItrApiOtp = true;
                this.secondItrApiPassword = false;
              }
              else {
                this.secondItrApiOtp = false;
                this.secondItrApiPassword = true;
              }
            }
            else {
              this.captchaElem.reset();
              this.iAgree = null;
              this.proceedForBothFICItr(this.displayedQuestion.qsCode.indexOf('SPOUSE') >= 0 ? 'OTHER' : 'SPOUSE');
            }
          }
          else {
            this.showErrorToast(resp.errorMessage);
            this.captchaElem.reset();
          }
          
        }, error => {
          this.progressSpinnerDialog.close();
          this.captchaElem.reset();
          this.showErrorToast(error.error.message||error.error.errorMessage);
        });
      }
      else {
        this.showErrorToast('Please verify Captcha');    
      }
    }
    else {
      this.showErrorToast('Please confirm that you allow us to use ITR for Income Verification');
    }
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

  proceedForSecondITRApi() {
    this.selectedImage = null;
    if(this.secondItrApiOtp) {
      if(this.itrPortalOtp && this.itrPortalOtp.length == 6) {
        this.sendForOtpOrPasswordVerification(this.itrPortalOtp, this.displayedQuestion.qsCode);
      }
      else {
        this.showErrorToast('Please enter valid OTP');    
      }
    }
    else if(this.secondItrApiPassword) {
      if(this.itrPortalPassword && this.itrPortalConfirmPassword 
        && this.itrPortalPassword.length > 0 && this.itrPortalConfirmPassword.length > 0) {
          if(this.itrPortalPassword === this.itrPortalConfirmPassword) {
            this.sendForOtpOrPasswordVerification(this.itrPortalPassword, this.displayedQuestion.qsCode);
          }
          else {
            this.showErrorToast('Password and Confirm Password do not match');    
          }
      }
      else {
        this.showErrorToast('Please enter valid Password for IT Portal');
      }
    }
    else {
      this.showErrorToast('Invalid Authentication Mode');
    }
  }

  sendForOtpOrPasswordVerification(otp_password, qsCode) {
    this.displayProgressSpinner();
    this.questionAnswerService.itrVerificationSecondAPI(otp_password, qsCode)
    .subscribe((resp) => {
      this.progressSpinnerDialog.close();
      if(resp.status === 'SUCCESS') {
        this.successToast(resp.successMsg);
        this.proceedForBothFICItr(qsCode.indexOf('SPOUSE') >= 0 ? 'OTHER' : 'SPOUSE');

        console.log(this.displayedQuestion);
      }
      else {
        this.showErrorToast(resp.errorMessage);
      }
      
    }, error => {
      this.progressSpinnerDialog.close();
      this.showErrorToast(error.error.message||error.error.errorMessage);
    });
  }


  async testSpousePan(){
    this.processToDigiLockerForSpouse();
  }

  // DIGILOCKER API to enter AADHAR NUMBER for spouse Details
  async processToDigiLockerForSpouse() {
    console.log('Spouse Digilocker call processToDigiLockerForSpouse');
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.createDigilockerUrlForSpouse(
      localStorage.getItem("regId"),
      this.platform
    );
    this.progressSpinnerDialog.close();
    if (!response.error) {
      const options: InAppBrowserOptions = {
        zoom: "no",
        hideurlbar: "yes",
        toolbar: "no",
        location: "no",
        hidenavigationbuttons: "no",
        usewkwebview: "yes",
      };
      let target = "";
      const deviceType = this.platform;
      if (deviceType == "ios") {
        target = "_blank";
      } else {
        target = "_self";
      }

      if (
        response.task != null &&
        response.task != "null" &&
        response.task != "" &&
        response.task.startsWith("Error")
      ) {
        alert(this.translocoService.translate("digilocker-error"));
        this.routeToHome();
      } else if (
        response.result.url == null ||
        response.result.url == "null" ||
        response.result.url == ""
      ) {
        alert("Digilocker URL empty - " + response.result.url);
        this.routeToHome();
      } else {
        localStorage.setItem("callSpouseEaadhar", "true");
        const browser = this.iab.create(response.result.url, target, options);
        browser.on("loadstart").subscribe((ev: InAppBrowserEvent) => {
          if (
            ev.url.startsWith("http://localhost/question-answer/spouse?requestId=")
          ) {
            // for android apk
            browser.close();
            let status = ev.url.split("&");
            if (status[1].split("=")[1] == "failure") {
              localStorage.setItem("callSpouseDigi", "false");// callDigi to callSpouseDigi
              localStorage.setItem("lastRoute", "/");
              this.router.navigate(["/landing"], { replaceUrl: true });
              window.location.reload();
            } else {
              let requestId = status[0].split("=");
              localStorage.setItem("spouseDigiRequestId", requestId[1]);
              localStorage.setItem("lastRoute", "/question-answer");
              localStorage.setItem("callSpouseDigi", "true");
              localStorage.setItem("callSpouseEaadhar", "true");
              this.router.navigate(["/question-answer"], { replaceUrl: true });
              window.location.reload();
            }
          } else if (
            ev.url.startsWith(
              "https://cidcohousing.probitysoftware.in/question-answer/spouse?requestId="
            ) ||
            ev.url.startsWith(
              "https://uatilms.mhada.gov.in/question-answer/spouse?requestId="
            ) ||
            ev.url.startsWith(
              "http://localhost:8100/question-answer/spouse?requestId="
            ) ||
            ev.url.startsWith(
              "https://housing.pmrda.gov.in/question-answer/spouse?requestId="
            ) ||
            ev.url.startsWith(
              "https://sqtchousing.mhada.gov.in/question-answer/spouse?requestId="
            )
          ) {
            // for browser
            browser.close();
            let status = ev.url.split("&");
            if (status[1].split("=")[1] == "failure") {
              localStorage.setItem("callSpouseDigi", "false");
              localStorage.setItem("lastRoute", "/");
              this.router.navigate(["/landing"], { replaceUrl: true });
              window.location.reload();
            } else {
              let requestId = status[0].split("=");
              localStorage.setItem("spouseDigiRequestId", requestId[1]);
              localStorage.setItem("lastRoute", "/question-answer");
              localStorage.setItem("callSpouseDigi", "true");
              localStorage.setItem("callSpouseEaadhar", "true");
              this.router.navigate(["/question-answer"], { replaceUrl: true });
              window.location.reload();
            }
          }
        });
        browser.on("exit").subscribe((ev: InAppBrowserEvent) => {
          if (
            ev.url == undefined &&
            localStorage.getItem("spouseDigiRequestId") == null
          ) {
            localStorage.setItem("lastRoute", "/");
            this.router.navigate(["/landing"], { replaceUrl: true });
            window.location.reload();
          }
        });
      }

    } else {
      // TODO
      // alert(this.translocoService.translate("digilocker-service-error"));
      // localStorage.clear();
      // this.sharedService.setAuthentication(false);
      // this.router.navigate(["/landing"]);
      window.location.reload();
    }
  }

  // For Souser Aadhar and Pan
  async getSpouseEaadharFromDigi() {
    console.log('Spouse Digilocker call getSpouseEaadharFromDigi fn');
    this.displayProgressSpinner();
    let fileObj = { requestID: localStorage.getItem("spouseDigiRequestId") };
    const response: any = await this.questionAnswerService.getSpouseEaadharFromDigi(
      JSON.stringify(fileObj)
    );
    this.progressSpinnerDialog.close();
    localStorage.removeItem("callSpouseEaadhar");
    localStorage.setItem("spouseAadharResponseFromDigi", JSON.stringify(response));
    console.log(response);
    // localStorage.removeItem("callDigi");
    if (response != null && !response.error) {
      if (response.status == "Exists") {
        this.userExists();
      } else if (response.status == "Failure") {

        this.frontendWarningToast(response.message);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 3000);

        // if(confirm(response.message)){
          // this.processToDigiLockerForSpouse();
          setTimeout(() => {
            this.ngOnInit();
          }, 10000);
        // }

      } else if (response.status.startsWith("Error :")) {
        if (response.status.toLowerCase().includes("null")) {
          this.frontendWarningToast(
            "It seems you are using someone else's DigiLocker account, please Retry with appropriate DigiLocker account!"
          );
          setTimeout(() => {
            // this.routeToHome();
            this.ngOnInit();
            localStorage.removeItem("callSpouseDigi");
          }, 5000);
        } else {
          this.frontendWarningToast(response.status.substring(7));
          setTimeout(() => {
            // this.routeToHome();
            this.ngOnInit();
            localStorage.removeItem("callSpouseDigi");
          }, 5000);
        }
      } else {
        localStorage.setItem("isSpouseDigiComplete", "true");
        this.ngOnInit();
      }
    } else {
      this.showErrorToastPlain(response, 5000);
      setTimeout(() => {
        this.ngOnInit();
      }, 5000);
    }
  }


  openDF(){
    this.isExServiceman = false;

    // console.log(this.displayedQuestion?.qsQuestion)

    // this.displayedQuestion = {
    //       qsQuestion: {
    //           en: 'Defence Family',
    //       }
    //   };

    this.displayedQuestion["qsQuestion"]["en"] = "Are you from a Defence family?";
    this.displayedQuestion["qsQuestion"]["mr"] = "तुम्ही डिफेन्स कुटुंबातील आहात का?";
    this.selectedRadioOption = this.displayedQuestion["qs_ans"] != 'Not Answered' ? this.displayedQuestion["qs_ans"] : '';
    if(this.displayedQuestion["qs_ans"] == 'Defence Family') {
      if (this.displayedQuestion.qs_doc_document != null) {
        this.showDefenceFamilyFile = true;
        this.viewPreuploadImages(this.displayedQuestion);
      }
    }
  }

  async proceedToDigiLocker() {

    console.log(this.displayedQuestion);
    if(+this.displayedQuestion?.pkQsid === 2) {
      this.processToDigiLocker();
    } else if(+this.displayedQuestion?.pkQsid === 10) {
      this.processToDigiLockerForSpouse();
    } else {
      alert("Something went wrong . Please try again");
    }
  }

  async showErrorToastPlain(errorMsg,duration){
    const toast = await this.toastController.create({
      message: errorMsg,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: duration,
    });
      toast.present();
  }
}
