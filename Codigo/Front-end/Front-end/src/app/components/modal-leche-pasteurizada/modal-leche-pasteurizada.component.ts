import { Component, Inject } from '@angular/core'; 
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { DispensacionService } from '../../services/dispensacion.service'; 
import { FormsModule } from '@angular/forms'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button'; 
import Swal from 'sweetalert2'; 
 
@Component({ 
  selector: 'app-modal-leche-pasteurizada', 
  standalone: true,  
  imports: [ 
    FormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatButtonModule 
  ], 
  templateUrl: './modal-leche-pasteurizada.component.html', 
  styleUrls: ['./modal-leche-pasteurizada.component.css'] 
}) 
export class ModalLechePasteurizadaComponent { 
  code: string = ''; 
  quantity: number = 0; 
 
  constructor( 
    public dialogRef: MatDialogRef<ModalLechePasteurizadaComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dispensacionService: DispensacionService 
  ) { 
    this.quantity = data.cantidadInicial || 0; 
  } 
 
  cancel() { 
    this.dialogRef.close(); 
  } 
 
 register() {
  if (!this.code) {
    Swal.fire('Error', 'El código de leche es requerido', 'error');
    return;
  }

  if (this.quantity <= 0) {
    Swal.fire('Error', 'La cantidad debe ser mayor a cero', 'error');
    return;
  }

  Swal.fire({
    title: '¿Confirmar registro?',
    text: `¿Registrar ${this.quantity}ml de leche con código ${this.code}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, registrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Solo validamos el lote, no registramos aún
      this.validarLote();
    }
  });
}
  private validarLote() {
  Swal.fire({
    title: 'Validando lote...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  this.dispensacionService.verificarLotePasteurizada(this.code).subscribe({
    next: () => {
      this.dialogRef.close({
        success: true,
        quantity: this.quantity,
        type: 'pasteurizada',
        codigo: this.code
      });
    },
    error: (error) => {
      console.error('Error al validar lote', error);
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
