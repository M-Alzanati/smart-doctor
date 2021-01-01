import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  jsonHeader = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient) {

  }

  getAllPatients() {
    return this.http.get(
      API_URL + '/get_patients',
      this.jsonHeader,
    );
  }

  getPatientPressureHistory(email: string) {
    return this.http.post(
      API_URL + '/get_patients_bp_data',
      {
        'email': email
      },
      this.jsonHeader,
    );
  }
}
