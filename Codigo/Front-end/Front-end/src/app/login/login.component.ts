import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
//import { API_URL } from '../conexion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  ngOnInit(): void {
    localStorage.clear();
  }
  errorLogin: boolean = false;
  usuario: string = '';
  contrasena: string = '';
  mostrarContrasena: boolean = false;


  constructor(private router: Router, private http: HttpClient) {}

  login(): void {
    const body = {
      usuario: this.usuario,
      contrasena: this.contrasena
    };

    this.http.post<any>(`${API_URL}/auth/login`, body).subscribe({
      next: (respuesta) => {
        const permisos: string[] = [];
    
        if (respuesta.accesoHC === 'Si') permisos.push('historia');
        if (respuesta.accesoPV === 'Si') permisos.push('pacientes');
        if (respuesta.accesoAlmacen === 'Si') permisos.push('almacen');
        if (respuesta.accesoReportes === 'Si') permisos.push('reportes');
        if (respuesta.accesoDonantes === 'Si') permisos.push('donantes');
        if (respuesta.administrador ==='Si') permisos.push('usuarios');
        permisos.push('menu-areas');
        
        localStorage.setItem('permisos', JSON.stringify(permisos));
        localStorage.setItem('usuario', JSON.stringify(respuesta));
    
        const expiracion = new Date().getTime() + 2 * 60 * 60 * 1000;
        localStorage.setItem('expiracion', expiracion.toString());
    
        Swal.fire({
          title: "¡Bienvenido!",
          text: "Has iniciado sesión correctamente",
          icon: "success",
          timer: 1000, // Cierra automáticamente después de 2 segundos
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/menu-areas']);
        });
      },
      error: () => {
        this.errorLogin = true;
        Swal.fire({
          title: "Error",
          html: "Usuario o contraseña incorrectos<br><br>Si no tiene credenciales comuníquese con su Coordinador",
          icon: "error",
          confirmButtonText: "Entendido"
        });
      }
    });
  }
}