import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = false;

  isDarkMode() {
    console.log('this.darkMode ',this.darkMode);
    return this.darkMode;
  }

  setDarkMode(isDarkMode: boolean) {
    console.log('this.darkMode ',this.darkMode);
    this.darkMode = isDarkMode;
    // console.log(this.darkMode);
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.setAttribute('color-theme','dark');
      console.log(document.body.classList);

      // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      // prefersDark.addEventListener('change', (mediaQuery) => this.toggleDarkPalette(isDarkMode));
    } else {
      document.body.classList.remove('dark-theme');
      document.body.setAttribute('color-theme','light');
      console.log(document.body.classList);
      // window.location.reload();
      // document.documentElement.classList.toggle('ion-palette-dark', false);
    }
  }

  setFontSize(cnt: number) {
    console.log('cnt call setFontSize',cnt);
    console.log()
    // document.body.classList.remove('font16px', 'font20px', 'font24px');

    // switch (cnt) {
    //     case 1:
    //         document.body.classList.add('font16px');
    //         break;
    //     case 2:
    //         document.body.classList.add('font20px');
    //         break;
    //     case 3:
    //         document.body.classList.add('font24px');
    //         break;
    //     default:
    //         break;
    // }

    const root = document.querySelector(':root');
    

    const parent = document.body;
    
    root.classList.remove('font10px','font12px','font14px',
              'font16px','font18px','font20px', 'font22px');
    // children.forEach(child => {
    //     child.classList.remove('font16px', 'font20px', 'font22px','font24px');
    // });

    switch (cnt) {
      case -3:
        
      root.classList.add('font10px');
        break;
      case -2:
        root.classList.add('font12px');
        break;
      case -1:
        root.classList.add('font14px');
        break;
      case 0:
        root.classList.add('font16px');
        break;
      case 1:
        // document.rootElement.classList.add('font18px');
        root.classList.add('font18px');
        // parent.classList.add('font18px');
        break;
      case 2:
        root.classList.add('font20px');
        break;
      case 3:
        root.classList.add('font22px');
        break;
      default:
        break;
    }
  }


  toggleDarkPalette(shouldAdd) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

}