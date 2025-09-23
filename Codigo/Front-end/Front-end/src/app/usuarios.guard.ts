// historia.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseGuard } from './base.guard';

@Injectable({
  providedIn: 'root'
})
export class UsuariosGuard extends BaseGuard {
  constructor(router: Router) {
    super(router);
  }

  checkPermiso(): boolean {
    const permisos = JSON.parse(localStorage.getItem('permisos') || '[]') as string[];
    if (permisos.includes('usuarios')) {
      return true;
    }

    this.router.navigate(['/menu-areas']);
    Swal.fire({
      icon: 'warning',
      title: 'Acceso Denegado',
      text: 'No tienes permiso para acceder a esta sección.',
      confirmButtonText: 'Entendido'
      });

    return false;
  }
}
