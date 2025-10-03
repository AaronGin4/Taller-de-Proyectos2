import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { RegistroLechePasteurizadaService } from '../services/registro-leche-pasteurizada.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-leches-disponibles',
  templateUrl: './leches-disponibles.component.html',
  providers: [RegistroLechePasteurizadaService],
  styleUrls: ['./leches-disponibles.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ]
})
export class LechesDisponiblesComponent implements OnInit {

  leches: any[] = [];
  lecheSeleccionada: any = null;

  constructor(
    private router: Router,
    private registroLecheService: RegistroLechePasteurizadaService
  ) {}

  ngOnInit(): void {
    this.cargarLeches();
  }

  cargarLeches(): void {
    this.registroLecheService.getLeches().subscribe(
      data => {
        //console.log('Datos recibidos del backend:', data);
        this.leches = this.procesarLeches(data);
      },
      error => {
        console.error('Error al obtener las leches:', error);
      }
    );
  }

  procesarLeches(data: any[]): any[] {
    const tipos = ['CALOSTRO', 'TRANSICIÓN', 'MADURA'];
    return tipos.map(tipo => {
      const lechesPorTipo = data.filter(leche => leche.tipoLeche?.toUpperCase() === tipo);
      return {
        tipo,
        tiposCaloricos: [
          {
            calorico: 'Hipercalórico',
            leches: lechesPorTipo.filter(leche => leche.contenidoEnergetico === 'Hipercalórico') || []
          },
          {
            calorico: 'Normocalórico',
            leches: lechesPorTipo.filter(leche => leche.contenidoEnergetico === 'Normocalórico') || []
          },
          {
            calorico: 'Hipocalórico',
            leches: lechesPorTipo.filter(leche => leche.contenidoEnergetico === 'Hipocalórico') || []
          }
        ]
      };
    });
  }

  mostrarDetalleLeche(leche: any): void {
    this.lecheSeleccionada = leche;
  }

  cerrarModal(): void {
    this.lecheSeleccionada = null;
  }

  eliminarLeche(leche: any): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas retirar esta leche?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, Retirar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Llamada al backend para eliminar
      this.registroLecheService.eliminarLeche(leche.codigoLeche).subscribe({
        next: () => {
          // Quitarla del arreglo en pantalla
          this.leches.forEach((tipo: any) => {
            tipo.tiposCaloricos.forEach((tc: any) => {
              tc.leches = tc.leches.filter((l: any) => l !== leche);
            });
          });
          this.cerrarModal();
          Swal.fire('Eliminada', 'La leche ha sido retirada exitosamente.', 'success');
        },
        error: (error) => {
          console.error('Error al retirar la leche:', error);
          Swal.fire('Error', 'No se pudo retirar la leche.', 'error');
        }
      });
    } 
  });
}

  regresar(): void {
    this.router.navigate(['/menu-almacen']);
  }
  
  esLecheVacia(leche: any): boolean {
  return leche.tiposCaloricos.every((tc: any) => tc.leches.length === 0);
}
}
