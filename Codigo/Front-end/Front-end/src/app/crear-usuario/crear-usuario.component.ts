import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  usuario = {
    profesion: '',
    nombres: '',
    apellidos: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    accesoHC: false,
    accesoPV: false,
    accesoAlmacen: false,
    accesoReportes: false,
    accesoDonantes: false,
    administrador: false
  };

  crearUsuario() {
    // Validación de campos obligatorios
    const camposObligatorios = ['profesion', 'nombres', 'apellidos', 'usuario', 'contrasena'];
    for (const campo of camposObligatorios) {
      if (!this.usuario[campo as keyof typeof this.usuario]) {
        Swal.fire({
          icon: 'warning',
          title: 'Campo obligatorio',
          text: `El campo "${campo}" no puede estar vacío`
        });
        return;
      }
    }
    if (!/^\d{8}$/.test(this.usuario.usuario)) {
      Swal.fire('Error', 'Usuarios debe contener exactamente 8 dígitos numéricos.', 'error');
      return;
    }

    // Validación de contraseña
    if (this.usuario.contrasena !== this.usuario.confirmarContrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Verifica que ambas contraseñas sean iguales'
      });
      return;
    }

    const idGenerado = 'U' + this.usuario.usuario;

    const { confirmarContrasena, ...resto } = this.usuario;

    const nuevoUsuario = {
      ...resto,
      idUsuario: idGenerado,
      accesoHC: resto.accesoHC ? 'Si' : 'No',
      accesoPV: resto.accesoPV ? 'Si' : 'No',
      accesoAlmacen: resto.accesoAlmacen ? 'Si' : 'No',
      accesoReportes: resto.accesoReportes ? 'Si' : 'No',
      accesoDonantes: resto.accesoDonantes ? 'Si' : 'No',
      administrador: resto.administrador ? 'Si' : 'No'
    };

    this.usuariosService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario se ha creado con éxito'
        }).then(() => {
          this.router.navigate(['/administrar-usuarios']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al crear el usuario'
        });
        console.error(err);
      }
    });
  }

  regresar() {
    this.router.navigate(['/administrar-usuarios']);
  }
}
