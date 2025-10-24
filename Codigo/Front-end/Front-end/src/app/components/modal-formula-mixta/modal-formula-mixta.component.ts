import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DispensacionService } from '../../services/dispensacion.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-formula-mixta',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule],
  templateUrl: './modal-formula-mixta.component.html',
  styleUrls: ['./modal-formula-mixta.component.css'],
})
export class ModalFormulaMixtaComponent {
  @ViewChild('codigoInput') codigoInput!: ElementRef;
  quantity: number = 0;
  cantidadLeche: number = 0;
  cantidadFormula: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalFormulaMixtaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dispensacionService: DispensacionService
  ) {
    this.quantity = data.cantidadInicial || 0;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.codigoInput?.nativeElement) {
        this.codigoInput.nativeElement.focus();
      }
    }, 100);
  }

  cancel() { 
    this.dialogRef.close(); 
  }

  register() {
    // Validaciones básicas
    if (this.cantidadLeche <= 0 || this.cantidadFormula <= 0) {
      Swal.fire('Error', 'Complete todos los campos con valores válidos', 'error');
      return;
    }
    
    const suma = this.cantidadLeche + this.cantidadFormula;
    
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
      text: `¿Desea registrar ${this.cantidadLeche}ml de leche autóloga y ${this.cantidadFormula}ml de fórmula?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close({
          success: true,
          cantidadA: this.cantidadLeche,
          cantidadF: this.cantidadFormula,
          type: 'autologaFormula'
        });
      }
    });
  }
}