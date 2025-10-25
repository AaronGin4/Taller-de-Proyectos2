import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../conexion';
import { Madre } from '../model/madre.interface'
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MadreService {

  private http = inject(HttpClient);
  private cache = new Map<string, Madre>();

  // Método para crear una nueva madre
  create(madre: any) {
    return this.http.post(`${API_URL}/madres`, madre);
  }

  // Otros métodos como listar o obtener detalles de madres
  list() {
    return this.http.get(`${API_URL}/madres`);
  }
  getById(idMadre: string) {
          if (this.cache.has(idMadre)) {
            return of(this.cache.get(idMadre)!);
          }
          return this.http.get<Madre>(`${API_URL}/madres/${idMadre}`).pipe(
            tap(data => this.cache.set(idMadre, data))
          );
  }

  subirConsentimiento(idMadre: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${API_URL}/madres/${idMadre}/subir-consentimiento`, formData);
  }
  getByPacienteId(idPaciente: string) {
    return this.http.get<Madre[]>(`${API_URL}/madres`).pipe(
      map((madres: Madre[]) =>
        madres.find(madre => madre.paciente?.idPaciente === idPaciente) || null
      )
    );
  }

  update(idMadre: string, madre: any) {
    return this.http.put(`${API_URL}/madres/${idMadre}`, madre);
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/madres/${id}`);
  }

    updateByDni(dni: string, data: any): Observable<any> {
    // Suponiendo que tu backend acepta PUT/PATCH en /madres/dni/:dni
    return this.http.patch(`${API_URL}/dni/${dni}`, data);
  }

  actualizarIdMadre(idMadreActual: string, nuevoId: string): Observable<any> {
    return this.http.patch(`${API_URL}/madres/${idMadreActual}/actualizar-id`, {
      nuevoId: nuevoId
    });
  }

}
