import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaseDeVisitaService } from '../services/pase-de-visita.service';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../model/pase-de-visita';
import { PaseDeVisita } from '../model/pase-de-visita';
import { catchError, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pase-de-visita',
  templateUrl: './pase-de-visita.component.html',
  styleUrls: ['./pase-de-visita.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatRadioModule, MatSelectModule, RouterModule,
  ],
})
export default class PaseDeVisitaPage implements OnInit {
  today = new Date();
  pacienteData: any={};
  idPaciente!: string;
  idCuna!: string;
  idPaseVisita!: string;
  pesoDiaAnterior: number = 0;
  edadEnDias: number = 0;
  deltaPeso: number = 0;
  pesoDelDia: number | null = null;
  pesoAnterior: number | null = null; 
  pesoNacimiento: number = 0;
  calculatedDeltaPeso: number = 0;

  visitaForm = new FormGroup({
    fecha: new FormControl<Date>({value: this.today, disabled: true}),
    llamadaTelefono: new FormControl<string>('Si', [Validators.required]),
    pesoDiaAnterior: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    pesoDelDia: new FormControl<number |null >(null, [Validators.required, Validators.min(0)]),
   nroTomas: new FormControl<number>(0, [Validators.required,this.tomasValidator() ]),
    cantidadToma: new FormControl<number |null > (null, [Validators.required, Validators.min(0)]),
    tipoLeche: new FormControl<string>('Calostro', [Validators.required]),
    contenidoEnergetico: new FormControl<string>('Hipercalórico', [Validators.required]),
    viaAdministracion: new FormControl<string>('SOG', [Validators.required]),
    calostroterapia: new FormControl<string>('No', [Validators.required]),
    area: new FormControl<string>('UCIN', [Validators.required]),
    fechaNacimiento: new FormControl<Date | null>({ value: null, disabled: true })
});

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paseVisitaService: PaseDeVisitaService,
    private servicioPaciente: PacienteService
  ) {}

  ngOnInit() {
    this.idPaciente = this.route.snapshot.params['id'];
    this.idCuna = this.route.snapshot.params['idcuna'];
    this.route.params.subscribe(params => {
      this.idPaciente = params['id'];
      this.idCuna = params['idcuna'];
      this.obtenerDatosPaciente().subscribe(paciente => {
        this.pacienteData = paciente;
        

      });
        
        this.verificarParametros();
      if (this.idPaciente) {
        this.obtenerDatosPaciente();
        this.obtenerYMostrarPases();
        this.obtenerDatosPacienteYUltimoPeso();
      } else {
        console.error('ID de paciente no proporcionado');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "ID de paciente no proporcionado",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
      }
    });

    this.verificarParametros()
    
  }
  private calcularEdadEnDias(fechaNacimiento: Date | string): number {
  const fecha = typeof fechaNacimiento === 'string' 
              ? new Date(fechaNacimiento) 
              : fechaNacimiento;
  
  if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
    console.error('Fecha de nacimiento inválida');
    return 0;
  }

  const hoy = new Date();
  const fechaLocal = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  
  const diferencia = hoyLocal.getTime() - fechaLocal.getTime();
  return Math.floor(diferencia / (1000 * 3600 * 24));
}
private obtenerDatosPacienteYUltimoPeso() {
  this.servicioPaciente.getPacienteById(this.idPaciente).subscribe({
    next: (paciente: Paciente) => {
      this.pacienteData = paciente;
       if (paciente.fechaNacimientoPaciente) {
        const fechaNacimiento = new Date(paciente.fechaNacimientoPaciente);
        this.edadEnDias = this.calcularEdadEnDias(fechaNacimiento);
        
        this.visitaForm.patchValue({ 
          fechaNacimiento: fechaNacimiento 
        });
      }
      this.visitaForm.patchValue({ area: this.pacienteData.area });
    }
  });

  this.paseVisitaService.getPasesByPaciente(this.idPaciente).subscribe({
    next: (pases) => {
      const ultimoPase = this.obtenerUltimoPase(pases);
      if (ultimoPase) {
        this.pesoAnterior = ultimoPase.pesoDelDia;
      } else {
        this.servicioPaciente.getPacienteById(this.idPaciente).subscribe({
          next: (paciente: Paciente) => {
            this.pesoAnterior = paciente.pesoNacimientoPaciente ?? null;
            this.visitaForm.patchValue({ pesoDiaAnterior: this.pesoAnterior });
          },
          error: (error: any) => {
            console.error('Error al obtener paciente:', error);
            this.pesoAnterior = 0;
            this.visitaForm.patchValue({ pesoDiaAnterior: this.pesoAnterior });
          }
        });
      }
      this.visitaForm.patchValue({ pesoDiaAnterior: this.pesoAnterior });
    },
    error: (error) => {
      console.error('Error al obtener pases:', error);
      this.obtenerPesoNacimiento();
      this.visitaForm.patchValue({ pesoDiaAnterior: this.pesoAnterior });
    }
  });
}
  private obtenerPesoNacimiento() {
    this.servicioPaciente.getPacienteById(this.idPaciente).subscribe({
      next: (paciente: Paciente) => {
        this.pacienteData = paciente;
        this.pesoAnterior = paciente.pesoNacimientoPaciente ?? null;
        this.visitaForm.patchValue({ pesoDiaAnterior: this.pesoAnterior });
      },
      error: (error: any) => {
        console.error('Error al obtener paciente:', error);
        this.pesoAnterior = 0;
        this.visitaForm.patchValue({ pesoDiaAnterior: this.pesoAnterior });
      }
    });    
  }
  private obtenerYMostrarPases() {
    this.paseVisitaService.getPasesByPaciente(this.idPaciente).subscribe({
      next: (pases) => {
      
        const ultimoPase = this.obtenerUltimoPase(pases);
        if (ultimoPase) {
          pesoDelDia: ultimoPase.pesoDelDia
        } else {
          this.pesoAnterior = null;
        }
      },
      error: (error) => {
        console.error('Error al obtener pases:', error);
      }
    });
  }
  private obtenerUltimoPase(pases: any[]): any | null {
    if (!pases || pases.length === 0) return null;
  
    const pasesOrdenados = [...pases].sort((a, b) => b.idPaseVisita - a.idPaseVisita);
    const ultimoPase = pasesOrdenados[0];
    if (ultimoPase?.pesoDiaAnterior !== null && ultimoPase?.pesoDiaAnterior !== undefined) {
    } else {
    
    }
     
    return pasesOrdenados[0];
  }
  private verificarParametros() {
    if (!this.idPaciente || !this.idCuna) {
      console.error('Faltan parámetros en la URL');
  
    }
  }
  calcularDelta() {
    const pesoActual = Number(this.visitaForm.get('pesoDelDia')?.value ?? 0)
    const pesoNacimiento = this.pacienteData?.pesoNacimientoPaciente || 0;
    const pesoReferencia = this.pesoAnterior || pesoNacimiento;
  
    if (!pesoActual || isNaN(pesoActual)) {
      this.deltaPeso = 0;
      console.error('Peso actual no válido');
      return;
    }
  
    if (pesoActual <= pesoNacimiento) {
      this.deltaPeso = ((pesoActual - pesoNacimiento) / pesoNacimiento) * 100;
    } else {
      this.deltaPeso = ((pesoActual - pesoReferencia) / pesoReferencia) * 100;
    }
  
    this.deltaPeso = parseFloat(this.deltaPeso.toFixed(2));
  }
