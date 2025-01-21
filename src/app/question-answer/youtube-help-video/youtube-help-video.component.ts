import { Component, Inject, OnInit, SecurityContext } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-youtube-help-video",
  templateUrl: "./youtube-help-video.component.html",
  styleUrls: ["./youtube-help-video.component.scss"],
})
export class YoutubeHelpVideoComponent implements OnInit {
  videoSrc: SafeUrl;

  constructor(
    protected _sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<YoutubeHelpVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data.qsCode == "Q_AADHAR" && +this.data.pkQsid == 2) {
      let url = this.data.qsDescription.split(",")[0];
      this.videoSrc = this._sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      let url = this.data.qsDescription;
      this.videoSrc = this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
