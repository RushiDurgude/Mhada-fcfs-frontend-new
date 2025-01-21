import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumbersWithFloatOnly]'
})

export class NumbersWithFloatOnlyDirective {
  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])

  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
    
    if (allowedKeys.includes(event.key)) {
      return;
    }

    const currentValue: string = this.el.nativeElement.value;
    const inputChar: string = event.key;

    // Combine the current value and the input character
    const inputValue: string = currentValue + inputChar;

    // Define a regex pattern for a maximum of 5 digits
    const regex = /^(?!^\.)(-)?\d{0,3}(\.\d{0,2})?$/;
    // Test the input against the regex pattern
    if (!regex.test(inputValue)) {
      event.preventDefault();
    }
  }
}
