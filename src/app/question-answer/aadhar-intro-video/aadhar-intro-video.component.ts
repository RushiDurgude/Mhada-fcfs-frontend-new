import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-aadhar-intro-video",
  templateUrl: "./aadhar-intro-video.component.html",
  styleUrls: ["./aadhar-intro-video.component.scss"],
})
export class AadharIntroVideoComponent implements OnInit {
  videoSrc: SafeUrl;

  constructor(
    protected _sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AadharIntroVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    let url = this.data.qsDescription.split(",")[1];
    if (url == undefined) {
      this.videoSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.data.qsDescription);
    } else {
      this.videoSrc = this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
