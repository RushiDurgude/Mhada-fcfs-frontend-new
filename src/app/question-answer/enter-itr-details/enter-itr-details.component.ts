import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "src/app/loader/loader.component";
import { QuestionAnswerService } from "../question-answer.service";

@Component({
  selector: "app-enter-itr-details",
  templateUrl: "./enter-itr-details.component.html",
  styleUrls: ["./enter-itr-details.component.scss"],
})
export class EnterItrDetailsComponent implements OnInit {
  itrName: string = "";
  // itrBarcode: string = "";
  // fullNamePattern: string = "^[A-Za-z]+(?: [A-Za-z]+)?(?: [A-Za-z]+)?$";
  // fullNamePattern: string = "^[A-Za-z]+(?:s[A-Za-z]+)*$";
  fullNamePattern: string = "^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$";
  // fullNamePattern: string = "^[A-Za-z]+ [A-Za-z]+?(?: [A-Za-z]+)*$";
  itrAssessmentYear: string = "";
  itrIncome: string = "";
  assessmentYearPattern: string = "^([0-9]){4}[-]([0-9]){2}$";
  consentAccepted: any = false;
  constructor(
    public dialogRef: MatDialogRef<EnterItrDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastController: ToastController,
    private dialog: MatDialog,
    public questionAnswerService: QuestionAnswerService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    this.itrName = this.data[1];
    // this.itrBarcode = this.data[3];
    this.itrAssessmentYear = this.data[3];
    this.itrIncome = this.data[5];
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  assessmentYear(event: any) {
    // const charCode = event.which ? event.which : event.keyCode;
    // if (charCode > 31 && charCode > 45 && (charCode < 48 || charCode > 57)) {
    //   return false;
    // }
    // return true;
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9-]/g, ""); // Remove non-numeric and - characters
  }

  async submitItrDetails() {
    let isEdit = "Y";
    if (this.itrName === this.data[1] && this.itrAssessmentYear === this.data[3] && this.itrIncome === this.data[5]) {
      isEdit = "N";
      this.itrName = null;
      this.itrAssessmentYear = this.itrAssessmentYear;
      this.itrIncome = this.itrIncome;
    } else {
      isEdit = "Y";
    }

    let itrEditDetails = {
      itrName: this.itrName,
      // itrBarcode: this.itrBarcode,
      itrAssessmentYear: this.itrAssessmentYear,
      itrIncome: this.itrIncome,
    };
    this.dialogRef.close({
      itrName: this.itrName,
      itrAssessmentYear: this.itrAssessmentYear,
      itrIncome: this.itrIncome,
      isEdit: isEdit,
    });
    // const progressSpinnerDialog = this.dialog.open(LoaderComponent, {
    //   disableClose: true,
    //   panelClass: "progressSpinner",
    // });
    // const response: any = await this.questionAnswerService.verifyIncomeCertV1(
    //   this.data[6],
    //   this.data[7],
    //   this.data[8],
    //   this.itrName,
    //   this.itrAssessmentYear,
    //   null,
    //   this.itrIncome,
    //   isEdit
    // );
    // progressSpinnerDialog.close();
    // if (response != null && !response.error) {
    //   if (response.status.toLowerCase() == "success" || response.status.toLowerCase() == "verified") {
    //     this.dialogRef.close("success");
    //   } else if (response.status.toLowerCase() == "rejected-mismatch") {
    //     this.dialogRef.close("rejected");
    //   } else if (response.toLowerCase() == "failure") {
    //     this.dialogRef.close("failure");
    //   } else {
    //     this.dialogRef.close("failure");
    //   }
    // } else {
    //   const toast = await this.toastController.create({
    //     message: this.translocoService.translate("error-network-related"),
    //     icon: "information-circle",
    //     position: "top",
    //     cssClass: "toast error-toast",
    //     duration: 5000,
    //   });
    //   toast.present();
    // }
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  }
}
