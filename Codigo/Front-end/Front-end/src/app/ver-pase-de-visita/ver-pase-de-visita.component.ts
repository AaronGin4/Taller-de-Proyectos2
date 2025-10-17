import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PaseDeVisitaService } from '../services/pase-de-visita.service';
import { PacienteService } from '../services/paciente.service';
import { PaseDeVisita, Paciente } from '../model/pase-de-visita';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-pase-de-visita',
  templateUrl: './ver-pase-de-visita.component.html',
  styleUrls: ['./ver-pase-de-visita.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    RouterModule,
  ],
})
export default class PaseDeVisitaPage implements OnInit {
  pacienteData: Paciente = { idPaciente: '', area: '' };
  idPaciente!: string;
  idCuna!: string;
  idPaseVisita?: number;

  pesoAnterior: number | null = null;
  pesoNacimiento: number = 0;
  deltaPeso: number = 0;
  cantidadOriginal: number = 0;
  isEditing = false;
  valoresOriginales: any = {};

  visitaForm = new FormGroup({
    fecha: new FormControl<Date | null>(null),
    llamadaTelefono: new FormControl<string>({ value: 'Si', disabled: true }),
    pesoDiaAnterior: new FormControl(0),
    pesoDelDia: new FormControl(0),
    nroTomas: new FormControl(0),
    cantidadToma: new FormControl(0),
    tipoLeche: new FormControl('Calostro'),
    contenidoEnergetico: new FormControl('Hipercalórico'),
    viaAdministracion: new FormControl('SOG'),
    calostroterapia: new FormControl('No'),
    area: new FormControl('UCIN')
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paseVisitaService: PaseDeVisitaService,
    private servicioPaciente: PacienteService
  ) {}

  ngOnInit() {
    this.visitaForm.disable();
    this.idPaciente = this.route.snapshot.params['id'];
    this.idCuna = this.route.snapshot.params['idcuna'];
    this.obtenerUltimoPaseVisita();

    // Escuchar cambios en peso actual para recalcular delta de peso
    this.visitaForm.get('pesoDelDia')?.valueChanges.subscribe((pesoActual) => {
      this.calcularDeltaPeso(pesoActual);
    });
  }

  private obtenerUltimoPaseVisita() {
    this.paseVisitaService.getUltimoPase(this.idPaciente).subscribe({
      next: (pase: PaseDeVisita) => {
        if (pase) {
          this.idPaseVisita = pase.idPaseVisita;
          this.cantidadOriginal = pase.cantidadMlPorTomaDeLeche;
          const fechaPase = new Date(pase.fechaDia);
          const fechaLocal = new Date(fechaPase.getTime() + fechaPase.getTimezoneOffset() * 60000);

          this.visitaForm.patchValue({
            fecha: fechaLocal,
            llamadaTelefono: pase.llamadaTelefono,
            pesoDiaAnterior: pase.pesoDiaAnterior,
            pesoDelDia: pase.pesoDelDia,
            nroTomas: pase.nroDeTomasDeLeche,
            cantidadToma: pase.cantidadMlPorTomaDeLeche,
            tipoLeche: pase.tipoLecheRequerida,
            contenidoEnergetico: pase.contenidoEnergetico,
            viaAdministracion: pase.viaAdministracion,
            calostroterapia: pase.calostroterapia,
            area: pase.paciente.area,
          });

          this.pesoAnterior = pase.pesoDiaAnterior;
          this.deltaPeso = pase.deltaPeso;
          this.pacienteData = pase.paciente;
          this.pesoNacimiento = pase.paciente.pesoNacimientoPaciente ?? 0;
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No hay registros',
            text: 'No se encontraron pases de visita anteriores para este paciente',
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener último pase:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al obtener el último pase de visita',
        });
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.valoresOriginales = structuredClone(this.visitaForm.getRawValue());
      this.visitaForm.enable();
      this.visitaForm.get('fecha')?.disable();
      this.visitaForm.get('llamadaTelefono')?.disable();
    } else {
      this.visitaForm.patchValue(this.valoresOriginales);
      this.visitaForm.disable();
    }
  }

  guardarCambios() {
    if (!this.idPaseVisita) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el pase de visita a actualizar',
      });
      return;
    }

    const formValues = this.visitaForm.value;
    const datosActualizados: any = {};
    Object.keys(formValues).forEach((key) => {
      const valor = formValues[key as keyof typeof formValues];
      if (valor !== null && valor !== undefined && valor !== '') {
        datosActualizados[key] = valor;
      }
    });

    datosActualizados.deltaPeso = this.deltaPeso;

    this.paseVisitaService.actualizarParcial(this.idPaseVisita, datosActualizados)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Los datos se han actualizado correctamente',
            timer: 2000,
            showConfirmButton: false,
          });
          this.isEditing = false;
          this.visitaForm.disable();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar el pase de visita',
          });
        },
      });
  }

  calcularDeltaPeso(pesoActual: number | null) {
    const nacimiento = this.pesoNacimiento || 0;
    const anterior = this.pesoAnterior || nacimiento;

    if (pesoActual != null && !isNaN(pesoActual)) {
      if (pesoActual <= nacimiento && nacimiento !== 0) {
        this.deltaPeso = ((pesoActual - nacimiento) / nacimiento) * 100;
      } else if (anterior !== 0) {
        this.deltaPeso = ((pesoActual - anterior) / anterior) * 100;
      } else {
        this.deltaPeso = 0;
      }

      this.deltaPeso = parseFloat(this.deltaPeso.toFixed(2));
    } else {
      this.deltaPeso = 0;
    }
  }

  regresar() {
    this.router.navigate(['/pacientes']);
  }
}
