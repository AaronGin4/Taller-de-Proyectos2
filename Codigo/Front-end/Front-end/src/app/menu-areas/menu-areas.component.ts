import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-areas',
  imports: [CommonModule, RouterModule], // Importaciones necesarias
  templateUrl: './menu-areas.component.html',
  styleUrl: './menu-areas.component.css'
})
export class MenuAreasComponent {
  constructor(private router: Router) {}

  permisos: string[] = [];
  nombreUsuario: string = '';

  ngOnInit(): void {
    //console.log(localStorage.getItem('permisos'));
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      const datos = JSON.parse(usuario);
      const nombres = datos.nombres?.split(' ') || [];
      const apellidos = datos.apellidos?.split(' ') || [];
      const primerNombre = nombres[0] || '';
      const primerApellido = apellidos[0] || '';
      this.nombreUsuario = `${primerNombre} ${primerApellido}`.trim() || 'Invitado';
    } else {
      this.nombreUsuario = 'Invitado';
    }

    const permisosGuardados = localStorage.getItem('permisos');
    if (permisosGuardados) {
      this.permisos = JSON.parse(permisosGuardados);
    }
  }

  Historiaclinica() {
    this.router.navigate(['/menu-historia']);
  }
  Pasedevisita(){
    this.router.navigate(['/pacientes']);
  }
  Almacen(){
    this.router.navigate(['/menu-almacen']);
  }
  Reporte(){
    this.router.navigate(['/reportes']);
  }
  Donanteesterno(){
    this.router.navigate(['/donantes']);
  }
  cerrarSesion(){
    this.router.navigate(['/login']);
  }
  agregarUsuario(){
    this.router.navigate(['/administrar-usuarios']);
  }
  DatosExtra(){
    this.router.navigate(['/datos-extra']);
  }
}