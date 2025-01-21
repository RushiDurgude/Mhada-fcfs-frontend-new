import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ImageCroppedEvent, ImageTransform, LoadedImage } from "ngx-image-cropper";
@Component({
  selector: "app-crop-image",
  templateUrl: "./crop-image.component.html",
  styleUrls: ["./crop-image.component.scss"],
})
export class CropImageComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<CropImageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  imageChangedEvent: any = "";
  croppedImage: any = "";
  canvasRotation = 0;
  transform: ImageTransform = {};
  ngOnInit() {
    this.imageChangedEvent = this.data;
  }

  fileChangeEvent(event: any): void {
    // this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  close() {
    this.dialogRef.close(this.croppedImage);
  }
}
