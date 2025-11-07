import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../conexion';


@Injectable({
  providedIn: 'root'
})
export class ReportesPacienteService {

  constructor(private http: HttpClient) { }

  obtenerReportePorPacientes(idPaciente: string): Observable<any> {
    return this.http.get(`${API_URL}/reportePacientes/paciente/${idPaciente}`);
  }

}