import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { RegistroLeche } from '../model/registro-leche-donadora';
import { API_URL } from '../conexion';


@Injectable({
  providedIn: 'root'
})
export class RegistroLecheService {
  private http = inject(HttpClient)   

getUltimoNumeroLD(idDonadora: string): Observable<number> {
  return this.http.get<number>(`${`${API_URL}/registroLecheCrudaDonadoras`}/ultimoNumero/${idDonadora}`);
}

crearRegistro(registros: RegistroLeche[]): Observable<any> {
  return this.http.post(`${API_URL}/registroLecheCrudaDonadoras`, registros);
}
getRegistrosPorDonadora(idDonadora: string): Observable<RegistroLeche[]> {
  return this.http.get<RegistroLeche[]>(`${API_URL}/registroLecheCrudaDonadoras/porDonadora/${idDonadora}`);
}
}