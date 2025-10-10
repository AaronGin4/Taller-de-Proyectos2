import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.css'
})
export class AdministrarUsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  editarUsuario(usuario: any) {
    this.router.navigate(['/editar-usuario', usuario.idUsuario]);
  }

  eliminarUsuario(id: string) {
    const usuarioAEliminar = this.usuarios.find(u => u.idUsuario === id);

    if (usuarioAEliminar?.administrador === 'Si') {
      const totalAdmins = this.usuarios.filter(u => u.administrador === 'Si').length;

      if (totalAdmins <= 1) {
        Swal.fire({
          icon: 'warning',
          title: 'Acción no permitida',
          text: 'No puedes eliminar al último usuario con rol de administrador.'
        });
        return;
      }
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuario(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Usuario eliminado con éxito', 'success');
            this.cargarUsuarios();
          },
          error: (err) => {
            Swal.fire('Error', 'Error al eliminar el usuario', 'error');
            console.error(err);
          }
        });
      }
    });
  }

  nuevoUsuario() {
    this.router.navigate(['/crear-usuario']);
  }

  regresar() {
    this.router.navigate(['/menu-areas']);
  }
}
