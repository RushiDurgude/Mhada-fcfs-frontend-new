import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-refund-detail',
  templateUrl: './refund-detail.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class RefundDetailComponent implements OnInit {
  refundDate: string;
  refundMessage: string;

  constructor(private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit(): void { 
    
  }

  

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
