import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFloatOnly]'
})
export class FloatOnlyDirective {
  constructor(private el: ElementRef) { }

  // @HostListener('keydown', ['$event'])
  @HostListener('input', ['$event'])
  
  // onKeyDown(event: KeyboardEvent) {
  //   console.log('onKeyDown calledmnnnnnnnnnnnnnnnnnnnn', event?.keyCode, event?.type);
    
  //   const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
    
  //   if (allowedKeys.includes(event.key)) {
  //     return;
  //   }

  //   const regex = /^(?!^\.)(\d+(\.\d{0,2})?)?$/;
  //   const inputChar = event.key;
  //   const inputValue = this.el.nativeElement.value + inputChar;
  //   console.log('onKeyDown calledmnnnnnnnnnnnnnnnnnnnn', inputValue, regex.test(inputValue));

  //   if (!regex.test(inputValue)) {
  //     event.preventDefault();
  //   }
  // }

  onInput(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
  }

}
