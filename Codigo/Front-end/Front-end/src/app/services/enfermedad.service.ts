import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Enfermedad } from '../model/enfermedad.interface';
import { catchError, of } from 'rxjs';  
import { API_URL } from '../conexion';

@Injectable({
  providedIn: 'root'
})
export class EnfermedadService {

  private http = inject(HttpClient);
  private baseUrl = `${API_URL}/enfermedades`;

  // Obtener todas las enfermedades
  listarTodas() {
    return this.http.get<Enfermedad[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error al listar enfermedades:', error);
        return of([]);
      })
    );
  }

  // Buscar por ID
  buscarPorId(id: string) {
    return this.http.get<Enfermedad>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al buscar enfermedad con ID ${id}:`, error);
        return of(null);
      })
    );
  }

  // Guardar nueva enfermedad
  guardar(enfermedad: Enfermedad) {
    return this.http.post<Enfermedad>(this.baseUrl, enfermedad).pipe(
      catchError(error => {
        console.error('Error al guardar enfermedad:', error);
        return of(null);
      })
    );
  }

  // Actualizar enfermedad
  actualizar(id: string, enfermedad: Enfermedad) {
    return this.http.put<Enfermedad>(`${this.baseUrl}/${id}`, enfermedad).pipe(
      catchError(error => {
        console.error(`Error al actualizar enfermedad con ID ${id}:`, error);
        return of(null);
      })
    );
  }

  // Eliminar enfermedad
  eliminar(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al eliminar enfermedad con ID ${id}:`, error);
        return of(null);
      })
    );
  }
}
