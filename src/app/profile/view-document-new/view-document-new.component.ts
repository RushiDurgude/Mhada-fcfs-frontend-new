import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedService } from "src/app/toolbar/shared.service";

@Component({
  selector: "app-view-document-new",
  templateUrl: "./view-document-new.component.html",
  styleUrls: ["./view-document-new.component.scss"],
})
export class ViewDocumentNewComponent implements OnInit {
  activeLangIndex: number = 0;
  constructor(
    public dialogRef: MatDialogRef<ViewDocumentNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
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
    });
  }
}
