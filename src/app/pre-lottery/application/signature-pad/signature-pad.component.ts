import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { PreLotteryApplicationService } from '../../services/pre-lottery-application.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['../../pre-lottery.component.scss', './signature-pad.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class SignaturePadComponent implements OnInit, AfterViewInit {
  signaturePad: SignaturePad;
  @ViewChild('canvas') canvasEl : ElementRef;
  @ViewChild('canvasContainer') canvasContainer : ElementRef;
  platform: string;

  constructor(private modalCtrl: ModalController, 
    private screenOrientation: ScreenOrientation, private preLotteryApplicationService: PreLotteryApplicationService,
    private translocoService: TranslocoService) { }
  
  ngOnInit(): void {
    this.platform = localStorage.getItem("platform");
    if(this.platform !== 'browser' && this.platform !== 'browser-local') {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }
  }
  
  ngAfterViewInit(): void {
    let canvas = this.canvasEl.nativeElement;
    this.signaturePad = new SignaturePad(canvas);
    this.onResize(null, 500, 250);
  }

  onResize(event, width, height) {
    console.log('resize triggered--', event?.target?.innerWidth, event?.target?.innerHeight,'or oninit', width, height);
    let canvas = this.canvasEl.nativeElement;
    if(event) {
      canvas.width = 0.75 * event.target.innerWidth;
      canvas.height = 0.8 * event.target.innerHeight;
      console.log(canvas.width, canvas.height);
    }
    else {
      canvas.width = width;
      canvas.height = height;
      console.log(canvas.width, canvas.height);
    }

    // canvas.getContext("2d").scale(1, 1);

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  cancel() {
    if(this.platform !== 'browser' && this.platform !== 'browser-local') {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  startDrawing(event: Event) {
    console.log(event);
  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    console.log(this.signaturePad.isEmpty());
    if(!this.signaturePad.isEmpty()) {
      if(this.platform !== 'browser' && this.platform !== 'browser-local') {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
      const base64Data = this.signaturePad.toDataURL();
      return this.modalCtrl.dismiss(base64Data, 'submit');
    }
    else {
      this.preLotteryApplicationService.showErrorToast(this.translocoService.translate('error-signature', null, this.translocoService.getActiveLang()));
    }
  }
}
