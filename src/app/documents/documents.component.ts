import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { AuthenticationService } from "../authentication/authentication.service";
import { YoutubeHelpVideoComponent } from "../question-answer/youtube-help-video/youtube-help-video.component";
import { SharedService } from "../toolbar/shared.service";
import { ThemeService } from "../theme.service";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.scss"],
})
export class DocumentsComponent implements OnInit {
  platform = localStorage.getItem("platform");
  videos: any[] = [];
  authFlag: boolean = false;
  devicePlatform: string = "";
  doNoShowAgain: boolean = false;

  isDarkMode: boolean = false;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
    public alertController: AlertController,
    private dialog: MatDialog,
    private themeService: ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    localStorage.setItem("lastRoute", this.router.url);
    this.sharedService.authFlag.subscribe((flag) => {
      this.authFlag = flag;
    });

    if (
      window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") ||
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
    this.getShowInfoFlag();
    this.getLandingVideos();
  }

  async getLandingVideos() {
    this.videos = [];
    const response: any = await this.authenticationService.getHelpDocVideos();
    this.videos = [];
    console.log(response);

    for (let i = 0; i < response.length; i++) {
      var last = response[i]["url"].substring(response[i]["url"].lastIndexOf("/") + 1, response[i].length);
      this.videos.push({
        videoUrl: response[i]["url"],
        videoId: "https://img.youtube.com/vi/" + last + "/0.jpg",
        videoLink: response[i]["videoTitle"],
      });
    }
    console.log(this.videos);
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

  viewHelpVideo(url: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.dialog.open(YoutubeHelpVideoComponent, {
      disableClose: true,
      // width: "600px",
      panelClass: "video-dialog",
      data: { qsDescription: url, qsCode: "landing", pkQsid: -1 },
    });
  }

  async updateShowInfoFlag() {
    await this.sharedService.updateShowInfoFlag().subscribe((response: any) => {
      if (!response.error) {
        if (response.status.toLowerCase() == "success") {
          this.router.navigate(["/landing"]);
        }
      } else {
        console.log(response.message);
      }
    });
  }

  async getShowInfoFlag() {
    await this.sharedService.getShowInfoFlag().subscribe((response: any) => {
      if (!response.error) {
        if (response.status.toLowerCase() == "yes") {
          this.doNoShowAgain = false;
        } else if (response.status.toLowerCase() == "no") {
          this.doNoShowAgain = true;
        }
      } else {
        console.log(response.message);
      }
    });
  }

}
