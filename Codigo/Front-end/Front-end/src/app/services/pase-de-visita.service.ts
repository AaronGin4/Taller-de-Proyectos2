import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { PaseDeVisita, Paciente } from '../model/pase-de-visita';
import { API_URL } from '../conexion';

@Injectable({
  providedIn: 'root'
})
export class PaseDeVisitaService {
  private apiUrl = `${API_URL}/paseDeVisita`;
  private pacientesUrl = `${API_URL}/pacientes`;
  constructor(private http: HttpClient) { }


  getUltimoNumero(idPaciente: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/ultimoNumero/${idPaciente}`);
  }
  getUltimoPase(pacienteId: string): Observable<PaseDeVisita> {
    return this.http.get<PaseDeVisita>(`${this.apiUrl}/ultimo/${pacienteId}`);
  }
// En pase-de-visita.service.ts
getPaciente(id: string): Observable<any> {
  return this.http.get(`${this.pacientesUrl}/${id}`); // Usar pacientesUrl
}
// pase-de-visita.service.ts
crearPase(paseData: any): Observable<any> {
  return this.http.post(this.apiUrl, paseData);
}

getPasesByPaciente(idPaciente: string): Observable<PaseDeVisita[]> {
  return this.http.get<PaseDeVisita[]>(`${this.apiUrl}/where/${idPaciente}`);
}


actualizarAreaPaciente(idPaciente: string, area: string): Observable<any> {
  return this.http.patch(`${this.pacientesUrl}/${idPaciente}/area`, { area })
    .pipe(
      catchError(error => {
        console.error('Error actualizando área:', error);
        return of(null); 
      })
    );
}
   actualizarCantidadToma(idPase: number, cantidad: number): Observable<PaseDeVisita> {
    return this.http.patch<PaseDeVisita>(
      `${this.apiUrl}/${idPase}/cantidad-toma`,
      { cantidadMlPorTomaDeLeche: cantidad }
    ).pipe(
      catchError(error => {
        console.error('Error actualizando cantidad por toma:', error);
        return throwError(() => error);
      })
    );
  }
  actualizarParcial(id: number, data: any): Observable<PaseDeVisita> {
  return this.http.patch<PaseDeVisita>(`${this.apiUrl}/${id}`, data);
}

}