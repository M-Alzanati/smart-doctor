import { Component, OnInit } from '@angular/core';
import { PatientService } from './patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  fileData: any;
  previewUrl: any;
  fileUploadProgress: string = '';
  uploadedFilePath: string = '';
  fileName: string;

  constructor(private patientService: PatientService) {
  }

  ngOnInit(): void {
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    if (this.fileData) {
      this.fileName = this.fileData.name;
    }
    this.preview();
  }

  preview() {
    var mimeType = this.fileData?.type;
    if (mimeType?.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  uploadBpImage() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.patientService.uploadImage(formData)
      .subscribe(
        (data) => {
          debugger;
        },
        (error) => {
          debugger;
        }
      )
  }
}
