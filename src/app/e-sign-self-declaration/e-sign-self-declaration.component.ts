import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e-sign-self-declaration',
  templateUrl: './e-sign-self-declaration.component.html',
  styleUrls: ['./e-sign-self-declaration.component.scss'],
})
export class ESignSelfDeclarationComponent implements OnInit {

  consentAccepted = false;
  pdfSrc: any = '/assets/self_declaration.pdf';
  isVisible = false;
  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.setItem('lastRoute', this.router.url);
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
  }

}
