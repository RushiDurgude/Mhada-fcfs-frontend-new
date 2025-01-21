import { Component, OnInit } from "@angular/core";
import { ThemeService } from "../theme.service";

@Component({
  selector: "app-bottom-navigation-bar",
  templateUrl: "./bottom-navigation-bar.component.html",
  styleUrls: ["./bottom-navigation-bar.component.scss"],
})
export class BottomNavigationBarComponent implements OnInit {
  menus: any[] = [];
  selectedRoute: string = "";

  isDarkMode : boolean = false;
  constructor(
    private themeService : ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit() {
    this.menus = [
      {
        label: "Home",
        routerLink: "/landing",
        icon: "home-outline",
      },
      {
        label: "Documents",
        routerLink: "/",
        icon: "document-text-outline",
      },
      {
        label: "Help",
        routerLink: "/app/help",
        icon: "help-circle-outline",
      },
      {
        label: "Alerts",
        routerLink: "/notifications",
        icon: "notifications-outline",
      },
    ];
    if (localStorage.getItem("selectedBottomBarMenu") != null) {
      let menu = localStorage.getItem("selectedBottomBarMenu");
      this.activeRoute(JSON.parse(menu));
    }
  }

  activeRoute(menu: any) {
    localStorage.removeItem("selectedBottomBarMenu");
    localStorage.setItem("selectedBottomBarMenu", JSON.stringify(menu));
    this.selectedRoute = menu.label;
  }
}
