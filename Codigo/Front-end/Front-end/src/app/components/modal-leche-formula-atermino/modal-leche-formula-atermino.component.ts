import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DispensacionService } from '../../services/dispensacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-leche-formula-atermino',
  standalone: true, 
  imports: [ FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './modal-leche-formula-atermino.component.html',
  styleUrl: './modal-leche-formula-atermino.component.css'
})
export class ModalLecheFormulaAterminoComponent {
    quantity: number = 0;
  constructor(
    public dialogRef: MatDialogRef<ModalLecheFormulaAterminoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dispensacionService: DispensacionService
  ) {
    this.quantity = data.cantidadInicial || 0;
  }

  cancel() {
    this.dialogRef.close();
  }

   register() {
    if (this.quantity <= 0) {
      Swal.fire('Error', 'La cantidad debe ser mayor a cero', 'error');
      return;
    }

    Swal.fire({
      title: '¿Confirmar registro?',
      text: `¿Desea registrar ${this.quantity}ml de fórmula a término?`,
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
          quantity: this.quantity,
          type: 'formulaTermino'
        });
      }
    });
  }

}
