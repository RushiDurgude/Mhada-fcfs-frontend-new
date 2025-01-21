import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cert-entry-input-cmp',
  templateUrl: './input-cmp.component.html',
  styleUrls: ['../../../../pre-lottery/pre-lottery.component.scss', './input-cmp.component.scss']
})
export class InputCmpComponent implements OnInit {

  @Input() fieldName: string;
  @Input() fieldLabel: string;
  @Input() fieldValue: string;
  @Input() formSubmitted: boolean;
  @Input() maxlength: string;
  @Input() pageMode: string;
  @Input() controlName: AbstractControl<any, any>;
  @Input() formGroup: FormGroup<any>;
  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }

}
