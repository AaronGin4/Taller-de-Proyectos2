import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-menu-historia',
  templateUrl: './menu-historia.component.html',
  styleUrls: ['./menu-historia.component.css']
})
export class MenuHistoriaComponent {
  constructor(private router: Router) {}

  CrearHistoriaClinica() {
    this.router.navigate(['/crear-historia-clinica']);
  }

  BuscarHistoriaClinica() {
    this.router.navigate(['/buscar-historia-clinica']);
  }

  Regresar() {
    this.router.navigate(['/menu-areas']);
  }
}
