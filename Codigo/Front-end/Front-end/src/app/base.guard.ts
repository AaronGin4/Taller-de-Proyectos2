// base.guard.ts
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';

export abstract class BaseGuard implements CanActivate {

  constructor(protected router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
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
        localStorage.clear();
        //this.router.navigate(['/login']);
      });
      return false;
    }

    return this.checkPermiso();
  }

  abstract checkPermiso(): boolean;
}
