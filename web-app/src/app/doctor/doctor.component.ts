import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, MessageBoxComponent } from '../common/message-box/message-box.component';
import { DoctorService } from './doctor.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
      },
    }
  };

  public pieChartLabels: Label[] = [['High Blood Pressure > 120'], ['Low Blood Pressure < 80'], ['unspacified']];
  public pieChartData: number[] = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.5)', 'rgba(0,255,0,0.7)', 'rgba(0,0,255,0.7)'],
    },
  ];

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
        this.dialog.open(MessageBoxComponent, { data: err });
      }
    );

    this.doctorService.getAllPatientsData().subscribe(
      (data: any) => {
        let total = data.length;
        let highCount = 0;
        let lowCount = 0;

        for (let d of data) {
          let high = d['high'];
          let low = d['low'];

          if (high > 120)
            highCount++;
          else if (low < 80)
            lowCount++;
        }

        let highPercent = (highCount / total) * 100;
        let lowPercent = (lowCount / total) * 100;
        let unspacified = 100 - (highPercent + lowPercent);
        
        this.pieChartData[0] = highPercent;
        this.pieChartData[1] = lowCount;
        this.pieChartData[2] = unspacified;
      },
      (error) => {
        let err: DialogData = { title: 'Error', content: error.message };
        this.dialog.open(MessageBoxComponent, { data: err });
      }
    )
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
        this.dialog.open(MessageBoxComponent, { data: err });
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