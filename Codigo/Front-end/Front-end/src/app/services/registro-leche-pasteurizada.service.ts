import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../conexion';

@Injectable({
  providedIn: 'root'
})
export class RegistroLechePasteurizadaService {
  private apiUrl = `${API_URL}/registroLechePasteurizada`;

  constructor(private http: HttpClient) {}

  getLeches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener las leches:', error);
        return throwError(() => new Error('Error al obtener las leches'));
      })
    );
  }

  registrarLeche(leche: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, leche).pipe(
      catchError(error => {
        console.error('Error al registrar la leche:', error);
        return throwError(() => new Error('Error al registrar la leche'));
      })
    );
  }
  verificarCodigoExistente(codigo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${codigo}`);
  }

  eliminarLeche(codigo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${codigo}`);
  }

}
