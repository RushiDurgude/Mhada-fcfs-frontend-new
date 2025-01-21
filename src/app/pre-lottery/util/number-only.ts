import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {
  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])

  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
    
    if (allowedKeys.includes(event.key)) {
      return;
    }

    const regex = /[0-9]/;
    const inputChar = event.key;
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }
}