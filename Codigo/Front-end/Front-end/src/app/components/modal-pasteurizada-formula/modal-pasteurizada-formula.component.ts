import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DispensacionService } from '../../services/dispensacion.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-pasteurizada-formula',
  imports: [MatInputModule, MatCardModule, FormsModule, CommonModule],
  standalone: true,
  templateUrl: './modal-pasteurizada-formula.component.html',
  styleUrl: './modal-pasteurizada-formula.component.css'
})
export class ModalPasteurizadaFormulaComponent {
  @ViewChild('codeInput') codeInput!: ElementRef;
  code: string = '';
  cantidadPasteurizada: number = 0;
  cantidadF: number = 0;
  quantity: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalPasteurizadaFormulaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dispensacionService: DispensacionService
  ) {
    this.quantity = data.cantidadInicial || 0;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.codeInput?.nativeElement) {
        this.codeInput.nativeElement.focus();
      }
    }, 100);
  }

  cancel() {
    this.dialogRef.close();
  }

  register() {
    if (!this.code || this.cantidadPasteurizada <= 0 || this.cantidadF <= 0) {
      Swal.fire('Error', 'Complete todos los campos con valores válidos', 'error');
      return;
    }
    const suma = this.cantidadPasteurizada + this.cantidadF;
    if (suma !== this.quantity) {
      Swal.fire({
        title: 'Error',
        html: `La suma (${suma}ml) no coincide con la cantidad inicial (${this.quantity}ml).<br>
               Por favor, ingrese valores que sumen ${this.quantity}ml.`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    Swal.fire({
      title: '¿Confirmar registro?',
      text: `¿Desea registrar ${this.cantidadPasteurizada}ml de leche autóloga y ${this.cantidadF}ml de leche pasteurizada?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
              this.eliminarLoteYRegistrar();
      }
    });
  }
  private eliminarLoteYRegistrar() {
    Swal.fire({
      title: 'Verificando lote...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  
    this.dispensacionService.verificarLotePasteurizada(this.code).subscribe({
      next: () => {
        this.dialogRef.close({
          success: true,
          cantidadPasteurizada: this.cantidadPasteurizada,
          cantidadF: this.cantidadF,
          type: 'pasteurizadaFormula',
          codigoPasteurizada: this.code

        });
      },
      error: (error) => {
        console.error('Error al validar lote:', error);
        
        let errorMsg = 'Error al validar el lote';
        if (error.status === 404) {
          errorMsg = `El lote ${this.code} no existe`;
        } else if (error.status === 400) {
          errorMsg = error.error?.message || 'Datos inválidos';
        }
        
        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }
  
}