import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; 
import { AlmacenGuard } from './almacen.guard';
import { UsuariosGuard } from './usuarios.guard';

export const routes: Routes = [
   {
      path: '',
      redirectTo: 'menu-areas',
      pathMatch: 'full'
    },
    {
      path: 'login',
      loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
      path: 'menu-areas',
      loadComponent: () => import('./menu-areas/menu-areas.component').then(m => m.MenuAreasComponent),
        canActivate: [AuthGuard],
    },
    ///////////////////////////////////////
    
    
    {
      path: 'menu-almacen',
      loadComponent: () => import('./menu-almacen/menu-almacen.component').then(m => m.MenuAlmacenComponent),
      canActivate: [AlmacenGuard]
    },
  
    {
      path: 'registro-pasteurizado',
      loadComponent: () => import('./registro-pasteurizado/registro-pasteurizado.component').then(m => m.RegistroPasteurizadoComponent), 
      canActivate: [AlmacenGuard]
    },
  
    
   

    {
      path: 'crear-usuario',
      loadComponent: () => import('./crear-usuario/crear-usuario.component').then(m => m.CrearUsuarioComponent)
        ,canActivate: [UsuariosGuard]  
    },
    
    {
      path: 'administrar-usuarios',
      loadComponent: () => import('./administrar-usuarios/administrar-usuarios.component').then(m => m.AdministrarUsuariosComponent),
      canActivate: [UsuariosGuard]
    },

  {
    path: '**',
    redirectTo: 'menu-areas',
    pathMatch: 'full'
  }

 ];
