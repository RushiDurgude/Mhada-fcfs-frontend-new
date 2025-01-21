import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-youtube-help-video-new",
  templateUrl: "./youtube-help-video-new.component.html",
  styleUrls: ["./youtube-help-video-new.component.scss"],
})
export class YoutubeHelpVideoNewComponent implements OnInit {
  videoSrc: SafeUrl;

  constructor(
    protected _sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<YoutubeHelpVideoNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    let url = this.data.qsDescription;
    this.videoSrc = this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
