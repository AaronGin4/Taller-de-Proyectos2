import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, catchError, of, switchMap, throwError } from 'rxjs';
import { pacientes } from '../model/paciente';
import { Paciente } from '../model/paciente.interface';
import { API_URL } from '../conexion';
import { Dispensacion } from '../model/dispensacion';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = `${API_URL}/pacientes`;

  private baseUrl = `${API_URL}/pacientes`;

  constructor(private http: HttpClient) { }
  private pacientesUpdated = new Subject<void>();

  getPacientesUpdatedListener() {
    return this.pacientesUpdated.asObservable();
  }


  getPacientes(): Observable<pacientes[]> {
    return this.http.get<pacientes[]>(this.apiUrl);
  }
  getPacienteById(id: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }
  actualizarAreaPaciente(idPaciente: string, area: string): Observable<Paciente> {
    return this.http.patch<Paciente>(
      `${this.apiUrl}/${idPaciente}/area`,
      { area }
    ).pipe(
      catchError(error => {
        console.error('Error en servicio:', error);
        return throwError(() => new Error('Error actualizando área')); // Propaga el error
      })
    );
  }
  // Obtener todos los pacientes
  list() {
    return this.http.get<Paciente[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error al listar pacientes:', error);
        return of([]);
      })
    );
  }

  // Obtener un paciente por ID
  get(id: string) {
    return this.http.get<Paciente>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener paciente:', error);
        return of(null);
      })
    );
  }

  // Crear un nuevo paciente
  create(paciente: Paciente) {
    return this.http.post<Paciente>(this.baseUrl, paciente).pipe(
      catchError(error => {
        console.error('Error al crear paciente:', error);
        return of(null);
      })
    );
  }

  // Actualizar un paciente existente
  update(idPaciente: string, paciente: any) {
    return this.http.put(`${API_URL}/pacientes/${idPaciente}`, paciente);
  }

  // Eliminar un paciente por ID
  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar paciente:', error);
        return of(null);
      })
    );
  }
getDispensacionHoyPorPaciente(idPaciente: string): Observable<Dispensacion | null> {
  const url = `${API_URL}/dispensacion/hoy/${idPaciente}`;
  return this.http.get<Dispensacion | null>(url);
}

}