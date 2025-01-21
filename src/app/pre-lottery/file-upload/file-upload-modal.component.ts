import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-secure-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.scss']
})
export class FileUploadModalComponent implements OnInit {
  isSubmitDisabled: boolean;
  form: FormGroup = new FormGroup({});
  selectedFile: File;
  @ViewChild('localForm') localForm : NgForm;
  type: string;
  
  constructor(private modalCtrl: ModalController) { }

  ngOnInit(): void { 
    this.form = new FormGroup({
      file: new FormControl(null, [Validators.required])
    });
  }

  onCancel() {
    return this.modalCtrl.dismiss(null, 'close');
  }

  onSubmit() {
    if (this.form.valid) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        return this.modalCtrl.dismiss(reader.result, 'submit');
      };
    }
    else {
      this.isSubmitDisabled = false;
      alert('Please upload - '+this.type);
    }
  }

  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
  }
}
