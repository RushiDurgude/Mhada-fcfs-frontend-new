import { Component, Inject, OnInit } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
  selector: "app-custom-snackbar",
  templateUrl: "./custom-snackbar.component.html",
  styleUrls: ["./custom-snackbar.component.scss"],
})
export class CustomSnackbarComponent implements OnInit {
  message: string = "";
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit() {
    if (this.data[1] == "pmay") {
      this.message =
        "Please check, your Assessment ID is - <b>" +
        this.data[0] +
        "</b>. If its incorrect, kindly reupload the document photo";
    } else if (this.data[1] == "address") {
      this.message =
        "Please check, Your Address is - <b>" +
        this.data[0] +
        "</b>. If its incorrect, kindly reupload the document photo";
    } else if (this.data[1] == "common") {
      this.message =
        "Please check, your document for <b>" +
        this.data[2] +
        "</b>. Number is - <b>" +
        this.data[0] +
        "</b>. If its incorrect, kindly reupload the document photo";
    } else if (this.data[1] == "itr") {
      this.message =
        "Please check, your Acknowledgement Number is - <b>" +
        this.data[0] +
        "</b>, for AY - <b>" +
        this.data[0] +
        "</b> & Total Income is - <b>" +
        this.data[0] +
        "</b>. If its incorrect, kindly reupload the document photo";
    }
  }
}
