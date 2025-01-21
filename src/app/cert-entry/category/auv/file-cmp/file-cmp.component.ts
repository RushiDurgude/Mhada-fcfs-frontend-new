import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cert-entry-file-cmp',
  templateUrl: './file-cmp.component.html',
  styleUrls: ['../../../../pre-lottery/pre-lottery.component.scss', './file-cmp.component.scss']
})
export class FileCmpComponent implements OnInit {

  @Input() fieldName: any;
  @Input() fieldLabel: string;
  @Input() fieldValue: string | ArrayBuffer;
  @Input() formSubmitted: boolean;
  @Input() fileName: string;
  @Input() pageMode: string;
  @Input() controlName: AbstractControl<any, any>;
  @Input() formGroup: FormGroup<any>;
  @Input() disabled: boolean = false;
  @Input() template: string;
  @Input() limit: number;
  @Input() help: string;
  @Output() fileSelect = new EventEmitter<string | ArrayBuffer>();
  uploadedFileName: string;

  constructor(private toastController: ToastController) { }

  ngOnInit(): void {
    console.log('limit1', this.fieldName, this.fieldLabel, this.fieldValue, this.formSubmitted, 
    this.fileName, this.pageMode, this.controlName, this.formGroup, this.limit);
  }

  async downloadFile() {
    let platform = localStorage.getItem("platform");
    if (platform == "android" || platform == "ios") {
      try {
        let ret = await Filesystem.mkdir({
          path: "ihlms",
          directory: Directory.Documents,
          recursive: false,
        });
        console.log("folder ", ret);
      } catch (e) {
        console.log("Folder already exists");
      }

      await Filesystem.writeFile({
        path: "ihlms/"+this.fileName,
        data: "data:application/pdf;base64," + this.fieldValue,
        directory: Directory.Documents,
      });

      const toast = await this.toastController.create({
        message: this.fileName+" Downloaded in Documents folder",
        icon: "information-circle",
        position: "top",
        cssClass: "toast success-toast",
        duration: 2000,
      });
      toast.present();
    } else {
      // const src = `data:application/pdf;base64,${this.fieldValue}`;
      // const link = document.createElement("a");
      // link.href = src;
      // link.download = this.fileName;
      // link.click();      
      // link.remove();
      const byteArray = new Uint8Array(
        atob(this.fieldValue.toString())
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      let blob = new Blob([byteArray], { type: "application/pdf" });
      let pdfSrc = URL.createObjectURL(blob);
      window.open(pdfSrc, "_blank");
    }
  }

  onFileSelect(event) {
    console.log('limit2', this.limit);
    console.log('selected file', event.target.files[0]);
    this.uploadedFileName = null;
    if(event.target.files[0]) {
      if(event.target.files[0].size <= this.limit * 1000 * 1024) {
        if(event.target.files[0].type === 'application/pdf') {
          const reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            this.fieldValue = reader.result;
            this.fileSelect.emit(this.fieldValue);
            this.uploadedFileName = event.target.files[0].name;
          };
        }
        else {
          this.showErrorToast("Please select PDF File");  
        }
      }
      else {
        this.showErrorToast("Please select File upto - "+this.limit+"MB");
      }
    }
  }

  async showErrorToast(errorMessage: string) {
    const toast = await this.toastController.create({
        message: errorMessage,
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 4000,
    });
    toast.present();
  }
}
