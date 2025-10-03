// registro-autologa.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { Router } from '@angular/router';
import { RegistroAutologaService } from '../services/registro-autologa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-autologa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-autologa.component.html',
  styleUrls: ['./registro-autologa.component.css'],
})
export class RegistroAutologaComponent {
  busqueda: string = '';
  madreEncontrada: any = null;
  madreValidaParaDonar: boolean = false;
  
  nuevoRegistro = {
    cantidad: null as number | null,
    hora: this.getCurrentDateTime(),
    idMadre: ''
  };
  
  historial: any[] = [];

  constructor(
    private router: Router,
    private registroService: RegistroAutologaService
  ) {}

  private getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  limpiar(): void {
    this.busqueda = '';
    this.madreEncontrada = null;
    this.madreValidaParaDonar = false;
    this.nuevoRegistro = {
      cantidad: null,
      hora: this.getCurrentDateTime(),
      idMadre: ''
    };
    this.historial = [];
  }

  buscar(): void {
    if (!this.busqueda || this.busqueda.trim() === '') {
      Swal.fire('Campo vacío', 'Por favor, ingrese un Número de DNI para buscar.', 'info');
      return;
    }

    this.registroService.getAll().subscribe({
      next: (registros) => {
        const registrosFiltrados = registros.filter(reg => 
          reg.madre?.idMadre === this.busqueda || 
          reg.madre?.paciente?.cuna?.idCuna === this.busqueda
        );
        
        if (registrosFiltrados.length > 0) {
          this.verificarMadre(registrosFiltrados[0].madre.idMadre);
        } else {
          this.verificarMadreDirectamente(this.busqueda);
        }
      },
      error: (err) => {
        console.error('Error al buscar registros:', err);
        Swal.fire('Error', 'Error al buscar registros', 'error');
      }
    });
  }

  verificarMadreDirectamente(idMadreOrCuna: string): void {
    this.registroService.getMadreById(idMadreOrCuna).subscribe({
      next: (madre) => {
        if (madre) {
          this.procesarMadreEncontrada(madre);
        } else {
          Swal.fire('No encontrada', 'No se encontró ninguna madre con ese DNI', 'warning');
          this.limpiar();
        }
      },
      error: (err) => {
        console.error('Error al buscar madre:', err);
        Swal.fire('Error', 'No se encontró ninguna madre con ese DNI', 'error');
      }
    });
  }

  verificarMadre(idMadre: string): void {
    this.registroService.getMadreById(idMadre).subscribe({
      next: (madre) => {
        if (madre) {
          this.procesarMadreEncontrada(madre);
        } else {
          Swal.fire('Advertencia', 'No se encontraron datos completos de la madre', 'warning');
          this.limpiar();
        }
      },
      error: (err) => {
        console.error('Error al verificar madre:', err);
        Swal.fire('Error', 'Error al verificar datos de la madre', 'error');
      }
    });
  }

  procesarMadreEncontrada(madre: any): void {
    this.madreEncontrada = madre;
    this.nuevoRegistro.idMadre = madre.idMadre;

    const esApta = madre.aptaParaDonar === 'Apta';
    const tieneConsentimiento = madre.donarLeche === 'Si';

    this.madreValidaParaDonar = esApta && tieneConsentimiento;

    if (!this.madreValidaParaDonar) {
      let mensaje = '';
      let cabecera = '';

      if (!esApta && !tieneConsentimiento) {
        mensaje = 'La madre no está apta para donar y no dio su consentimiento para donar.';
        cabecera = 'No apta y sin Consentimiento';
      } else if (!esApta) {
        mensaje = 'La madre no está apta para donar.';
        cabecera = 'No apta';
      } else if (!tieneConsentimiento) {
        mensaje = 'La madre no dio su consentimiento para donar.';
        cabecera = 'Sin Consentimiento';
      }

      Swal.fire(cabecera, mensaje, 'warning');
    }

    this.cargarHistorial(madre.idMadre);
  }

  cargarHistorial(idMadre: string): void {
    this.registroService.getAll().subscribe({
      next: (registros) => {
        this.historial = registros
          .filter(reg => reg.madre?.idMadre === idMadre)
          .sort((a, b) => new Date(b.hora).getTime() - new Date(a.hora).getTime())
          .map(reg => ({
            cantidad: reg.cantidad,
            hora: reg.hora,
            cuna: reg.madre?.paciente?.cuna?.idCuna || '---'
          }));
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
      }
    });
  } 
  obtenerEstadoMadre(): string {
    if (!this.madreEncontrada) return '';

    const esApta = this.madreEncontrada.aptaParaDonar === 'Apta';
    const tieneConsentimiento = this.madreEncontrada.donarLeche === 'Si';

    if (esApta && tieneConsentimiento) return 'APTA PARA DONAR Y DIO CONSENTIMIENTO';
    if (!esApta && !tieneConsentimiento) return 'NO APTA PARA DONAR Y SIN CONSENTIMIENTO';
    if (!esApta) return 'NO APTA PARA DONAR';
    if (!tieneConsentimiento) return 'SIN CONSENTIMIENTO';

    return 'NO APTA PARA DONAR';
  }

  guardar(): void {
    if (!this.busqueda || this.busqueda.trim() === '' || this.madreEncontrada == null) {
      Swal.fire('Madre no encontrada', 'Por favor, presione el botón buscar para buscar a la madre.', 'info');
      return;
    }

    const esApta = this.madreEncontrada.aptaParaDonar === 'Apta';
    const tieneConsentimiento = this.madreEncontrada.donarLeche === 'Si';

    this.madreValidaParaDonar = esApta && tieneConsentimiento;

    if (!this.madreValidaParaDonar) {
      let mensaje = '';
      let cabecera = '';

      if (!esApta && !tieneConsentimiento) {
        mensaje = 'La madre no está apta para donar y no dio su consentimiento.';
        cabecera = 'No apta y sin consentimiento';
      } else if (!esApta) {
        mensaje = 'La madre no está apta para donar.';
        cabecera = 'No apta';
      } else if (!tieneConsentimiento) {
        mensaje = 'La madre no dio su consentimiento para donar.';
        cabecera = 'Sin consentimiento';
      }

      Swal.fire(cabecera, mensaje, 'warning');
      return;
    }

    if (!this.nuevoRegistro.cantidad) {
      Swal.fire('Faltan datos', 'Por favor ingrese la cantidad de leche', 'info');
      return;
    }

    Swal.fire({
      title: '¿Confirmar registro?',
      text: `¿Deseas ingresar el registro de ${this.nuevoRegistro.cantidad} ml de leche?`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, Ingresar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.nuevoRegistro.hora = this.getCurrentDateTime();

        this.registroService.createRegistro({
          cantidad: this.nuevoRegistro.cantidad,
          hora: this.nuevoRegistro.hora,
          idMadre: this.nuevoRegistro.idMadre
        }).subscribe({
          next: () => {
            Swal.fire('Guardado Exitoso', '', 'success');
            this.nuevoRegistro.cantidad = null;
            this.nuevoRegistro.hora = this.getCurrentDateTime();
            this.cargarHistorial(this.nuevoRegistro.idMadre);
          },
          error: (err) => {
            console.error('Error al guardar:', err);
            Swal.fire('Error', 'Error al guardar el registro.', 'error');
          }
        });
      }
    });
  }

  regresar(): void {
    this.router.navigate(['/menu-almacen']);
  }
}