onSubmit() {
  const camposRequeridos = {
    'llamadaTelefono': 'Llamada telefónica',
    'pesoDelDia': 'Peso del día',
    'nroTomas': 'Número de tomas',
    'cantidadToma': 'Cantidad por toma',
    'tipoLeche': 'Tipo de leche',
    'contenidoEnergetico': 'Contenido energético',
    'viaAdministracion': 'Vía de administración',
    'calostroterapia': 'Calostroterapia',
    'area': 'Área'
  };

  const camposFaltantes: string[] = [];

  Object.entries(camposRequeridos).forEach(([campo, nombre]) => {
    const control = this.visitaForm.get(campo);
    if (!control || !control.value || (typeof control.value === 'number' && isNaN(control.value))) {
      camposFaltantes.push(nombre);
    }
  });

  const pesoDelDia = this.visitaForm.get('pesoDelDia')?.value;
  if (pesoDelDia !== null && pesoDelDia !== undefined && (isNaN(pesoDelDia) || pesoDelDia <= 0)) {
    if (!camposFaltantes.includes('Peso del día')) {
      camposFaltantes.push('Peso del día (debe ser un número positivo)');
    }
  }

  if (camposFaltantes.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      html: `Los siguientes campos son requeridos:<br><ul><li>${camposFaltantes.join('</li><li>')}</li></ul>`,
      confirmButtonText: 'Entendido'
    });
    return;
  }

  const now = new Date();
  const fechaLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const fechaFormateada = fechaLocal.toISOString().split('T')[0];

  const formData = {
    ...this.visitaForm.value,
    ...this.visitaForm.getRawValue()
  };
  const nuevaArea = formData.area || '';
