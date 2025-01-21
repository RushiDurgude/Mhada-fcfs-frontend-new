import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-privacy-policy",
  templateUrl: "./privacy-policy.component.html",
  styleUrls: ["./privacy-policy.component.scss"],
})
export class PrivacyPolicyComponent implements OnInit {
  platform: string = "";
  constructor(private router: Router) {}

  ngOnInit() {
    this.platform = localStorage.getItem("platform");
    localStorage.setItem("lastRoute", this.router.url);
  }
}
