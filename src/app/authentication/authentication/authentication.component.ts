import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-authentication",
  templateUrl: "./authentication.component.html",
  styleUrls: ["./authentication.component.scss"],
})
export class AuthenticationComponent implements OnInit {
  platform = localStorage.getItem("platform");
  isVisible: boolean = false;
  constructor(private router: Router) {}

  ngOnInit() {
    localStorage.setItem("lastRoute", this.router.url);
    setTimeout(() => {
      this.isVisible = true;
    }, 300);
  }
}
