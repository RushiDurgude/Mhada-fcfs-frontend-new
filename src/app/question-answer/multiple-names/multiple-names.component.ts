import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-multiple-names",
  templateUrl: "./multiple-names.component.html",
  styleUrls: ["./multiple-names.component.scss"],
})
export class MultipleNamesComponent implements OnInit {
  ocrName: string = "";
  aliasName: string = "";
  constructor(public dialogRef: MatDialogRef<MultipleNamesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.ocrName = this.data[0];
    this.aliasName = this.data[1];
  }
}
