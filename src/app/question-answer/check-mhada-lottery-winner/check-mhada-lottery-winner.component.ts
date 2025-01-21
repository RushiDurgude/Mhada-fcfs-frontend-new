import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "src/app/loader/loader.component";
import { QuestionAnswerService } from "../question-answer.service";

@Component({
  selector: "app-check-mhada-lottery-winner",
  templateUrl: "./check-mhada-lottery-winner.component.html",
  styleUrls: ["./check-mhada-lottery-winner.component.scss"],
})
export class CheckMhadaLotteryWinnerComponent implements OnInit {
  selectedRadioOption: string = "Yes";
  constructor(
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    public toastController: ToastController,
    public dialogRef: MatDialogRef<CheckMhadaLotteryWinnerComponent>,
    @Inject(MAT_DIALOG_DATA) public displayedQuestion: any,
    public questionAnswerService: QuestionAnswerService
  ) {}

  ngOnInit() {}

  async updateWinnerStatus(ansOption: string) {
    const progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
    let fileObj = {
      quesId: this.displayedQuestion[0].pkQsid,
      quesCode: this.displayedQuestion[0].qsCode,
      regId: localStorage.getItem("regId"),
      ansOption: ansOption,
      email: "",
      otp: "",
      barcode: "",
      panNo: localStorage.getItem("pan_number"),
      aadharNo: "",
      docuLocation: "",
      mediaType: "image",
      docImage: "",
      ocrString: null,
    };
    const response: any = await this.questionAnswerService.updateWinnerStatus(fileObj, this.displayedQuestion[1]);
    progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.toLowerCase() == "success") {
        this.dialogRef.close("No");
      } else {
        this.dialogRef.close("reupload");
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
    }
  }
}
