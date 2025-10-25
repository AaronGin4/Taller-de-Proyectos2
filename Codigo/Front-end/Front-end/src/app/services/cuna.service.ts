import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuna, TiempoPacienteCuna } from '../model/tiempopacientecuna.interface';
import { Observable } from 'rxjs';
import { API_URL } from '../conexion';

@Injectable({
  providedIn: 'root'
})
export class CunaService {
  private apiUrl = `${API_URL}/cunas`; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  list(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  listarRelaciones(): Observable<TiempoPacienteCuna[]> {
    return this.http.get<TiempoPacienteCuna[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<Cuna> {
    return this.http.get<Cuna>(`${this.apiUrl}/${id}`);
  }
  
  actualizar(cuna: Cuna): Observable<Cuna> {
    return this.http.put<Cuna>(`${this.apiUrl}/${cuna.idCuna}`, cuna);
  }

  
}
