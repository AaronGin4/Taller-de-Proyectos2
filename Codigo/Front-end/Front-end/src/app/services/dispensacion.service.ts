import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { API_URL } from '../conexion';

import {
  Paciente,
  Cuna,
  PaseDeVisita,
  RegistroLechePasteurizada,
  TipoLeche,
  Dispensacion
} from '../model/dispensacion';

@Injectable({
  providedIn: 'root'
})
export class DispensacionService {
  private apiUrl = `${API_URL}`;
  private pacienteUrl = `${this.apiUrl}/pacientes`;
private pasedevisitaUrl = `${this.apiUrl}/paseDeVisita`
  private lechepasteurizada = `${this.apiUrl}/registroLechePasteurizada`;
  private dispensacionUrl = `${this.apiUrl}/dispensacion`;

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('Error en servicio:', error);
    return throwError(() => new Error(error.message || 'Error del servidor'));
  }
  getPasesVisita(pacienteId: string): Observable<PaseDeVisita[]> {
    return this.http.get<PaseDeVisita[]>(
      `${this.pasedevisitaUrl}/paciente/${pacienteId}`
    ).pipe(
      catchError(error => {
        console.error('Error en getPasesVisita:', error);
        return throwError(() => new Error('Error obteniendo pases de visita'));
      })
    );
  }
getAllPasesDeVisita(): Observable<PaseDeVisita[]> {
  return this.http.get<PaseDeVisita[]>(`${this.pacienteUrl}`);
}

deleteLechePasteurizada(codigo: string): Observable<void> {
  return this.http.delete<void>(`${this.lechepasteurizada}/${codigo}`);
}

getPaciente(id: string): Observable<Paciente> {
  return this.http.get<Paciente>(`${this.pacienteUrl}/${id}`).pipe(
    catchError(error => {
      console.error('Error obteniendo paciente:', error);
      return throwError(() => new Error('Error cargando datos del paciente'));
    })
  );
}
getPacienteById(id: string) {
  return this.http.get(`${this.apiUrl}/pacientes/${id}`);
}
getUltimoPaseDeVisita(pacienteId: string): Observable<PaseDeVisita> {
  return this.http.get<PaseDeVisita>(
    `${this.pasedevisitaUrl}/ultimo/${pacienteId}`
  ).pipe(
    map(response => ({
      ...response,
      calostroterapia: response.calostroterapia || 'NO', 
      cantidadMlPorTomaDeLeche: response.cantidadMlPorTomaDeLeche || 0
    })),
    catchError(error => {
      console.error('Error detallado:', error);
      return throwError(() => new Error('Error obteniendo datos clave'));
    })
  );
}
 
actualizarPaseVisita(id: string, pase: PaseDeVisita): Observable<PaseDeVisita> {
  return this.http.put<PaseDeVisita>(`${this.pasedevisitaUrl}/${id}`, pase);
}
getDispensacionesPorPaciente(pacienteId: string): Observable<Dispensacion[]> {
  return this.http.get<Dispensacion[]>(`${this.dispensacionUrl}/paciente/${pacienteId}`);
}

getDispensacionById(id: string): Observable<Dispensacion> {
  return this.http.get<Dispensacion>(`${this.dispensacionUrl}/${id}`);
}

createDispensacion(dispensacion: Dispensacion): Observable<Dispensacion> {
  return this.http.post<Dispensacion>(`${this.apiUrl}/dispensacion`, dispensacion);
}
getDispensacionesActivas(idPaciente: string): Observable<Dispensacion[]> {
  return this.http.get<Dispensacion[]>(`${this.apiUrl}/dispensacion/paciente/${idPaciente}`);
}

updateDispensacion(id: number, dispensacion: Dispensacion): Observable<Dispensacion> {
    return this.http.put<Dispensacion>(`${this.apiUrl}/dispensacion/${id}`, dispensacion).pipe(
      catchError(error => {
        console.error('Error en updateDispensacion:', error);
        return throwError(() => error);
      })
    );
  }
getAllLechePasteurizada(): Observable<RegistroLechePasteurizada[]> {
  return this.http.get<RegistroLechePasteurizada[]>(`${this.lechepasteurizada}`).pipe(
    catchError(this.handleError)
  );
}

getUltimaDispensacion(paseVisitaId: string): Observable<Dispensacion | null> {
  return this.http.get<Dispensacion[]>(`${this.dispensacionUrl}/ultima/${paseVisitaId}`).pipe(
    map(dispensaciones => dispensaciones.length > 0 ? dispensaciones[0] : null)
  );
}
registrarLechePasteurizada(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reportePacientes`, data);
  }
registrarLecheLMD(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/reportePacientes`, data);
}

registrarFormulaMixta(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/reportePacientes`, data);
}
registrarLecheMixta(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/reportePacientes`, data);
}
registrarLechePasteurizadaFormula(data: any): Observable<any>{
  return this.http.post(`${this.apiUrl}/reportePacientes`, data);
}
 eliminarLotePasteurizada(codigo: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/registroLechePasteurizada/${codigo}`);
  }
  verificarLotePasteurizada(codigo: string) {
    return this.http.get(`${this.apiUrl}/registroLechePasteurizada/${codigo}`);
  }
  getReportePorPaciente(idPaciente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportePacientes${idPaciente}`);
  }
   getReportePacienteById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportePacientes/${id}`);
  }
  crearReportePaciente(reporte: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reportePacientes`, reporte);
  }
  actualizarReportePaciente(reporte: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reportePacientes/${reporte.idReportePaciente}`, reporte);
  }

saveSlotConfig(patientId: string, fecha: string, config: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/slot-config`, {
    patientId,
    fecha,
    configData: JSON.stringify(config)
  });
}
getSlotConfig(patientId: string, fecha: string): Observable<string> {
  return this.http.get(`${this.apiUrl}/slot-config/${patientId}/${fecha}`, 
    { responseType: 'text' } 
  );
}

deleteSlotConfig(patientId: string, fecha: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/slot-config/${patientId}/${fecha}`);
}
getReportesPorPaciente(idPaciente: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/reportePacientes/paciente/${idPaciente}`);
}
registrarPasteurizadaDispensada(data: any): Observable<any> {
    console.log(data)
  return this.http.post(`${this.apiUrl}/pasteurizada-dispensada`, data);
}

}