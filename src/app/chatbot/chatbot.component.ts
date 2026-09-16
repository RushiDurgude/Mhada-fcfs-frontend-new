import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ActionSheetController, ModalController, ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "../loader/loader.component";
import { ProfileService } from "../profile/profile.service";
import { SharedService } from "../toolbar/shared.service";
import { ChatbotService } from "./chatbot.service";

@Component({
  selector: "app-chatbot",
  templateUrl: "./chatbot.component.html",
  styleUrls: ["./chatbot.component.scss"],
})
export class ChatbotComponent implements OnInit, AfterViewInit {
  constructor(
    private modalCtrl: ModalController,
    private chatbotService: ChatbotService,
    private actionSheetCtrl: ActionSheetController,
    private translocoService: TranslocoService,
    public toastController: ToastController,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private router: Router,
    private profileService: ProfileService
  ) {}
  platform: any = localStorage.getItem("platform");
  name: string = "";
  activeLang: string = "";
  catId: any = "";
  subCatId: any = "";
  username: any = localStorage.getItem("username");

  cancel() {
    localStorage.setItem("chats", JSON.stringify(this.chats));
    return this.modalCtrl.dismiss(null, "cancel");
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, "confirm");
  }

  chats: any[] = [];
  isMessageInputVisible: boolean = true;
  message: string = "";

  ngOnInit(): void {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
    });
    // if (localStorage.getItem("chats") != null) {
    //   this.chats = JSON.parse(localStorage.getItem("chats"));
    //   this.scrollToBottom();
    // } else {
    //   this.chats = [
    //     {
    //       questions: [
    //         {
    //           queId: 99,
    //           queEng: "Hi, I am here to help, may I know your name?",
    //           dateTime: new Date(),
    //         },
    //       ],
    //       answers: [],
    //     },
    //   ];
    // }
    this.getPreviousChats();
  }

  allowOnlyValidCharacters(event: KeyboardEvent): void {
  const validChars = /^[a-zA-Z0-9 ]$/;

  if (!validChars.test(event.key)) {
    event.preventDefault();
  }
}
disablePaste(event: ClipboardEvent): void {
  event.preventDefault();
}
  async getPreviousChats() {
    const response: any = await this.chatbotService.getUsrChat();
    if (response != null && !response.error) {
      if (response.status != "Fail") {
        this.chats = response;
        this.scrollToBottom();
      } else {
        // this.chats = [
        //   {
        //     questions: [
        //       {
        //         queId: 99,
        //         queEng: {
        //           en: "Hi, I am here to help, may I know your name?",
        //           mr: "नमस्कार, मी मदत करण्यासाठी येथे आहे, मला तुमचे नाव कळेल का?",
        //         },
        //         dateTime: new Date(),
        //       },
        //     ],
        //     answers: [],
        //   },
        // ];
        this.chats.push({
          questions: [
            {
              queId: "99",
              queEng: {
                en: "Hi, " + this.username + " what can I help you with today?",
                mr: this.username + " आज मी तुला काय मदत करू शकतो?",
              },
              disabled: true,
              dateTime: new Date(),
            },
          ],
          answers: [],
        });
        this.scrollToBottom();
      }
    } else {
      this.errorToast(response);
    }
  }

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
          // localStorage.setItem("token", response.token);
          this.sharedService.setAuthentication(true);
          window.location.reload();
          // this.ngOnInit();
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

  selectQuestion(chat: any, queEng: any) {
    if (queEng.queId != 99) {
      for (let i = 0; i < this.chats.length; i++) {
        this.chats[i]["questions"] = this.chats[i]["questions"].map((x: any) => ({ ...x, disabled: true }));
        if (this.chats[i]["answers"].length == 0) {
          this.chats[i]["answers"].push({
            ans: {
              en: queEng.queEng.en,
              mr: queEng.queEng.mr,
            },
            dateTime: new Date(),
          });
        }
      }
      this.chats.push({
        questions: [
          {
            queEng: { en: queEng.ansEng.en, mr: queEng.ansEng.mr },
            disabled: true,
            dateTime: new Date(),
            queId: "99",
          },
        ],
        answers: [],
      });
      // this.addNewData();

      this.scrollToBottom();
    }
  }

  async getFaqQuestions() {
    const response: any = await this.chatbotService.getFaqQuestions(this.message);
    let data: any[] = [];
    // for (let i = 0; i < response.length; i++) {
    //   data.push({
    //     queEng: response[i]["qusDescriptionEng"],
    //     queMar: response[i]["qusDescriptionMar"],
    //     id: response[i]["pkQusid"],

    //     ansEng: response[i]["qusAnswerEng"],
    //     ansMar: response[i]["qusAnswerMar"],

    //     type: "faq",
    //   });
    // }
    // this.chats.push({
    //   questions: data,
    //   answers: [],
    // });
    // console.log(this.chats);
    if (response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        data.push({
          queEng: {
            en: response[i]["qusDescriptionEng"],
            mr: response[i]["qusDescriptionMar"],
          },
          // queMar: response[i]["qusDescriptionMar"],
          queId: response[i]["pkQsid"],
          // ansEng: response[i]["qsQuestion"]["mr"],
          ansEng: { en: response[i]["qusAnswerEng"], mr: response[i]["qusAnswerMar"] },
          // ansEng: response[i]["qusAnswerEng"],
          // ansMar: response[i]["qusAnswerMar"],
          type: "category",
          dateTime: new Date(),
        });
      }
      this.chats.push({
        questions: data,
        answers: [],
      });
      this.scrollToBottom();
    } else {
      data.push({
        queEng: {
          en: "I'm sorry " + this.name + " I'm unable to understand your request, can you please elaborate your query?",
          mr:
            "मला माफ करा " +
            this.name +
            " मला तुमची विनंती समजू शकली नाही, तुम्ही कृपया तुमची क्वेरी विस्तृत करू शकाल का?",
        },
        queMar:
          "I'm sorry " + this.name + ", I'm unable to understand your request, can you please elaborate your query?",
        queId: "99",
        type: "category",
        dateTime: new Date(),
      });
      this.chats.push({
        questions: data,
        answers: [],
      });
      this.scrollToBottom();
    }
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.message != "") {
      if (this.chats.length == 1) {
        var lastAddress = this.chats[this.chats.length - 1];
        lastAddress.answers.push({ ans: { en: this.message, mr: this.message }, dateTime: new Date() });

        if (
          this.message.toLowerCase() == "hi" ||
          this.message.toLowerCase() == "hello" ||
          this.message.toLowerCase() == "namaskar" ||
          this.message.toLowerCase() == "namaste"
        ) {
          this.chats.push({
            questions: [
              {
                queId: "99",
                queEng: {
                  en: this.message + ", Please share your query, if there is any?",
                  mr: this.message + ", कृपया तुमची क्वेरी शेअर करा, काही असल्यास?",
                },
                disabled: true,
                dateTime: new Date(),
              },
            ],
          });
          // this.chats.push({
          //   questions: [
          //     {
          //       queId: "99",
          //       queEng: "Hi, " + this.name + " what can I help you with today?",
          //       disabled: true,
          //       dateTime: new Date(),
          //     },
          //   ],
          //   // answers: [{ dateTime: new Date() }],
          // });
        } else {
          // if (this.name == "") {
          //   this.name = this.message;
          // }
          // this.chats.push({
          //   questions: [
          //     {
          //       queId: "99",
          //       queEng: {
          //         en: "Hi, " + this.name + " what can I help you with today?",
          //         mr: this.name + " आज मी तुला काय मदत करू शकतो?",
          //       },
          //       disabled: true,
          //       dateTime: new Date(),
          //     },
          //   ],
          //   // answers: [{ dateTime: new Date() }],
          // });
          this.getFaqQuestions();
        }
      } else if (this.chats.length >= 2) {
        var lastAddress = this.chats[this.chats.length - 1];
        lastAddress.answers = [{ ans: { en: this.message, mr: this.message }, dateTime: new Date() }];
        if (
          // this.message.toLowerCase().includes("end") ||
          // this.message.toLowerCase().includes("exit") ||
          // this.message.toLowerCase().includes("terminate") ||
          // this.message.toLowerCase().includes("conclude") ||
          // this.message.toLowerCase().includes("close")
          this.message.toLowerCase().includes("thanks") ||
          this.message.toLowerCase().includes("thank you") ||
          this.message.toLowerCase().includes("ok")
        ) {
          // this.endChat("N");
          this.chats.push({
            questions: [
              {
                queId: "99",
                queEng: { en: "Glad that I could help you.", mr: "मी तुम्हाला मदत करू शकलो याचा आनंद झाला." },
                disabled: true,
                dateTime: new Date(),
              },
            ],
          });
        } else if (
          this.message.toLowerCase() == "hi" ||
          this.message.toLowerCase() == "hello" ||
          this.message.toLowerCase() == "namaskar" ||
          this.message.toLowerCase() == "namaste"
        ) {
          this.chats.push({
            questions: [
              {
                queId: "99",
                queEng: {
                  en: this.message + ", Please share your query, if there is any?",
                  mr: this.message + ", कृपया तुमची क्वेरी शेअर करा, काही असल्यास?",
                },
                disabled: true,
                dateTime: new Date(),
              },
            ],
          });
        } else {
          this.getFaqQuestions();
        }
      }
      this.message = "";
    }
    this.scrollToBottom();
  }

  scrollToBottom() {
    // let scroll_to_bottom: any = document.getElementById("scrollToBottom");
    // scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
    // setTimeout(() => {
    //   var objDiv: any = document.getElementById("scrollToBottom");
    //   // console.log(objDiv.scrollHeight);
    //   // console.log(objDiv.offsetHeight);
    //   if (this.platform == "browser" || this.platform == "browser-local") {
    //     this.maxHeight = 500; // was 550 earlier
    //   } else {
    //     if (this.maxHeight < window.innerHeight) {
    //       this.maxHeight = window.innerHeight - 55; // only this was there earlier in else
    //     } else {
    //       this.maxHeight = this.maxHeight;
    //     }
    //   }
    //   // console.log(this.maxHeight);
    //   objDiv.scrollTop = objDiv.scrollHeight;
    // }, 10);
  }

  // maxHeight = 500;
  @ViewChild("scrollToBottom") elementView: ElementRef;
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.platform == "browser" || this.platform == "browser-local") {
        // this.maxHeight = this.elementView.nativeElement.offsetHeight;
      }
    }, 1000);
    // var objDiv: any = document.getElementById("scrollToBottom");
    // // console.log(objDiv.height);
    // this.maxHeight = objDiv.scrollHeight;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translocoService.translate("chat-bot-options"),
      backdropDismiss: false,
      buttons: [
        // {
        //   text: this.translocoService.translate("chat-bot-end-conversation"),
        //   role: "destructive",
        //   data: {
        //     action: "delete",
        //   },
        //   handler: () => {
        //     this.endChat("N");
        //   },
        // },
        {
          text: this.translocoService.translate("chat-bot-email-transcript"),
          data: {
            action: "share",
          },
          role: "destructive",
          handler: () => {
            this.endChat("Y");
          },
        },
        {
          text: this.translocoService.translate("chat-bot-close"),
          role: "cancel",
          data: {
            action: "cancel",
          },
          handler: () => {
            // this.endChat("N");
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
  }

  async endChat(sendOnMail: string) {
    const progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
    const response: any = await this.chatbotService.createChat(JSON.stringify(this.chats), sendOnMail);
    progressSpinnerDialog.close();
    if (!response.error) {
      if (response == "Success") {
        localStorage.removeItem("chats");
        if (sendOnMail == "Y") {
          const toast = await this.toastController.create({
            message: this.translocoService.translate("chat-bot-chat-emailed"),
            icon: "checkmark-circle-outline",
            position: "top",
            cssClass: "toast success-toast",
            duration: 5000,
          });
          toast.present();
        }
        return this.modalCtrl.dismiss(null, "cancel");
      } else {
        localStorage.removeItem("chats");
        return this.modalCtrl.dismiss(null, "cancel");
      }
    } else {
      // alert('Cannot save chats')
    }
  }
}
