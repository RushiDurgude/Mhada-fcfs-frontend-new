import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { CheckTokenService } from "../auth-guard/check-token.service";
import { AuthenticationService } from "../authentication/authentication.service";
import { AnnouncementModel } from "../pre-lottery/models/announcment.model";
import { PreLotteryApplicationService } from "../pre-lottery/services/pre-lottery-application.service";
import { QuestionAnswerService } from "../question-answer/question-answer.service";
import { YoutubeHelpVideoComponent } from "../question-answer/youtube-help-video/youtube-help-video.component";
import { SharedService } from "../toolbar/shared.service";
import { LandingPopupComponent } from "./landing-popup/landing-popup.component";
import { BannerImageResponse } from "../registration-step/models/banner-image-response.model";
import { BannerImageModel } from "../registration-step/models/banner-image.model";
import { TranslocoService } from "@ngneat/transloco";
import { MyObjectionSuggestionComponent } from "../grievance/lottory-user/objsuggestion/my-objection-suggestion/my-objection-suggestion.component";
import { MyGrievancesComponent } from "../grievance/lottory-user/my-grievances/my-grievances.component";
@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  @ViewChild("Slides") slides: IonSlides | any;
  @ViewChild("SlidesXl") slidesXl: IonSlides | any;
  @ViewChild("VideoSlides") videoSlides: IonSlides | any;
  @ViewChild("VideoSlidesLargeScreen") videoSlidesLargeScreen: IonSlides | any;

  news: AnnouncementModel[] = [];
  videos: any[] = [];
  isDownloadAppButtonVisible: boolean = false;
  banners: BannerImageModel[];
  authFlag: boolean = false;
  activeLangIndex: number = 0;
  activeLang: string = "en";
  lang: string = "";
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    // loop: true,
    spaceBetween: 15,
    autoplay: {
      delay: 6000,
    },
  };

  videoSlideOpts = {
    slidesPerView: 3,
    initialSlide: 0,
    speed: 400,
    loop: false,
    spaceBetween: 15,
    // autoplay: {
    //   delay: 2500,
    // },
  };
  constructor(
    private router: Router,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private authService: CheckTokenService,
    private authenticationService: AuthenticationService,
    protected _sanitizer: DomSanitizer,
    private questionAnswerService: QuestionAnswerService,
    private service: TranslocoService,
    public callLan: MyGrievancesComponent,
    public objectionList: MyObjectionSuggestionComponent
  ) {}

  slidePrev() {
    this.slides.slidePrev();
    this.slidesXl?.slidePrev();
    this.videoSlides?.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
    this.slidesXl?.slideNext();
    this.videoSlides?.slideNext();
  }

  slidePrevVideo() {
    this.videoSlidesLargeScreen.slidePrev();
    this.videoSlides.slidePrev();
  }
  slideNextVideo() {
    this.videoSlidesLargeScreen.slideNext();
    this.videoSlides.slideNext();
  }

  ngOnInit() {
    console.log('in landing page component', this.router.url);
    this.checkActiveLanguage();
    if (
      window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") ||
      window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") ||
      window.location.href.toString().startsWith("https://housing.pmrda.gov.in/") ||
      window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/") ||
      window.location.href.toString().startsWith("http://localhost:8100/") ||
      window.location.href.toString().startsWith("https://securitytestingbookmyhome.mhada.gov.in/") ||
      window.location.href.toString().startsWith("https://bookmyhome.mhada.gov.in/") ||
      window.location.href.toString().startsWith("http://bookmyhomelocal.mhada.gov.in:8100/")
    ) {
      this.isDownloadAppButtonVisible = true;
    } else {
      this.isDownloadAppButtonVisible = false;
    }
    localStorage.setItem("lastRoute", this.router.url);
    this.preLotteryApplicationService.fetchActiveNews().subscribe((news) => {
      this.news = news.filter((n) => n.announcementType === "ANNOUNCEMENT");
    });
    // this.displayImagePopup();
    this.sharedService.name.subscribe((lang) => {
      this.lang = lang;
    });
    this.getLandingVideos();
    this.getBannerImages();
  }

  async getBannerImages() {
    this.banners = [];
    // const response: any = await this.questionAnswerService.getBannerImages();
    // if (response.status === 'SUCCESS') {
    //   this.banners = response.bannerImages;
    // }

    const bannerData = [
      {
        imageUrl: "assets/banner2.jpg",
        heading: null,
        description: null
      },
      {
        imageUrl: "assets/banner1.jpg",
        heading: null,
        description: null
      }
    ];
    this.banners = bannerData.map(data => new BannerImageModel(data.imageUrl, data.heading, data.description));
          
  }

  async startNow() {
    // localStorage.setItem("session-started", "true");
    // if (this.authService.isAuthenticateUser()) {
    //   const response: any = await this.questionAnswerService.checkEmailDetails();
    //   if (!response.error) {
    //     if (response.status.toLowerCase() == "success") {
    //       this.router.navigate(["/registration-step"], { replaceUrl: true });
    //     } else {
    //       localStorage.setItem("otpVerificationPending", "true");
    //       this.router.navigate(["/signUp"], { replaceUrl: true });
    //     }
    //   } else {
    //   }
    // } else {
    //   this.router.navigate(["/signUp"], { replaceUrl: true });
    // }
    const authStatus = await this.authService.isAuthenticateUser();

    if (authStatus) {
      this.router.navigate(["/registration-step"], { replaceUrl: true });
    } 
    else {
      this.router.navigate(["/signUp"], { replaceUrl: true });
      localStorage.removeItem("loginPan");
      localStorage.removeItem("otpResendTimeLeft");
      localStorage.removeItem("otpVerificationPending");
    }
  }

  displayImagePopup() {
    const imagePopup = this.dialog.open(LandingPopupComponent, {
      disableClose: true,
      width: "600px",
    });
  }

  async getLandingVideos() {
    this.videos = [];
    const response: any = await this.authenticationService.getLandingVideos();
    this.videos = [];
    for (let i = 0; i < response.length; i++) {
      var last = response[i]["lovMediaLink"].substring(
        response[i]["lovMediaLink"].lastIndexOf("/") + 1,
        response[i].length
      );
      this.videos.push({
        lovMediaLink: response[i]["lovMediaLink"],
        videoId: "https://img.youtube.com/vi/" + last + "/0.jpg",
      });
    }
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

  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      if(data == "en") {
        this.activeLangIndex = 0;
      } 
      else if(data == "mr") {
        this.activeLangIndex = 1;
      } 
      else {
        this.activeLangIndex = 0;
      }
      setTimeout(() => {
        this.slides.update();
      }, 200)
    });
  }

  bannerHeading(bannerHeading) {
    return bannerHeading?.split("|||")[this.activeLangIndex];
  }

  changeLang(event: Event) {
    const selectedLang = (event.target as HTMLSelectElement).value;
  
    if (selectedLang === "en" && this.activeLang !== "en") {
      this.activeLang = "en";
      this.service.setActiveLang("en");
    } else if (selectedLang === "mr" && this.activeLang !== "mr") {
      this.activeLang = "mr";
      this.service.setActiveLang("mr");
    }
  
    this.sharedService.changeName(this.activeLang);
    this.callLan.checkActiveLanguageForDatatable();
    this.objectionList.checkActiveLanguageForObjDatatable();
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

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const faqItem = button.parentElement;

    // Toggle the 'active' class for the clicked FAQ item
    faqItem.classList.toggle("active");

    // Hide other FAQ answers if one is opened
    document.querySelectorAll(".faq-item").forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove("active");
      }
    });
  });
});