const nroTomasControl = this.visitaForm.get('nroTomas');
    if (nroTomasControl?.errors?.['invalidTomas']) {
      camposFaltantes.push('N° de tomas: Solo se permiten los valores 4, 6, 8, 12');
    }
  const paseData: PaseDeVisita = {
    fechaDia: fechaFormateada,
    llamadaTelefono: formData.llamadaTelefono!,
    pesoDiaAnterior: Number(this.visitaForm.value.pesoDiaAnterior),
    pesoDelDia: Number(this.visitaForm.value.pesoDelDia),
    deltaPeso: this.deltaPeso,
    requerimientosKcal: null,
    nroDeTomasDeLeche: Number(this.visitaForm.value.nroTomas),
    cantidadMlPorTomaDeLeche: Number(this.visitaForm.value.cantidadToma),
    tipoLecheRequerida: formData.tipoLeche!,
    contenidoEnergetico: formData.contenidoEnergetico!,
    viaAdministracion: formData.viaAdministracion!,
    calostroterapia: formData.calostroterapia!,
    paciente: {
      idPaciente: this.idPaciente,
      area: nuevaArea
    },
    cuna: {
      idCuna: this.idCuna
    }
  };

  this.paseVisitaService.crearPase(paseData).subscribe({
    next: (response) => {
      Swal.fire({
        title: "Registro exitoso",
        icon: "success",
        draggable: true
      });
      if (nuevaArea !== this.pacienteData?.area) {
        this.paseVisitaService.actualizarAreaPaciente(this.idPaciente, nuevaArea)
          .subscribe({
            next: () => {
              this.pacienteData.area = nuevaArea;
            },
            error: (error) => {
              console.error('Error actualizando área:', error);
            }
          });
      }
      this.router.navigate(['/pacientes']);
    },
    error: (error) => {
      console.error('Error en el registro:', error);
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: "Ocurrió un error al guardar los datos. Por favor intente nuevamente.",
      });
    }
  });
}
  private obtenerDatosPaciente(): Observable<Paciente> {
    return this.servicioPaciente.getPacienteById(this.idPaciente).pipe(
      catchError(error => {
        console.error('Error obteniendo paciente:', error);
        return of({ 
          idPaciente: this.idPaciente,
          area: '',
          pesoNacimientoPaciente: 0
        });
      })
    );
  }
  regresar() {
    this.router.navigate(['/pacientes']); 
  }

private tomasValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const validValues = [4, 6, 8, 12];
    
    if (value === null || value === undefined) {
      return null; 
    }
    
    return validValues.includes(Number(value)) 
      ? null 
      : { invalidTomas: true };
  };
}

}