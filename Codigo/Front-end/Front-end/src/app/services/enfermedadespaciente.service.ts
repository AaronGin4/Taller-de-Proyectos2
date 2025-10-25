import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnfermedadesPaciente } from '../model/enfermedadespaciente.interface';
import { catchError, of } from 'rxjs';
import { API_URL } from '../conexion';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EnfermedadespacienteService {
  private apiUrl = `${API_URL}/enfermedades-paciente`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<EnfermedadesPaciente[]> {
    return this.http.get<EnfermedadesPaciente[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: string): Observable<EnfermedadesPaciente> {
    return this.http.get<EnfermedadesPaciente>(`${this.apiUrl}/${id}`);
  }

  guardar(enfermedadPaciente: EnfermedadesPaciente): Observable<EnfermedadesPaciente> {
    return this.http.post<EnfermedadesPaciente>(`${this.apiUrl}`, enfermedadPaciente);
  }

  actualizar(id: string, enfermedadPaciente: EnfermedadesPaciente): Observable<EnfermedadesPaciente> {
    return this.http.put<EnfermedadesPaciente>(`${this.apiUrl}/${id}`, enfermedadPaciente);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

// enfermedadespaciente.service.ts
  obtenerPorDiagnosticoPaciente(idDiagnosticoPaciente: string): Observable<EnfermedadesPaciente[]> {
    return this.http.get<EnfermedadesPaciente[]>(
      `${this.apiUrl}/where/${idDiagnosticoPaciente}`
    ).pipe(
      catchError(error => {
        console.error('Error al obtener enfermedades por diagnóstico:', error);
        return of([]); // Siempre devuelve un array vacío
      })
    );
  }
}