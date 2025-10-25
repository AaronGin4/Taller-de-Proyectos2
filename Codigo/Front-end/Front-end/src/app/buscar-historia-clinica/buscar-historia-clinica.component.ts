import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PacienteService } from '../services/paciente.service';
import { CunaService } from '../services/cuna.service';
import { Paciente } from '../model/paciente.interface';
import { Cuna } from '../model/cuna.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-historia-clinica',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './buscar-historia-clinica.component.html',
  styleUrl: './buscar-historia-clinica.component.css'
})
export default class BuscarHistoriaClinicaComponent implements OnInit {
  private pacienteService = inject(PacienteService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  formBusqueda = this.fb.control('', Validators.required);
  form!: FormGroup;
  pacientesRecientes: any[] = []; // Lista de pacientes recientes
  cargandoPacientes = false;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarPacientesRecientes();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      idPaciente: [''],
      nombrePaciente: [{ value: '', disabled: true }],
      apellidoPaternoPaciente: [{ value: '', disabled: true }],
      apellidoMaternoPaciente: [{ value: '', disabled: true }],
      fechaNacimientoPaciente: [{ value: '', disabled: true }],
      generoPaciente: [{ value: '', disabled: true }],
      dniMadre: [{ value: '', disabled: true }],
      cuna: this.fb.group({
        idCuna: [{ value: '', disabled: true }]
      }),
      diagnosticoPaciente: this.fb.group({
        idDiagnosticoPaciente: [{ value: '', disabled: true }],
        observacionEnfermedad: [{ value: '', disabled: true }]
      })
    });
  }
  private buscarPorDNIMadre(dniMadre: string) {
    this.pacienteService.list().pipe(
      catchError(error => {
        console.error('Error al buscar por DNI de madre:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al buscar pacientes',
          confirmButtonColor: '#d33'
        });
        return of([]);
      })
    ).subscribe(pacientes => {
      // Filtrar localmente los pacientes con el DNI de madre
      const pacientesFiltrados = pacientes.filter(p => p.dniMadre === dniMadre);

      if (pacientesFiltrados.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No encontrado',
          text: 'No se encontraron pacientes con ese DNI de madre',
          confirmButtonColor: '#3085d6'
        });
      } else if (pacientesFiltrados.length === 1) {
        // Si solo hay un resultado, autocompletar directamente
        this.form.patchValue(pacientesFiltrados[0]);
        // this.formBusqueda.setValue(pacientesFiltrados[0].idPaciente);
      } else {
        // Si hay múltiples resultados, mostrarlos en la lista de recientes
        this.pacientesRecientes = pacientesFiltrados
          .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime());

        Swal.fire({
          icon: 'info',
          title: `${pacientesFiltrados.length} pacientes encontrados`,
          text: 'Seleccione uno de la lista',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  onInputCuna(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase();

    // Asegurar que solo tenga una letra (C o I) seguida de -
    if (/^[CI]?$/.test(value)) {
      value = value.toUpperCase();
    } else if (/^[CI]-?$/.test(value)) {
      value = value.charAt(0) + '-';
    } else if (/^[CI]-\d*$/.test(value)) {
      // Mantener el formato correcto
      value = value.charAt(0) + '-' + value.substring(2).replace(/\D/g, '');
    }

    this.formBusqueda.setValue(value, { emitEvent: false });
  }
  cargarPacientesRecientes(): void {
    this.cargandoPacientes = true;
    this.pacienteService.list().pipe(
      catchError(error => {
        console.error('Error al cargar pacientes recientes:', error);
        this.cargandoPacientes = false;
        return of([]);
      })
    ).subscribe(pacientes => {
      this.pacientesRecientes = pacientes
        .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime());

      this.cargandoPacientes = false;
    });
  }

  buscarPaciente() {
    const inputRaw = this.formBusqueda.value?.trim();
    if (!inputRaw) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor, ingrese el ID del paciente, DNI de la madre o código de cuna.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const input = inputRaw.replace(/^0+/, '').toUpperCase(); // Elimina ceros y pasa a mayúscula
    this.cargandoPacientes = true;

    this.pacienteService.list().subscribe({
      next: (pacientes) => {
        const filtrados = pacientes.filter(p =>
          p.idPaciente?.toString().replace(/^0+/, '') === input ||
          p.dniMadre?.toString().replace(/^0+/, '') === input ||
          p.cuna?.idCuna?.toUpperCase() === input
        );

        if (filtrados.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Paciente no encontrado',
            text: `No se encontró ningún paciente con los datos "${inputRaw}".`,
            confirmButtonColor: '#3085d6'
          });
          this.form.reset();
          this.pacientesRecientes = [];
        } else if (filtrados.length === 1) {
          this.form.patchValue(filtrados[0]);
          Swal.fire({
            icon: 'success',
            title: 'Paciente encontrado',
            text: 'Se encontró un paciente con los datos ingresados.',
            confirmButtonColor: '#3085d6'
          });
          this.pacientesRecientes = [];
        } else {
          // Múltiples encontrados
          this.pacientesRecientes = filtrados
            .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime());

          Swal.fire({
            icon: 'info',
            title: `${filtrados.length} pacientes encontrados`,
            text: 'Seleccione uno de la lista inferior',
            confirmButtonColor: '#3085d6'
          });
        }

        this.cargandoPacientes = false;
      },
      error: () => {
        this.cargandoPacientes = false;
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo obtener la lista de pacientes.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }




  private buscarPorCuna(idCuna: string) {
    const formattedIdCuna = idCuna.toUpperCase();
    this.pacienteService.list().pipe(
      catchError(error => {
        console.error('Error al buscar por cuna:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al buscar pacientes por cuna',
          confirmButtonColor: '#d33'
        });
        return of([]);
      })
    ).subscribe(pacientes => {
      const pacientesConCuna = pacientes.filter(p =>
        p.cuna?.idCuna?.toUpperCase() === formattedIdCuna
      );
      if (pacientesConCuna.length > 0) {
        const paciente = pacientesConCuna.sort((a, b) =>
          new Date(b.fechaNacimientoPaciente).getTime() - new Date(a.fechaNacimientoPaciente).getTime()
        )[0];
        this.form.patchValue(paciente);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Paciente no encontrado',
          text: 'No se encontró un paciente con ese número de filiación o cuna.',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  private buscarPorIdPaciente(idPaciente: string) {
    this.pacienteService.get(idPaciente).pipe(
      catchError(error => {
        if (error.status === 404) {
          Swal.fire({
            icon: 'info',
            title: 'Paciente no encontrado',
            text: 'No se encontró un paciente con ese número de filiación o cuna.',
            confirmButtonColor: '#3085d6'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al buscar el paciente.',
            confirmButtonColor: '#d33'
          });
        }
        this.form.reset();
        return of(null);
      })
    ).subscribe(paciente => {
      // Validar si el paciente es null, undefined o un objeto vacío
      if (paciente && Object.keys(paciente).length > 0) {
        this.form.patchValue(paciente);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Paciente no encontrado',
          text: 'No se encontró un paciente con ese número de filiación o cuna.',
          confirmButtonColor: '#3085d6'
        });
        this.form.reset();
      }
    });
  }

  seleccionarPaciente(paciente: any): void {
    this.form.patchValue(paciente);
    this.formBusqueda.setValue(paciente.idPaciente);
  }

  verHistoria() {
    const idPaciente = this.form.get('idPaciente')?.value;
    if (idPaciente) {
      this.router.navigate(['/ver-historia-clinica', idPaciente]);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Sin selección',
        text: 'No se ha seleccionado un paciente',
        confirmButtonColor: '#3085d6'
      });
    }
  }

  regresar() {
    this.router.navigate(['/menu-historia']);
  }
}

