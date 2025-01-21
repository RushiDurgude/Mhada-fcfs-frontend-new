import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { ChatbotComponent } from "../chatbot/chatbot.component";
import { SharedService } from "../toolbar/shared.service";
import { ContactUsService } from "./contact-us.service";

@Component({
  selector: "app-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent implements OnInit {
  contactUsDetails: any[] = [];
  platform: string = "";
  authFlag = false;
  contactUsEmails: any[] = [];
  contactUsAddress: any[] = [];
  helpCenterDetails: any[] = [];

  constructor(
    private router: Router,
    private contactUsService: ContactUsService,
    private modalCtrl: ModalController,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.authFlag.subscribe((flag) => {
      this.authFlag = flag;
    });
    this.platform = localStorage.getItem("platform");
    localStorage.setItem("lastRoute", this.router.url);
    this.getContactUsPhone();
    this.getHelpCenterDetails();
    // this.getContactUsEmail();
    // this.getContactUsAddress();
  }

  async getContactUsPhone() {
    this.contactUsDetails = [];
    const response: any = await this.contactUsService.getContactUsPhone();
    if (response.length > 0) {
      this.contactUsDetails = response;
      for (let i = 0; i < this.contactUsDetails.length; i++) {
        this.contactUsDetails[i]["tel"] = "tel:" + this.contactUsDetails[i]["lovMediaLink"];
      }
    }
  }

  async getHelpCenterDetails() {
    this.helpCenterDetails = [];
    const response: any = await this.contactUsService.getHelpCenterDetails();
    if (response.length > 0) {
      this.helpCenterDetails = response;
      for (let i = 0; i < this.helpCenterDetails.length; i++) {
        this.helpCenterDetails[i]["phoneNo"] = JSON.parse(this.helpCenterDetails[i]["phoneNo"]);
        this.helpCenterDetails[i]["emails"] = JSON.parse(this.helpCenterDetails[i]["emails"]);
        this.helpCenterDetails[i]["address"] = JSON.parse(this.helpCenterDetails[i]["address"]);
      }
    }
  }

  async getContactUsEmail() {
    this.contactUsEmails = [];
    const response: any = await this.contactUsService.getContactUsEmail();
    if (response.length > 0) {
      this.contactUsEmails = response;
      for (let i = 0; i < this.contactUsEmails.length; i++) {
        this.contactUsEmails[i]["mailto"] = "mailto:" + this.contactUsEmails[i]["lovMediaLink"];
      }
    }
  }

  async getContactUsAddress() {
    this.contactUsAddress = [];
    const response: any = await this.contactUsService.getContactUsAddress();
    if (response.length > 0) {
      this.contactUsAddress = response;
    }
  }

  async openChatBot() {
    // this.isChatBotBtnVisible = false;
    const modal = await this.modalCtrl.create({
      component: ChatbotComponent,
      mode: "ios",
      backdropDismiss: false,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    // if (role === "confirm") {
    //   this.isChatBotBtnVisible = true;
    // } else {
    //   this.isChatBotBtnVisible = true;
    // }
  }
}
