import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../conexion';

@Injectable({
  providedIn: 'root'
})
export class PasteurizadaDispensadaService {

  private baseUrl = `${API_URL}/pasteurizada-dispensada`;

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  obtenerPorIdPaciente(idPaciente: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/paciente/${idPaciente}`);
  }

  crearPasteurizadaDispensada(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

}
