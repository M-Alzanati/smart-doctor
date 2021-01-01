import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { API_URL } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  
  constructor(private http: HttpClient) { }

  uploadImage(image: FormData) {
    return this.http.post(
      API_URL + '/upload_bp_image',
      image
    )
  }
}
