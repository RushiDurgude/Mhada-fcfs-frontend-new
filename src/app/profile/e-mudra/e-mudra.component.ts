import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";

@Component({
  selector: "app-e-mudra",
  templateUrl: "./e-mudra.component.html",
  styleUrls: ["./e-mudra.component.scss"],
})
export class EMudraComponent implements OnInit {
  @ViewChild("addform") addform: NgForm;
  contactsForm: FormGroup;
  constructor(private _fb: FormBuilder) {
    this.contactsForm = this._fb.group({
      Parameter1: localStorage.getItem("Parameter1"),
      Parameter2: localStorage.getItem("Parameter2"),
      Parameter3: localStorage.getItem("Parameter3"),
    });
  }

  ngOnInit() {}

  eMsecure(evt: Event) {
    (evt.target as HTMLFormElement).submit();
  }
}
