import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DiagnosticoPaciente } from '../model/diagnosticopaciente.interface';
import { catchError, Observable, of } from 'rxjs';
import { API_URL } from '../conexion';


@Injectable({
  providedIn: 'root'
})
export class DiagnosticoPacienteService {

  private apiUrl = `${API_URL}/diagnosticos`;

  constructor(private http: HttpClient) {}

  obtenerPorId(id: string): Observable<DiagnosticoPaciente> {
    return this.http.get<DiagnosticoPaciente>(`${this.apiUrl}/${id}`);
  }

  guardar(diagnostico: DiagnosticoPaciente): Observable<DiagnosticoPaciente> {
    return this.http.post<DiagnosticoPaciente>(this.apiUrl, diagnostico);
  }

  actualizar(id: string, diagnostico: DiagnosticoPaciente): Observable<DiagnosticoPaciente> {
    return this.http.put<DiagnosticoPaciente>(`${this.apiUrl}/${id}`, diagnostico);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  listary(): Observable<DiagnosticoPaciente[]> {
    return this.http.get<DiagnosticoPaciente[]>(this.apiUrl);
  }
}
