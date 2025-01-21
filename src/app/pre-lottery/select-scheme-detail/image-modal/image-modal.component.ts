import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import SwiperCore, { Zoom, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Zoom]);

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['../../pre-lottery.component.scss', './image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;
  @Input() img: string;
  config: SwiperOptions = {
    zoom: true
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit(): void { }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  zoom(zoomIn: boolean) {
    const zoom = this.swiper.swiperRef.zoom;
    zoomIn ? zoom.in() : zoom.out();
  }

}
