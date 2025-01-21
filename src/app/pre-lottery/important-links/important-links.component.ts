import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";

@Component({
  selector: "app-important-link",
  templateUrl: "./important-links.component.html",
  styleUrls: ["./important-links.component.scss"],
})
export class ImportantListComponent implements OnInit {
  platform: string = "";
  governmentOfIndia: string = "";
  cidco: string = "";
  aapleSarkar: string = "";
  pmayPortal: string = "";
  mhadaLotteryPortal: string = "";
  mhadaEauctionPortal: string = "";
  mhadaEbillingPortal: string = "";
  pmrda: string = "";

  constructor(private router: Router,
    private preLotteryApplicationService: PreLotteryApplicationService,

    ) {}

  ngOnInit() {
    this.platform = localStorage.getItem("platform");
    localStorage.setItem("lastRoute", this.router.url);

    this.preLotteryApplicationService
    .fetImpLinks()
    .subscribe((data) => {
      console.log("FOund Data>>>>>>>>>>>>>>>>",data);
      this.governmentOfIndia = data.governmentOfIndia;
      this.cidco = data.cidco;
      this.aapleSarkar = data.aapleSarkar;
      this.pmayPortal = data.pmayPortal;      
      this.pmrda = data.pmrda;
    });

  }

}
