import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { CunaService } from '../services/cuna.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../model/paciente.interface';
import { Cuna } from '../model/paciente.interface';
import { Enfermedad } from '../model/enfermedad.interface';
import { EnfermedadService } from '../services/enfermedad.service';
import { EnfermedadesPaciente } from '../model/enfermedadespaciente.interface';
import { EnfermedadespacienteService } from '../services/enfermedadespaciente.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-historia-clinica',
  imports: [CommonModule, FormsModule],
  templateUrl: './ver-historia-clinica.component.html',
  styleUrls: ['./ver-historia-clinica.component.css'],
  standalone: true,
})
export default class VerHistoriaClinicaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pacienteService = inject(PacienteService);
  private cunaService = inject(CunaService);
  private enfermedadesPacienteService = inject(EnfermedadespacienteService);
  private enfermedadService = inject(EnfermedadService);


  paciente: Paciente | null = null;
  nuevaCunaId: string = '';
  detallePeso: string = '';
  detalleEdad: string = '';
  colorDetallePeso: string = '';
  colorDetalleEdad: string = '';
  enfermedades: Enfermedad[] = [];
  cargandoEnfermedades = false;
  idDiagnosticoPaciente: any;

  ngOnInit(): void {
    const idPaciente = this.route.snapshot.paramMap.get('idPaciente');
    if (idPaciente) {
      this.pacienteService.get(idPaciente).subscribe(p => {
        this.paciente = p;
        if (p?.pesoNacimientoPaciente) {
          this.actualizarDetallePeso(p.pesoNacimientoPaciente);
        }
        if (p?.edadGestacionalPaciente) {
          this.actualizarDetalleEdad(p.edadGestacionalPaciente);
        }

        if (p?.diagnosticoPaciente?.idDiagnosticoPaciente) {
          this.cargarEnfermedades(p.diagnosticoPaciente.idDiagnosticoPaciente);
        }
      });
    }
  }

  // ver-historia-clinica.component.ts
  cargarEnfermedades(idDiagnosticoPaciente: string): void {
    this.cargandoEnfermedades = true;
    this.enfermedades = []; // Reiniciamos el array

    this.enfermedadesPacienteService.obtenerPorDiagnosticoPaciente(idDiagnosticoPaciente).subscribe({
      next: (enfermedadesPaciente) => {
        // Aseguramos que siempre trabajamos con un array
        const enfermedadesArray = enfermedadesPaciente || [];

        if (enfermedadesArray.length === 0) {
          //console.log('No se encontraron enfermedades para este diagnóstico');
          this.enfermedades = [];
        } else {
          const idsEnfermedades = enfermedadesArray.map(ep => ep.enfermedad?.idEnfermedad).filter(id => id != null);
          if (idsEnfermedades.length > 0) {
            this.obtenerDetallesEnfermedades(idsEnfermedades);
          } else {
            this.enfermedades = [];
          }
        }
        this.cargandoEnfermedades = false;
      },
      error: (error) => {
        console.error('Error al cargar relaciones enfermedades-paciente:', error);
        this.enfermedades = [];
        this.cargandoEnfermedades = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las enfermedades',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  obtenerDetallesEnfermedades(idsEnfermedades: string[]): void {
    this.enfermedadService.listarTodas().subscribe({
      next: (todasEnfermedades) => {
        this.enfermedades = todasEnfermedades.filter(enfermedad =>
          enfermedad && idsEnfermedades.includes(enfermedad.idEnfermedad)
        );
      },
      error: (error) => {
        console.error('Error al cargar detalles de enfermedades:', error);
        this.enfermedades = [];
      }
    });
  }

  actualizarDetallePeso(peso: number) {
    if (peso >= 4000) {
      this.detallePeso = 'Macrosómico';
      this.colorDetallePeso = 'fondo-negro';
    } else if (peso >= 2500) {
      this.detallePeso = 'Adecuado';
      this.colorDetallePeso = 'fondo-verde';
    } else if (peso >= 1500) {
      this.detallePeso = 'Bajo';
      this.colorDetallePeso = 'fondo-rojo';
    } else if (peso >= 1001) {
      this.detallePeso = 'Muy Bajo';
      this.colorDetallePeso = 'fondo-rojo';
    } else if (peso > 0) {
      this.detallePeso = 'Extremadamente Bajo';
      this.colorDetallePeso = 'fondo-rojo';
    }
  }

  actualizarDetalleEdad(edad: number) {
    if (edad >= 42) {
      this.detalleEdad = 'Postermino';
      this.colorDetalleEdad = 'fondo-negro';
    } else if (edad >= 37 && edad <= 41) {
      this.detalleEdad = 'Termino';
      this.colorDetalleEdad = 'fondo-verde';
    } else if (edad >= 34 && edad <= 36) {
      this.detalleEdad = 'PreTermino Tardío';
      this.colorDetalleEdad = 'fondo-morado';
    } else if (edad >= 31 && edad <= 33) {
      this.detalleEdad = 'PreTermino Moderado';
      this.colorDetalleEdad = 'fondo-morado';
    } else if (edad >= 29 && edad <= 30) {
      this.detalleEdad = 'PreTermino Severo';
      this.colorDetalleEdad = 'fondo-morado';
    } else if (edad > 0 && edad <= 28) {
      this.detalleEdad = 'PreTermino Extremo';
      this.colorDetalleEdad = 'fondo-rojo';
    } else {
      this.detalleEdad = '';
      this.colorDetalleEdad = '';
    }
  }

  actualizarCuna() {
    if (!this.paciente || !this.nuevaCunaId) {
      alert('Completa todos los campos para actualizar la cuna.');
      return;
    }

    const cunaAnterior: Cuna = {
      idCuna: this.paciente.cuna.idCuna,
      estadoCuna: 'Disponible'
    };

    this.cunaService.actualizar(cunaAnterior).subscribe(() => {
      const nuevaCuna: Cuna = {
        idCuna: this.nuevaCunaId,
        estadoCuna: 'No Disponible'
      };

      this.cunaService.actualizar(nuevaCuna).subscribe(() => {
        const actualizado: Paciente = {
          ...this.paciente!,
          cuna: nuevaCuna
        };

        this.pacienteService.update(actualizado.idPaciente, actualizado).subscribe(() => {
          this.paciente = actualizado;
          alert('✅ Cuna actualizada exitosamente.');
        });
      });
    });
  }

  darDeAlta() {
    if (!this.paciente || this.paciente.estado === 'Paciente en alta') {
      Swal.fire({
        icon: 'info',
        title: 'Paciente ya dado de alta',
        text: 'El paciente ya está dado de alta o no se ha cargado correctamente.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    Swal.fire({
      title: '¿Dar de alta al paciente?',
      html: `
      <p>Ingrese los datos de salida del paciente:</p>
      <input id="pesoSalida" type="number" class="swal2-input" placeholder="Peso de salida (gr)" min="1">
      <input id="tallaSalida" type="number" class="swal2-input" placeholder="Talla de salida (cm)" min="1">
      <input id="perimetroSalida" type="number" class="swal2-input" placeholder="P. Cefalico de Salida (cm)" min="1">
    `,
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de alta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const peso = (document.getElementById('pesoSalida') as HTMLInputElement).value;
        const talla = (document.getElementById('tallaSalida') as HTMLInputElement).value;
        const perimetro = (document.getElementById('perimetroSalida') as HTMLInputElement).value;

        // Validación obligatoria
        if (!peso || +peso <= 0 || !talla || +talla <= 0 ||!perimetro || +perimetro<=0) {
          Swal.showValidationMessage('Debe ingresar todos los datos.');
          return false;
        }

        return {
          pesoSalidaPaciente: +peso,
          tallaSalidaPaciente: +talla,
          perimetroCefalicoSalidaPaciente: +perimetro 
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.procesarAltaPaciente(result.value.pesoSalidaPaciente, result.value.tallaSalidaPaciente,result.value.perimetroCefalicoSalidaPaciente);
      }
    });
  }

  private procesarAltaPaciente(pesoSalida: number, tallaSalida: number,perimetroSalida: number) {
    const fechaAlta = this.getFechaLocal();

    const actualizado: Paciente = {
      ...this.paciente!,
      estado: 'Paciente en alta',
      fechaSalida: fechaAlta,
      pesoSalidaPaciente: pesoSalida,
      tallaSalidaPaciente: tallaSalida,
      perimetroCefalicoSalida:perimetroSalida
    };

    this.pacienteService.update(actualizado.idPaciente, actualizado).subscribe({
      next: () => {
        this.paciente = actualizado;

        const cuna: Cuna = {
          idCuna: actualizado.cuna.idCuna,
          estadoCuna: 'Disponible'
        };

        this.cunaService.actualizar(cuna).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Alta exitosa',
              html: `
              <p>El paciente ha sido dado de alta correctamente.</p>
              <p><b>Peso de salida:</b> ${pesoSalida} gr</p>
              <p><b>Talla de salida:</b> ${tallaSalida} cm</p>
              <p><b>P.Cefalico de salida:</b> ${perimetroSalida} cm</p>
            `,
              confirmButtonColor: '#3085d6'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'warning',
              title: 'Cuna no liberada',
              text: 'El paciente fue dado de alta pero no se pudo liberar la cuna.',
              confirmButtonColor: '#3085d6'
            });
          }
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al dar de alta al paciente.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  verActualizarHistoria() {
    this.router.navigate(['/actualizar-historia-clinica', this.paciente?.idPaciente]);
  }
  irARegistroMadre() {
    this.router.navigate(['/registro-madre', this.paciente?.idPaciente]);
  }
  regresar() {
    this.router.navigate(['/buscar-historia-clinica']);
  }
  irReportePaciente() {
    if (this.paciente) {
      this.router.navigate(['/reporte-por-paciente', this.paciente?.idPaciente]);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Paciente no encontrado',
        text: 'No se pudo encontrar el paciente para generar el reporte.',
        confirmButtonColor: '#3085d6'
      });
    }
  }
  private getFechaLocal(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const day = hoy.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}