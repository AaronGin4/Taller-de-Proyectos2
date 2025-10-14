import { Component, OnInit } from '@angular/core';
import { MatTableModule } from
'@angular/material/table';
import { MatCardModule } from
'@angular/material/card';
import { MatButtonModule } from
'@angular/material/button';
import { MatToolbarModule } from
'@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { NavigationEnd, RouterModule } from
'@angular/router';
import { PacienteService } from
'../services/paciente.service';
import { Router } from '@angular/router';
import { pacientes } from '../model/paciente';
import { catchError, filter, map, of, Subscription, switchMap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
selector: 'app-pacientes',
standalone: true,
imports: [
CommonModule,
RouterModule,
MatTableModule,
MatCardModule,
MatButtonModule,
MatTooltipModule,
MatToolbarModule,
MatIconModule
],
templateUrl: './pacientes.component.html',
styleUrls: ['./pacientes.component.css'],
})
export default class PacientesComponent implements
OnInit {
    estadoDispensacionMap: { [key: string]: string } = {};

displayedColumns: string[] = [
'cuna',
'nombre',
'paseVisita',
'verPaseVisita',
'dispensacion',
  'estadoDispensacion'

];
pacientes: pacientes[] = [];
uciDataSource: any[] = [];
quirurgicoDataSource: any[] = [];
engordeDataSource: any[] = [];
intermedioDataSource: any[] = [];
private navigationSubscription!: Subscription;
constructor(
private pacienteService: PacienteService,
private router: Router
) { }
ngOnInit(): void {
this.cargarYFiltrarPacientes();
this.navigationSubscription = this.router.events
.pipe(filter(event => event instanceof NavigationEnd))
.subscribe(event => {
const currentUrl = this.router.url;
if (currentUrl.includes('/pacientes')) {
this.cargarYFiltrarPacientes();
}
});
}
ngOnDestroy(): void {
if (this.navigationSubscription) {
this.navigationSubscription.unsubscribe();
}
}
cargarYFiltrarPacientes(): void {
  this.pacienteService.getPacientes().pipe(
    switchMap((lista: pacientes[]) => {
      const pacientesFiltrados = lista.filter(p => p.estado === 'Paciente en atención');

      const observables = pacientesFiltrados.map(p =>
        this.pacienteService.getDispensacionHoyPorPaciente(p.idPaciente).pipe(
          map(dispensacion => {
  const pase = (dispensacion as any)?.paseDeVisita;
  const nroTomasPrescritas = pase?.nroDeTomasDeLeche || 0;

  // Si no hay pase de visita, devolvemos ⛔
  if (!pase || nroTomasPrescritas === 0) {
    return {
      paciente: p,
      estadoDispensacion: '⛔'
    };
  }

  // Contar tomas con "Si"
  const tomasCompletadas = Array.from({ length: 16 }, (_, i) => `toma${i + 1}`)
    .map(tomaKey => (dispensacion as any)?.[tomaKey])
    .filter(valor => valor === 'Si').length;

  const estado = tomasCompletadas >= nroTomasPrescritas ? '✅' : '😟';
  return {
    paciente: p,
    estadoDispensacion: estado
  };
}),
  catchError(err => {
            console.warn(`❌ No se encontró dispensación para paciente ${p.idPaciente}`, err);
            return of({ paciente: p, estadoDispensacion: '😟' });
          })
        )
      );

      return forkJoin(observables);
    })
  ).subscribe({
    next: (resultados) => {
      this.uciDataSource = [];
      this.quirurgicoDataSource = [];
      this.intermedioDataSource = [];
      this.engordeDataSource = [];

      resultados.forEach(({ paciente, estadoDispensacion }) => {
        const area = paciente.area.toUpperCase().trim();
        const pacienteEstructurado = this.estructurarPaciente(paciente, estadoDispensacion);

        switch (area) {
          case 'UCIN':
            this.uciDataSource.push(pacienteEstructurado);
            break;
          case 'UCIN QUIRÚRGICO':
            this.quirurgicoDataSource.push(pacienteEstructurado);
            break;
          case 'INTERMEDIO':
            this.intermedioDataSource.push(pacienteEstructurado);
            break;
          case 'ENGORDE':
            this.engordeDataSource.push(pacienteEstructurado);
            break;
          default:
            console.warn('Área no reconocida:', area, paciente);
        }
      });
    },
    error: (err) => console.error('❌ Error al cargar pacientes con dispensación:', err)
  });
}
private estructurarPaciente(p: pacientes, estadoDispensacion: string): any {
  const cunaNumber = p.cuna?.idCuna ? p.cuna.idCuna.toString() : 'Sin cuna';

  return {
    idPaciente: p.idPaciente,
    cunaNumber: cunaNumber,
    nombre: [p.nombrePaciente, p.apellidoPaternoPaciente ?? '', p.apellidoMaternoPaciente ?? ''].join(' ').trim(),
    estadoDispensacion: estadoDispensacion
  };
}

}
