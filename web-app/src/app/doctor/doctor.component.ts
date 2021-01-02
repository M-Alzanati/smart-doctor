import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, MessageBoxComponent } from '../common/message-box/message-box.component';
import { DoctorService } from './doctor.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  patients: PatientViewModel[] = [];
  selectedPatient: PatientViewModel;
  displayedColumns: string[] = ['date', 'value'];
  dataSource: BloodPressureElement[] = [];

  constructor(private doctorService: DoctorService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.doctorService.getAllPatients().subscribe(
      (data: any) => {
        for (let d of data) {
          this.patients.push({
            value: d['email'],
            viewValue: `${d['first_name']} ${d['last_name']}`
          });
        }
      },
      (error) => {
        let err: DialogData = { title: 'Error', content: error.message };
          this.dialog.open(MessageBoxComponent, { data: err});
      }
    );
  }

  doctorChange(event: any) {
    this.dataSource = [];
    
    this.doctorService.getPatientPressureHistory(event.value).subscribe(
      (data: any) => {
        let parsedData: BloodPressureElement[] = [];
        for (let d of data) {
          parsedData.push({ date: d['date'], value: d['value'] });
        }
        this.dataSource = parsedData;
      },
      (error) => {
        let err: DialogData = { title: 'Error', content: error.message };
        this.dialog.open(MessageBoxComponent, { data: err});
      });
  }
}

export interface PatientViewModel {
  value: string;
  viewValue: string;
}

export interface BloodPressureElement {
  date: string;
  value: number;
}