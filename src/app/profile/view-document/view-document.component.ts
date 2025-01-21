import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedService } from "src/app/toolbar/shared.service";

@Component({
  selector: "app-view-document",
  templateUrl: "./view-document.component.html",
  styleUrls: ["./view-document.component.scss"],
})
export class ViewDocumentComponent implements OnInit {
  activeLang: string = "en";
  constructor(
    public dialogRef: MatDialogRef<ViewDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
    });
  }
}
