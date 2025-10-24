import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { DispensacionService } from '../../services/dispensacion.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-leche-formula-pretermino',
    standalone: true, 
  imports: [FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './modal-leche-formula-pretermino.component.html',
  styleUrl: './modal-leche-formula-pretermino.component.css'
})
export class ModalLecheFormulaPreterminoComponent {
quantity: number = 0;
constructor(
    public dialogRef: MatDialogRef<ModalLecheFormulaPreterminoComponent>,
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
      text: `¿Desea registrar ${this.quantity}ml de fórmula pretérmino?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Cerramos el modal con los datos sin multiplicar
        this.dialogRef.close({
          success: true,
          quantity: this.quantity,
          type: 'formulaPretermino'
        });
      }
    });
  }
}
