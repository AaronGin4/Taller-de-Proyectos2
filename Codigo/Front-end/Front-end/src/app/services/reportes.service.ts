import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { API_URL } from '../conexion';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  obtenerReportePacientes(): Observable<any> {
    return this.http.get(`${API_URL}/reportePacientes`);
  }

  obtenerPacientes(): Observable<any> {
    return this.http.get(`${API_URL}/pacientes`);
  }

  obtenerEnfermedadesPaciente(): Observable<any> {
    return this.http.get(`${API_URL}/enfermedades-paciente`);
  }
  
  crearReportePaciente(reporte: any): Observable<any> {
    return this.http.post(`${API_URL}/reportePacientes`, reporte);
  }

}
