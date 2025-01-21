import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cert-entry-textarea-cmp',
  templateUrl: './textarea-cmp.component.html',
  styleUrls: ['../../../../pre-lottery/pre-lottery.component.scss']
})
export class TextareaCmpComponent implements OnInit {

  @Input() fieldName: string;
  @Input() fieldLabel: string;
  @Input() fieldValue: string;
  @Input() formSubmitted: boolean;
  @Input() pageMode: string;
  @Input() controlName: AbstractControl<any, any>;
  @Input() formGroup: FormGroup<any>;

  constructor() { }

  ngOnInit(): void {}


}
