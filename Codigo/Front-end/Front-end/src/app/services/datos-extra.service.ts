import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { API_URL } from '../conexion';

@Injectable({
  providedIn: 'root'
})
export class DatosExtraService {

  constructor(private http: HttpClient) { }

  obtenerDatosExtra(): Observable<any> {
    return this.http.get(`${API_URL}/datos-extra`);
  }

  registrarDatosExtra(datos: any): Observable<any> {
    return this.http.post(`${API_URL}/datos-extra`, datos);
  }

}