import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-almacen',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importaciones necesarias
  templateUrl: './menu-almacen.component.html',
  styleUrls: ['./menu-almacen.component.css']
})
export class MenuAlmacenComponent {
  constructor(private router: Router) {}

  Registropasteurizada() {
    this.router.navigate(['/registro-pasteurizado']);
  }
  Registroautologa(){
    this.router.navigate(['/registro-autologa']);
  }
  lechesdiponibles(){
    this.router.navigate(['/leches-disponibles']);
  }
  Regresar(){
    this.router.navigate(['/menu-areas']);
  }
}
