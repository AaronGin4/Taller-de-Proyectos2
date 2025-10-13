// registro-autologa.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../conexion';

@Injectable({
  providedIn: 'root'
})
export class RegistroAutologaService {
  private apiUrl = `${API_URL}/registroLecheCruda`;
  private madresUrl = `${API_URL}/madres`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMadreById(idMadre: string): Observable<any> {
    return this.http.get<any>(`${this.madresUrl}/${idMadre}`);
  }

  createRegistro(registro: any): Observable<any> {
    const body = {
      cantidad: registro.cantidad,
      hora: registro.hora,
      madre: {
        idMadre: registro.idMadre
      }
    };
    return this.http.post<any>(this.apiUrl, body);
  }
}