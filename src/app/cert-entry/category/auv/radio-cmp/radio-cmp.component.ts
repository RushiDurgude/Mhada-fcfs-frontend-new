import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cert-entry-radio-cmp',
  templateUrl: './radio-cmp.component.html',
  styleUrls: ['../../../../pre-lottery/pre-lottery.component.scss', './radio-cmp.component.scss']
})
export class RadioCmpComponent implements OnInit {

  @Input() fieldName: string;
  @Input() fieldLabel: string;
  @Input() fieldValue: string;
  @Input() formSubmitted: boolean;
  @Input() pageMode: string;
  @Input() controlName: AbstractControl<any, any>;
  @Input() formGroup: FormGroup<any>;
  @Input() disabled: boolean = false;
  @Input() options: string[];
  @Input() help: string;
  @Output() click = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    
  }

  onClick(e) {
    this.click.emit(e);
  }

}
