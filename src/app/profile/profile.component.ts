/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog,MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ActionSheetController, ToastController } from "@ionic/angular";
import { LoaderComponent } from "../loader/loader.component";
import { ProfileService } from "./profile.service";
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { profile } from "./profile";
import { ViewDocumentComponent } from "./view-document/view-document.component";
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { HttpClient } from "@angular/common/http";
import { SharedService } from "../toolbar/shared.service";
import { NetworkInterface } from "@awesome-cordova-plugins/network-interface/ngx";
import { ExternalApisService } from "../external-apis/external-apis.service";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { ViewESignedDocumentComponent } from "./view-e-signed-document/view-e-signed-document.component";
import { DocumentManuallyRejectedComponent } from "./document-manually-rejected/document-manually-rejected.component";
import { QuestionAnswerService } from "../question-answer/question-answer.service";
import { api_url } from "../pre-lottery/services/pre-lottery-application.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  @ViewChild('popupQuesTemplate') popupQuesTemplate: TemplateRef<any>;
  @ViewChild('popupQuesTemplateITR') popupQuesTemplateITR: TemplateRef<any>;
  @ViewChild('popupQuesTemplateITR_SPOUSE') popupQuesTemplateITR_SPOUSE: TemplateRef<any>;
  @ViewChild('popupQuesTemplateFamilyIncome') popupQuesTemplateFamilyIncome: TemplateRef<any>;
  @ViewChild("addform") addform: NgForm;
  contactsForm: FormGroup;

  panNo = "";
  aadharNo = "";
  name = "";
  otherNames: any = "";
  address = "";
  currentAddress = "";
  aliasName = "";
  mobileNo = "";
  nomineeName ="";
  nomineeNameExists ="";
  nomineeOfAppName ="";
  photo: any = null;
  progressSpinnerDialog: any = null;
  documents: any[] = [];
  refresherEvent: any = null;
  verifiedStatus: any[] = [];
  isEsignDisabled = true;
  applyNowBtnDisabled = true;
  regId = localStorage.getItem("regId");
  obj: any = null;
  dob: any = "";
  activeLang: string = "";
  viewEnMr: string = "View";
  cancelEnMr: string = "Cancel";
  editEnMr: string = "Edit";
  ipAddress: any = null;
  pdfSrc: any = "";
  documentName: string = "";
  downloadEsignDisabled: boolean = true;
  areQuestionsNotAnswered: boolean = false;
  isAllowedForinfo: boolean = false;
  manualRejectedQuestions: any[] = [];
  profileDetails: any[] = [];
  constructor(
    public actionSheetController: ActionSheetController,
    private dialog: MatDialog,
    private router: Router,
    private _fb: FormBuilder,
    public toastController: ToastController,
    private profileService: ProfileService,
    private iab: InAppBrowser,
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    private sharedService: SharedService,
    private networkInterface: NetworkInterface,
    private externalApisService: ExternalApisService,
    private questionAnswerService: QuestionAnswerService,
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<any>
  ) {
    this.contactsForm = this._fb.group({
      Parameter1: "",
      Parameter2: "",
      Parameter3: "",
    });

    // this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
    //   // console.log(res.ip);
    //   this.ipAddress = res.ip;
    // });

    this.networkInterface
      .getWiFiIPAddress()
      .then((address) => {
        console.log(`WIFI IP: ${address.ip}`), (this.ipAddress = address.ip);
      }) //, Subnet: ${address.subnet}
      .catch((error) => {
        console.log(`Unable to get WIFI IP: ${error}`),
          this.networkInterface
            .getCarrierIPAddress()
            .then((address) => {
              console.log(`Carrier IP: ${address.ip}`), (this.ipAddress = address.ip);
            }) // , Subnet: ${address.subnet}
            .catch((error) => console.log(`Unable to get IP: ${error}`));
      });
  }

  async ngOnInit() {
    this.platform = localStorage.getItem("platform");
    // localStorage.removeItem("userAlreadyRegistered");
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
      if (this.activeLang == "en") {
        this.viewEnMr = "View";
        this.editEnMr = "Edit";
        this.cancelEnMr = "Cancel";
      } else {
        this.viewEnMr = "पहा";
        this.editEnMr = "संपादन करा";
        this.cancelEnMr = "रद्द करा";
      }
    });
    // localStorage.removeItem("callDigi");
    localStorage.removeItem("isEdit");

    localStorage.setItem("lastRoute", this.router.url);
    localStorage.removeItem("pkQsid");
    // if (localStorage.getItem("eSign") == "true") {
    //   const response = await this.getSignedPdf();
    //   if (response == true) {
    //     this.getDocuments();
    //   } else {
    //     this.getDocuments();
    //   }
    // } else {
    //   setTimeout(() => {
    //     this.getDocuments();
    //   }, 1000);
    // }
    // this.checkDigiDetails();
  }

  async checkDigiDetails() {
    this.displayProgressSpinner();
    const response: any = await this.questionAnswerService.checkDigiDetails();
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        this.getDocuments("");
      } else {
        this.router.navigate(["/question-answer"], { replaceUrl: true });
      }
    } else {
      this.errorToast(response);
    }
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  // async refreshPage(event: any) {
  //   this.refresherEvent = event;
  //   this.getDocuments();
  // }
  async refreshPage() {
    // this.getDocuments();
    window.location.reload();
  }

  async generateAffidavit() {
    // this.router.navigate(['/eSignSelfDeclaration']);
    const response: any = await this.profileService.generateMudhraRequestV1(this.regId, this.ipAddress);
    this.contactsForm = this._fb.group({
      Parameter1: [response.parameter1],
      Parameter2: [response.parameter2],
      Parameter3: [response.parameter3],
    });
  }

  async eMsecure(evt: Event) {
    this.displayProgressSpinner();
    evt.preventDefault();
    evt.stopPropagation();
    const data = await this.generateAffidavit();
    // console.log(this.contactsForm);
    // localStorage.setItem("Parameter1", this.contactsForm.value.Parameter1);
    // localStorage.setItem("Parameter2", this.contactsForm.value.Parameter2);
    // localStorage.setItem("Parameter3", this.contactsForm.value.Parameter3);
    // const response: any = await this.profileService.eMsecure(
    //   this.contactsForm.value.Parameter1,
    //   this.contactsForm.value.Parameter2,
    //   this.contactsForm.value.Parameter3
    // );
    // console.log(response);
    setTimeout(() => {
      (evt.target as HTMLFormElement).submit();
      // const browserOptions: InAppBrowserOptions = {
      //   zoom: "no",
      //   hideurlbar: "no",
      //   toolbar: "yes",
      //   location: "yes",
      // };
      // // var options = {
      // //   Parameter1: this.contactsForm.value.Parameter1,
      // //   Parameter2: this.contactsForm.value.Parameter2,
      // //   Parameter3: this.contactsForm.value.Parameter3,
      // //   formAction2: "EsignWithASP",
      // // };
      // // var form = document.createElement("form");
      // // var url = "https://demosignergateway.emsigner.com/eMsecure/V3_0/Index";
      // // form.setAttribute("method", "post");
      // // form.setAttribute("action", url);
      // // for (var data in options) {
      // //   var hiddenField = document.createElement("input");
      // //   hiddenField.setAttribute("type", "hidden");
      // //   hiddenField.setAttribute("name", data);
      // //   hiddenField.setAttribute("value", options[data]);
      // //   form.appendChild(hiddenField);
      // // }
      // // document.body.appendChild(form);
      // // console.log(url);
      // // console.log(form);
      // var ref = this.iab.create("/eMudra", "_self", browserOptions);
      // // // if (ref) {
      // // // form.submit();
      // // // }
    }, 0);
  }

  async processMudhraResponse() {
    const response: any = await this.profileService.generateMudhraRequest(this.regId);
  }

  async getDocuments(type: string) {
    this.manualRejectedQuestions = [];
    this.documents = [];
    this.verifiedStatus = [];
    this.displayProgressSpinner();
    const response: any = await this.profileService.getProfileDetails(this.regId);
    // const response: any = await profile;
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (this.refresherEvent != null) {
        this.refresherEvent.target.complete();
      }
      this.profileDetails = response.pop();
      if (this.profileDetails[0]["isProfileActive"] == "N") {
        localStorage.clear();
        this.sharedService.setAuthentication(false);
        this.router.navigate(["/"]);
        window.location.reload();
      }

      // back end api call to get the nominee name to pre lottery
      this.nomineeOfAppName = await this.getNomineeNameOfApplicant();

      this.mobileNo = this.profileDetails[0]["mobileNo"];
      this.address = this.profileDetails[0]["address"];
      this.currentAddress = this.profileDetails[0]["currentAddress"];
      this.aliasName = this.profileDetails[0]["alisName"];
      this.photo = this.domSanitizer.bypassSecurityTrustResourceUrl(
        "data:image/jpg;base64," + this.profileDetails[0]["photo"]
      );
      this.panNo = this.profileDetails[0]["panNo"];
      this.name = this.profileDetails[0]["name"];
      this.dob = this.profileDetails[0]["dob"];
      if ("otherNames" in this.profileDetails[0]) {
        if (this.profileDetails[0]["otherNames"] != "") {
          this.otherNames = this.profileDetails[0]["otherNames"];
        }
      }
      if (response.length > 0) {
        localStorage.setItem("editRecords", JSON.stringify(response));
        let employeeFlag = false;
        // response.sort((a, b) => a.pkQsid - b.pkQsid);
        // console.log(response);
        for (let i = 0; i < response.length; i++) {
          // if (
          //   response[i]["qsCode"] == "Q_FREEDOM" &&
          //   (response[i]["qs_ans_status"] == "Uploaded" ||
          //     response[i]["qs_ans_status"] == "Not-Verified" ||
          //     response[i]["qs_ans_status"] == "Verified" ||
          //     response[i]["qs_ans_status"] == "Answered")
          // ) {
          //   response[i + 1]["qs_ans_status"] = "Not Applicable";
          // } else if (
          //   response[i]["qsCode"] == "Q_FREEDOM" &&
          //   (response[i + 1]["qs_ans_status"] == "Uploaded" ||
          //     response[i + 1]["qs_ans_status"] == "Not-Verified" ||
          //     response[i + 1]["qs_ans_status"] == "Verified")
          // ) {
          //   response[i]["qs_ans_status"] = "Not Applicable";
          // }

          if (response[i]["qsCode"] == "Q_PAN" && response[i]["qs_ans_status"] == "Rejected-Duplicate") {
            response[i]["qs_ans_status"] = "MHADA Winner with Possession";
          } else if (
            response[i]["qsCode"] == "Q_PAN" &&
            response[i]["qs_ans_status"].toLowerCase().includes("surrender")
          ) {
            response[i]["qs_ans_status"] = "Existing Winner but ready to Surrender";
          }

          if (response[i]["qsCode"] == "Q_CASTE" && response[i]["qs_ans"] == "OPEN") {
            response[i + 1]["qs_ans_status"] = "Not Applicable";
          }

          if (response[i]["qsCode"] == "Q_DOMICILE" && response[i]["qs_ans_status"] == "Not-Verified") {
            response[i]["qs_ans_status"] = "Verification in Progress";
          }

          if (response[i]["qsCode"] == "Q_ITR" && (response[i]["qs_ans_status"] == "Not-Verified" || response[i]["qs_ans_status"] === 'API-Authorization-Pending')) {
            response[i]["qs_ans_status"] = "Verification in Progress";
          } else if (response[i]["qsCode"] == "Q_ITR_SPOUSE" && (response[i]["qs_ans_status"] == "Not-Verified" || response[i]["qs_ans_status"] === 'API-Authorization-Pending')) {
            response[i]["qs_ans_status"] = "Verification in Progress";
          }

          // if (response[i]["qsCode"] == "Q_MARITAL" && response[i]["qs_ans"] != "Married") {
          //   response[7]["qs_ans_status"] = "Not Applicable";
          //   response[8]["qs_ans_status"] = "Not Applicable";
          //   response[11]["qs_ans_status"] = "Not Applicable";
          //   response[12]["qs_ans_status"] = "Not Applicable";
          // } else if (response[i]["qsCode"] == "Q_MARITAL" && response[i]["qs_ans"] == "Married") {
          //   if (response[9]["qsCode"] == "Q_WORK_STATUS" && response[9]["qs_ans_status"] != "Not Answered") {
          //     if (response[9]["qs_ans"] == "Both") {
          //     } else if (response[9]["qs_ans"] == "Self") {
          //       response[11]["qs_ans_status"] = "Not Applicable";
          //       response[12]["qs_ans_status"] = "Not Applicable";
          //     } else if (response[9]["qs_ans"] == "Spouse") {
          //       response[12]["qs_ans_status"] = "Not Applicable";
          //       response[10]["qs_ans_status"] = "Not Applicable";
          //     } else if (response[9]["qs_ans"] == "None") {
          //       response[11]["qs_ans_status"] = "Not Applicable";
          //       response[12]["qs_ans_status"] = "Not Applicable";
          //       response[10]["qs_ans_status"] = "Not Applicable";
          //     }
          //   }
          // }
          if (response[i]["qsCode"] == "Q_MARITAL" && response[i]["qs_ans"] != "Married") {
            // i = 6
            if (response[i + 3]["qsCode"] == "Q_WORK_STATUS" && response[i + 3]["qs_ans"] == "None") {
              response[i + 1]["qs_ans_status"] = "Not Applicable"; // i = 7
              response[i + 2]["qs_ans_status"] = "Not Applicable"; // i = 8
              // response[i + 4]["qs_ans_status"] = "Not Applicable"; // i = 8
              response[i + 5]["qs_ans_status"] = "Not Applicable"; // i = 11
              response[i + 6]["qs_ans_status"] = "Not Applicable"; // i = 12
            } else {
              response[i + 1]["qs_ans_status"] = "Not Applicable"; // i = 7
              response[i + 2]["qs_ans_status"] = "Not Applicable"; // i = 8
              response[i + 5]["qs_ans_status"] = "Not Applicable"; // i = 11
              response[i + 6]["qs_ans_status"] = "Not Applicable"; // i = 12
            }
            // response[i + 1]["qs_ans_status"] = "Not Applicable"; // i = 7
            // response[i + 2]["qs_ans_status"] = "Not Applicable"; // i = 8
            // response[i + 5]["qs_ans_status"] = "Not Applicable"; // i = 11
            // response[i + 6]["qs_ans_status"] = "Not Applicable"; // i = 12
          } else if (response[i]["qsCode"] == "Q_MARITAL" && response[i]["qs_ans"] == "Married") {
            // i= 6
            if (response[i + 3]["qsCode"] == "Q_WORK_STATUS" && response[i + 3]["qs_ans_status"] != "Not Answered") {
              // i = 9
              if (response[i + 3]["qs_ans"] == "Both") {
                if (
                  response[i + 4]["qs_ans_status"].toLowerCase().includes("verified") ||
                  response[i + 4]["qs_ans_status"].toLowerCase().includes("rejected") ||
                  response[i + 5]["qs_ans_status"].toLowerCase().includes("verified") ||
                  response[i + 5]["qs_ans_status"].toLowerCase().includes("rejected")

                  // response[i + 4]["qs_ans_status"] == "Verified" ||
                  // response[i + 4]["qs_ans_status"] == "Rejected" ||
                  // response[i + 4]["qs_ans_status"] == "Not-Verified" ||
                  // response[i + 5]["qs_ans_status"] == "Verified" ||
                  // response[i + 5]["qs_ans_status"] == "Rejected" ||
                  // response[i + 5]["qs_ans_status"] == "Not-Verified"
                ) {
                  response[i + 6]["qs_ans_status"] = "Not Applicable";
                } else if (
                  // response[i + 6]["qs_ans_status"] == "Verified" ||
                  // response[i + 6]["qs_ans_status"] == "Rejected" ||
                  // response[i + 6]["qs_ans_status"] == "Not-Verified"
                  response[i + 6]["qs_ans_status"].toLowerCase().includes("verified") ||
                  response[i + 6]["qs_ans_status"].toLowerCase().includes("rejected")
                ) {
                  response[i + 4]["qs_ans_status"] = "Not Applicable";
                  response[i + 5]["qs_ans_status"] = "Not Applicable";
                }
              } else if (response[i + 3]["qs_ans"] == "Self") {
                // i = 9
                response[i + 5]["qs_ans_status"] = "Not Applicable"; // i= 11
                response[i + 6]["qs_ans_status"] = "Not Applicable"; // i = 12
              } else if (response[i + 3]["qs_ans"] == "Spouse") {
                // i = 9
                response[i + 6]["qs_ans_status"] = "Not Applicable";
                response[i + 4]["qs_ans_status"] = "Not Applicable";
              } else if (response[i + 3]["qs_ans"] == "None") {
                response[i + 5]["qs_ans_status"] = "Not Applicable";
                response[i + 6]["qs_ans_status"] = "Not Applicable";
                // response[i + 4]["qs_ans_status"] = "Not Applicable"; // i = 10
              }
            }
          }

          // if (response[19]["qsCode"] == "Q_CENTRAL" && response[19]["qs_ans_status"] == "Uploaded") {
          //   response[20]["qs_ans_status"] = "Not Applicable";
          //   response[21]["qs_ans_status"] = "Not Applicable";
          // } else if (response[20]["qsCode"] == "Q_STATE" && response[20]["qs_ans_status"] == "Uploaded") {
          //   response[20]["qs_ans_status"] = "Not Applicable";
          //   response[21]["qs_ans_status"] = "Not Applicable";
          // } else if (
          //   response[21]["qsCode"] == "Q_MHADA" &&
          //   (response[21]["qs_ans_status"] == "Verified" || response[21]["qs_ans_status"] == "Rejected")
          // ) {
          //   response[19]["qs_ans_status"] = "Not Applicable";
          //   response[20]["qs_ans_status"] = "Not Applicable";
          // }

          if (employeeFlag == false) {
            if (response[i + 2] != undefined) {
              if (
                response[i]["qsCode"] == "Q_CENTRAL" &&
                (response[i]["qs_ans_status"] == "Uploaded" ||
                  response[i]["qs_ans_status"] == "Not-Verified" ||
                  response[i]["qs_ans_status"] == "Verified" ||
                  response[i]["qs_ans_status"].toLowerCase().includes("rejected"))
              ) {
                response[i + 1]["qs_ans_status"] = "Not Applicable";
                response[i + 2]["qs_ans_status"] = "Not Applicable";
                response[6]["qs_ans_status"] = "Not Applicable";
                employeeFlag = true;
              } else if (
                response[i + 1]["qsCode"] == "Q_STATE" &&
                (response[i + 1]["qs_ans_status"] == "Uploaded" ||
                  response[i + 1]["qs_ans_status"] == "Not-Verified" ||
                  response[i + 1]["qs_ans_status"] == "Verified" ||
                  response[i + 1]["qs_ans_status"].toLowerCase().includes("rejected"))
              ) {
                response[i]["qs_ans_status"] = "Not Applicable";
                response[i + 2]["qs_ans_status"] = "Not Applicable";
                employeeFlag = true;

              } else if (
                response[i + 2]["qsCode"] == "Q_MHADA" &&
                (response[i + 2]["qs_ans_status"] == "Verified" || response[i + 2]["qs_ans_status"] == "Rejected")
              ) {
                response[i]["qs_ans_status"] = "Not Applicable";
                response[i + 1]["qs_ans_status"] = "Not Applicable";
                employeeFlag = true;
              } 
              // else if (
              //   response[i + 3]["qsCode"] == "Q_GAZETTED_OFFICERS" &&
              //   (response[i + 3]["qs_ans_status"] == "Uploaded" ||
              //     response[i + 3]["qs_ans_status"] == "Not-Verified" ||
              //     response[i + 3]["qs_ans_status"] == "Verified" ||
              //     response[i + 3]["qs_ans_status"].toLowerCase().includes("rejected"))
              // ) {
              //   response[i + 2]["qs_ans_status"] = "Not Applicable";
              //   response[i + 3]["qs_ans_status"] = "Not Applicable";
              //   response[7]["qs_ans_status"] = "Not Applicable";
              //   employeeFlag = true;
              // }
            }
          }

          if (
            (response[i]["qs_ans"] == "No" && response[i]["qs_ans_status"] == "Answered") ||
            // (response[i]["qs_ans"] == "None" && response[i]["qs_ans_status"] == "Answered") ||
            (response[i]["qs_ans"] == "None of the above" && response[i]["qs_ans_status"] == "Answered")
          ) {
            if (response[i]["qsCode"] == "Q_CAST_VALID") {
              response[i]["qs_ans_status"] = "Allowed with Condition";
            } else {
              response[i]["qs_ans_status"] = "Not Applicable";
              response[i]["qs_ans"] = "";
            }
          } else if (response[i]["qs_ans_status"] == "Not-Verified") {
            // response[i]["qs_ans_status"] = "Pending for Moderator Check";
            response[i]["qs_ans_status"] = "Verification in Progress";
            // response[i]["qs_ans"] = "";
          }
          // if (response[i]["qs_ans_status"] == "Verified" || response[i]["qs_ans_status"] == "N A") {
          //   this.verifiedStatus.push(response);
          // }
          if (response[i]["qs_ans"] != null) {
            if (response[i]["qs_ans"].includes("###")) {
              if (response[i]["qsCode"] == "Q_ADDRESS") {
                let splitData = response[i]["qs_ans"].split("###");
                response[i]["qs_ans"] = splitData[0];
                if (splitData[1] == "51") {
                  this.documentName = "No / Electricity Bill - MSEB";
                } else if (splitData[1] == "52") {
                  this.documentName = "No / Electricity Bill - BEST";
                } else if (splitData[1] == "53") {
                  this.documentName = "No / Electricity Bill - TORRENT";
                } else if (splitData[1] == "53") {
                  this.documentName = "No / Electricity Bill - TORRENT";
                } else if (splitData[1] == "54") {
                  this.documentName = "No / Electricity Bill - ADANI";
                } else if (splitData[1] == "55") {
                  this.documentName = "No / Driving License";
                } else if (splitData[1] == "56") {
                  this.documentName = "No / Gas Bill";
                } else if (splitData[1] == "57") {
                  this.documentName = "No / Rent Agreement (Index-2)";
                } else if (splitData[1] == "1") {
                  this.documentName = "Yes / Same as Aadhar";
                } else {
                  this.documentName = splitData[1];
                }
              } else {
                response[i]["qs_ans"] = response[i]["qs_ans"].split("###")[0];
              }
            }
          }

          if (response[i]["qsCode"] != "Q_CONSENT") {
            this.documents.push(response[i]);
          }
        }

        for (let i = 0; i < this.documents.length; i++) {

          console.log('this.documents[i] ---> ',this.documents[i]);

          // if (this.documents[i]["qs_ans_status"] == "Rejected-Manual") {
          if (this.documents[i]["qs_ans_status"] != null) {
            if (this.documents[i]["qs_ans_status"].toLowerCase().includes("rejected") == true) {
              this.manualRejectedQuestions.push(this.documents[i]);
              this.applyNowBtnDisabled = true;
              this.downloadEsignDisabled = true;
              this.isEsignDisabled = true;
              this.areQuestionsNotAnswered = true;
            } else if (
              this.documents[i]["qs_ans_status"].startsWith("Rejected") ||
              this.documents[i]["qs_ans_status"] == "Not Answered" ||
              this.documents[i]["qs_ans_status"] == "Pending for Moderator Check" ||
              this.documents[i]["qs_ans_status"] == "Verification in Progress" ||
              this.documents[i]["qs_ans_status"] == "MHADA Winner with Possession"
            ) {
              this.applyNowBtnDisabled = true;
              this.downloadEsignDisabled = true;
              this.isEsignDisabled = true;
              this.areQuestionsNotAnswered = true;
            }
          } else {
            this.applyNowBtnDisabled = true;
            this.downloadEsignDisabled = true;
            this.isEsignDisabled = true;
            this.areQuestionsNotAnswered = true;
          }
        }

        if (this.manualRejectedQuestions.length > 0) {
          this.casteValidityRejected(this.manualRejectedQuestions, "rejected");
        }
        if (type == "esign") {
          for (let i = 0; i < this.documents.length; i++) {
            if (this.documents[i]["qs_ans_status"] != null) {
              if (this.documents[i]["qs_ans_status"].toLowerCase().includes("verification in progress")) {
                this.manualRejectedQuestions.push(this.documents[i]);
              }
            }
          }
          if (this.manualRejectedQuestions.length > 0) {
            this.casteValidityRejected(this.manualRejectedQuestions, "esign");
          }
        }
        setTimeout(() => {
          if (this.profileDetails[0]["affidavitStatus"] == "" && this.areQuestionsNotAnswered == false) {
            this.applyNowBtnDisabled = true;
            this.downloadEsignDisabled = true;
            this.isEsignDisabled = false;
            localStorage.removeItem("eSign");
          } else if (
            this.profileDetails[0]["affidavitStatus"].toLowerCase() == "pending" &&
            this.areQuestionsNotAnswered == false
          ) {
            // localStorage.setItem("eSign", "true");
            if (localStorage.getItem("eSign") == "true") {
              this.getSignedPdf();
            } else {
              localStorage.removeItem("eSign");
              this.applyNowBtnDisabled = true;
              this.downloadEsignDisabled = true;
              this.isEsignDisabled = false;
            }
          } else if (
            this.profileDetails[0]["affidavitStatus"].toLowerCase() == "verified" &&
            this.areQuestionsNotAnswered == false
          ) {
            this.applyNowBtnDisabled = false;
            this.downloadEsignDisabled = false;
            this.isEsignDisabled = true;
          }
        }, 1000);
      } else {
        this.warningToast(response.error);
      }
    } else {
      this.errorToast(response);
    }
  }

  async getNomineeNameOfApplicant (): Promise<any> {
    try {
      const url = `${api_url}/nominee-dtls/getNomineeDtlsAppTrnsfrdTo?regId=${encodeURIComponent(this.regId)}`;
      const res = await this.httpClient.get(url, { responseType: 'text' }).toPromise();
      return res;

    } catch (error) {
      console.error('Error fetching nominee details:', error);
      throw error;
    }
  }

  async presentActionSheet(document: any) {
    console.log('document', document);
    console.log('documents', this.documents);
    let canCasteValidityBeEdited = false;
    let canCasteCertBeEdited = true;
    if (document.qsCode == "Q_CAST_VALID") {
      if (
        this.documents[15]["qsCode"] == "Q_CASTE" &&
        this.documents[15]["qs_ans"] != "OPEN" &&
        this.documents[15]["qs_ans_status"] != "Not Answered"
      ) {
        if(
          this.documents[16]["qsCode"] == "Q_CAST_VALID" &&
          this.documents[16]["qs_ans_status"] == "Verified"
        ) {
          canCasteCertBeEdited = false;
        }
        else {
          canCasteValidityBeEdited = true;
        }
      }
    }

    if(document.qsCode == "Q_CASTE") {
      if(
        this.documents[16]["qsCode"] == "Q_CAST_VALID" &&
        this.documents[16]["qs_ans_status"] == "Verified"
      ) {
        canCasteCertBeEdited = false;
      }
    }

    let actionSheetOptions: any[] = [];
    if (
      document.pkQsid == "4" ||
      document.pkQsid == "5" ||
      document.pkQsid == "6" ||
      document.pkQsid == "9" ||
      document.pkQsid == "12" ||
      (document.pkQsid == "14" && canCasteCertBeEdited) ||
      document.pkQsid == "17" ||
      document.pkQsid == "18" ||
      document.pkQsid == "19" ||
      document.pkQsid == "20" ||
      document.pkQsid == "21" ||
      document.pkQsid == "22" ||
      document.pkQsid == "23" ||
      document.pkQsid == "25" ||
      document.pkQsid == "26" ||
      document.pkQsid == "31" ||
      document.pkQsid == "32" ||
      canCasteValidityBeEdited ||
      (document.qs_ans_status != "Not Applicable" &&
        (document.pkQsid == "10" ||
          document.pkQsid == "11" ||
          document.pkQsid == "28" ||
          document.pkQsid == "29" ||
          document.pkQsid == "30"))
    ) {
      actionSheetOptions = [
        {
          cssClass: "first-button",
          text: this.viewEnMr,
          icon: "eye",
          data: 10,
          handler: () => {
            this.viewDocument(document);
          },
        },
        {
          text: this.editEnMr,
          icon: "create",
          data: "Data value",
          handler: () => {
            this.editRecord(document);
          },
        },
        {
          cssClass: "last-button",
          text: this.cancelEnMr,
          icon: "close",
          role: "cancel",
          handler: () => {
            // console.log('Cancel clicked');
          },
        },
      ];
    } else {
      actionSheetOptions = [
        {
          cssClass: "first-button",
          text: this.viewEnMr,
          icon: "eye",
          data: 10,
          handler: () => {
            this.viewDocument(document);
          },
        },
        // {
        //   text: this.editEnMr,
        //   icon: "create",
        //   data: "Data value",
        //   handler: () => {
        //     this.editRecord(document);
        //   },
        // },
        {
          cssClass: "last-button",
          text: this.cancelEnMr,
          icon: "close",
          role: "cancel",
          handler: () => {
            // console.log('Cancel clicked');
          },
        },
      ];
    }
    let status = document.qs_ans_status != null ? document.qs_ans_status : "-";
    const actionSheet = await this.actionSheetController.create({
      header: document.qsProfileDescription[this.activeLang] + " - ( " + status + " )",
      cssClass: "my-custom-class",
      buttons: actionSheetOptions,
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    // console.log('onDidDismiss resolved with role and data', role, data);
  }

  async viewDocument(document) {
    console.log("kai ahe document",document);
    
    if (document.qs_doc_document != "" && document.qs_doc_document != null && document.qs_doc_document != "-") {
      this.displayProgressSpinner();
      let imageBackUrl = null;
      let image = document.qs_doc_document.split(",");
      if (image[1] != undefined) {
        const response: any = await this.profileService.downloadFile(image[1].split("/").pop());// image[1].split("/").pop()
        this.progressSpinnerDialog.close();
        if (response != null && !response.error) {
          let file = new Blob([response], { type: "image/*" });
          var fileURL = URL.createObjectURL(file);
          imageBackUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(fileURL);
        } else {
          this.errorToast(response);
        }
      }

      let fileName = image[0].split("/").pop();
      const response: any = await this.profileService.downloadFile(image[0].split("/").pop());
      this.progressSpinnerDialog.close();
      if (response != null && !response.error) {
        if(fileName.toLowerCase().endsWith(".pdf")) {
          let file = new Blob([response], {type: 'application/pdf'});
          setTimeout(() => {
            let selectedPdf = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file));
            this.progressSpinnerDialog = this.dialog.open(ViewDocumentComponent, {
              disableClose: true,
              width: "600px",
              data: [document.qsProfileDescription, document.qs_ans_status, null, null, selectedPdf],
            });
          }, 100);
        }
        else {
          let file = new Blob([response], { type: "image/*" });
          var fileURL = URL.createObjectURL(file);
          setTimeout(() => {
            let imageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.progressSpinnerDialog = this.dialog.open(ViewDocumentComponent, {
              disableClose: true,
              width: "600px",
              data: [document.qsProfileDescription, document.qs_ans_status, imageUrl, imageBackUrl],
            });
          }, 100);
        }
      } else {
        this.errorToast(response);
      }
      
    } else {
      this.warningToast("No document available.");
    }
  }

  openPopup(code: any): void {
    console.log("code >> ", code);
    if(code == "Q_STATE"){
      this.dialog.open(this.popupQuesTemplate);
    }else if(code == "Q_ITR_SPOUSE"){
      this.dialog.open(this.popupQuesTemplateITR_SPOUSE);
    }else if(code == "Q_ITR"){
      this.dialog.open(this.popupQuesTemplateITR);
    }else if(code == "Q_INCOME_CERT"){
      this.dialog.open(this.popupQuesTemplateFamilyIncome);
    }
  }

  // openPopupITR(): void {
  //   this.dialog.open(this.popupQuesTemplateITR);
  // }

  // openPopupITR_SPOUSE(): void {
  //   this.dialog.open(this.popupQuesTemplateITR_SPOUSE);
  // }

  async warningToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 5000,
    });
    toast.present();
  }

  async successToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }

  platform: string = "";
  async errorToast(error: any) {
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
          message:
            "There was network related or instance related error understanding the request. Please try doing it again.",
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

  editRecord(document: any) {
    localStorage.setItem("isEdit", "true");
    localStorage.setItem("pkQsid", document.pkQsid);
    this.router.navigate(["/question-answer"]);
  }

  @ViewChild("target") MyProp: ElementRef;
  scrollIntoView() {
    this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  scrollToTopVisible = false;
  @ViewChild("divToScroll") divToScroll: ElementRef;
  onScroll(event): void {
    if (this.divToScroll.nativeElement.scrollTop > 500) {
      this.scrollToTopVisible = true;
    } else {
      this.scrollToTopVisible = false;
    }
  }

  async generateEsignRequestV1() {
    this.displayProgressSpinner();
    const response: any = await this.profileService.generateEsignRequestV1(
      localStorage.getItem("regId"),
      this.ipAddress,
      localStorage.getItem("platform")
    );
    this.progressSpinnerDialog.close();
    if (!response.error) {
      if (response.toLowerCase() == "failure") {
        this.manualRejectedQuestions = [];
        this.getDocuments("esign");
        return false;
      }
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
      const browser = this.iab.create(response, target, options);
      browser.on("loadstart").subscribe((ev: InAppBrowserEvent) => {
        // alert(ev.url);
        if (ev.url.startsWith("http://localhost/profile")) {
          browser.close();
          this.successToast("e-Sign successful");
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
          this.successToast("e-Sign successful");
          localStorage.setItem("eSign", "true");
          window.location.reload();
        }
      });
    } else {
      this.errorToast(response);
    }
  }

  async getSignedPdf() {
    if (this.areQuestionsNotAnswered == true) {
      this.applyNowBtnDisabled = true;
      this.downloadEsignDisabled = true;
      this.isEsignDisabled = true;
    } else {
      const progressSpinnerDialog = this.dialog.open(LoaderComponent, {
        disableClose: true,
        panelClass: "progressSpinner",
      });
      const response: any = await this.profileService.getSignedPdf(this.regId);
      progressSpinnerDialog.close();
      if (response != null && !response.error) {
        if (response.status == "Failure") {
          this.applyNowBtnDisabled = true;
          this.downloadEsignDisabled = true;
          this.isEsignDisabled = false;
          localStorage.removeItem("eSign");
        } else {
          setTimeout(() => {
            if (this.areQuestionsNotAnswered == true) {
              this.applyNowBtnDisabled = true;
              this.downloadEsignDisabled = true;
              this.isEsignDisabled = true;
            } else {
              if (this.profileDetails[0]["affidavitStatus"] == "" && this.areQuestionsNotAnswered == false) {
                this.applyNowBtnDisabled = true;
                this.downloadEsignDisabled = true;
                this.isEsignDisabled = false;
                localStorage.removeItem("eSign");
              } else {
                this.applyNowBtnDisabled = false;
                this.downloadEsignDisabled = false;
                this.isEsignDisabled = true;
              }
            }
          }, 1000);
          return true;
        }
      } else {
        return false;
        // this.errorToast(response);
      }
    }
  }

  async downloadEsignFile() {
    this.displayProgressSpinner();
    const response: any = await this.externalApisService.downloadEsignFile(localStorage.getItem("regId"));
    this.progressSpinnerDialog.close();
    if (!response.error) {
      // passing base64 to view e-sign component
      this.viewESignFile(response);
    } else {
      this.errorToast(response);
    }
  }

  async viewESignFile(base64: any) {
    const eSignDoc = this.dialog.open(ViewESignedDocumentComponent, {
      disableClose: true,
      width: "600px",
      data: [base64, this.name],
    });
    eSignDoc.afterClosed().subscribe((result) => {
      if (result == "downloaded") {
        this.successToast("PDF downloaded.");
      }
    });
  }

  async casteValidityRejected(document: any, type: any) {
    const eSignDoc = this.dialog.open(DocumentManuallyRejectedComponent, {
      disableClose: true,
      width: "600px",
      data: [document, type],
    });
    eSignDoc.afterClosed().subscribe((result) => {
      if (result == "refresh") {
        window.location.reload();
      }
    });
  }

  async applyNow() {
    // this.displayProgressSpinner();
    //const response: any = await this.profileService.loadRegistrationUserCategories(this.regId);
    //this.progressSpinnerDialog.close();
    //if (!response.error) {
    //localStorage.setItem("categories", response);
    //this.router.navigate(["/app", "select-lottery", "1"]);
    this.router.navigate(["/app", "select-board"]);
    //} else {
    //this.errorToast(response);
    //}
  }
  
    closePopup(): void {
    this.dialogRef.close();
  }
  
    closeDialog(){
    this.dialog.closeAll();
  }
}
