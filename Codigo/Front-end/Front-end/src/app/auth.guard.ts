import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const permisos = JSON.parse(localStorage.getItem('permisos') || '[]') as string[];
    const ruta = state.url.replace('/', '');
  
    const expiracion = localStorage.getItem('expiracion');
    const ahora = new Date().getTime();
    
    if (!expiracion) {
      this.router.navigate(['/login']);
      return true;
    }

    if (!expiracion || ahora > Number(expiracion)) {
      this.router.navigate(['/login']);
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Por favor, inicia sesión nuevamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        localStorage.clear(); // opcional: limpiar todo
        //this.router.navigate(['/login']);
      });
      return false;
    }
  
    if (permisos.includes(ruta)) {
      return true;
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'No tienes permiso para acceder a esta sección.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        this.router.navigate(['/menu-areas']);
      });

      return false;
    }
  }
}
