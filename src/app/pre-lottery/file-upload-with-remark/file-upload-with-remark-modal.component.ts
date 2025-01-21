import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';

@Component({
  selector: 'app-secure-file-upload-modal',
  templateUrl: './file-upload-with-remark-modal.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class FileUploadWithRemarkModalComponent implements OnInit {
  @Input() headingLabel: string;
  @Input() remarkLabel: string;
  @Input() uploadBtnLabel: string;

  isSubmitDisabled: boolean;
  form: FormGroup = new FormGroup({});
  selectedFile: File;
  @ViewChild('localForm') localForm : NgForm;
  type: string;
  cancelNocLetter: File;
  cancelNocLetterBase64: string;
  
  constructor(private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit(): void { 
    this.form = new FormGroup({
      remark: new FormControl(null, [Validators.required])
    });
  }

  onCancel() {
    return this.modalCtrl.dismiss(null, 'close');
  }

  cancelNocLtrUpload(event1) {
    this.cancelNocLetter = event1.target.files[0];

    this.cancelNocLetter = event1.target.files[0];
    if (this.cancelNocLetter && this.cancelNocLetter.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.cancelNocLetterBase64 = reader.result as string;
        console.log(this.cancelNocLetterBase64);
      };

      reader.readAsDataURL(this.cancelNocLetter);
    } else {
      this.showErrorToast("Please select a valid PDF file.");
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

  async successToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }

  onSubmit() {
    if (this.form.valid) {
      if(this.cancelNocLetter !=null && this.cancelNocLetterBase64 !=null){
        if(this.cancelNocLetter.size >0 && this.cancelNocLetterBase64.length >0){
          return this.modalCtrl.dismiss({remark: this.form.value.remark, cancelNocLetterBase64: this.cancelNocLetterBase64});
        }else{
          alert('Please upload File');
        }
      }else{
        alert('Please upload File');
      }
    }
    else {
      alert('Please enter remark');
    }
  }
}
