import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
//import { RegistroLechePasteurizadaService } from '../services/registro-leche-pasteurizada.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http'; // Importación añadida

@Component({
  selector: 'app-registro-pasteurizado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-pasteurizado.component.html',
  styleUrl: './registro-pasteurizado.component.css'
})
export class RegistroPasteurizadoComponent {
  leche = {
    tipoLeche: '',
    codigoLeche: '',
    cantidadLeche: null as number | null,
    kcal: null as number | null,
    crema: null as number | null,
    grasa: null as number | null,
    aDornix: null as number | null,
    contenidoEnergetico: ""
  };

  constructor(
    private router: Router,
    private lecheService: RegistroLechePasteurizadaService
  ) {}

  validarCampos(): boolean {
    const camposRequeridos = [
      this.leche.tipoLeche,
      this.leche.codigoLeche,
      this.leche.cantidadLeche,
      this.leche.kcal,
      this.leche.crema,
      this.leche.grasa,
      this.leche.aDornix
    ];

    if (camposRequeridos.some(campo => campo === null || campo === '' || campo === undefined)) {
      Swal.fire({
        title: "¡Campos incompletos!",
        text: "Por favor complete todos los campos obligatorios",
        icon: "warning"
      });
      return false;
    }
    return true;
  }

  verificarCodigoUnico(codigo: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.lecheService.verificarCodigoExistente(codigo).subscribe({
        next: (existe: boolean) => {
          resolve(!existe);
        },
        error: (err: HttpErrorResponse) => { 
          if (err.status === 404) {
            resolve(true);
          } else {
            console.error(err);
            reject(err);
          }
        }
      });
    });
  }

  async registrar() {
    if (!this.validarCampos()) return;

    try {
      const codigoDisponible = await this.verificarCodigoUnico(this.leche.codigoLeche);
      
      if (!codigoDisponible) {
        Swal.fire({
          title: "¡Código duplicado!",
          text: "Ya existe un registro con este código de leche",
          icon: "warning"
        });
        return;
      }

      this.leche.contenidoEnergetico = this.calcularContenidoEnergetico(this.leche.kcal);
      
      this.lecheService.registrarLeche(this.leche).subscribe({
        next: () => {
          Swal.fire({
            title: "¡Registro exitoso!",
            text: "La leche pasteurizada ha sido registrada correctamente",
            icon: "success"
          }).then(() => {
            this.leche = {
              tipoLeche: '',
              codigoLeche: '',
              cantidadLeche: null,
              kcal: null,
              crema: null,
              grasa: null,
              aDornix: null,
              contenidoEnergetico: ""
            };
          });
        },
        error: (err: HttpErrorResponse) => { // Tipo explícito añadido aquí también
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al registrar la leche",
            icon: "error"
          });
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al verificar el código",
        icon: "error"
      });
    }
  }

  calcularContenidoEnergetico(kcal: number | null): string {
    if (kcal === null) return 'Normocalórico';
    if (kcal >= 700) return 'Hipercalórico';
    if (kcal >= 500) return 'Normocalórico';
    return 'Hipocalórico';
  }

  regresar() {
    this.router.navigate(['/menu-almacen']);
  }
}