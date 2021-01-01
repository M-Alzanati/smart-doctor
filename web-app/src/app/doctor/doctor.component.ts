import { Component, OnInit } from '@angular/core';
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

  constructor(private doctorService: DoctorService) {

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
        debugger;
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