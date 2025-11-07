import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; 
import { AlmacenGuard } from './almacen.guard';
import { HistoriaGuard } from './historia.guard';
import { UsuariosGuard } from './usuarios.guard';
import { PacientesGuard } from './pacientes.guard';
import DispensacionComponent from './dispensacion/dispensacion.component';

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
      path: 'registro-autologa',
      loadComponent: () => import('./registro-autologa/registro-autologa.component').then(m => m.RegistroAutologaComponent)
      ,canActivate: [AlmacenGuard]
    },
    {
      path: 'leches-disponibles',
      loadComponent: () => import('./leches-disponibles/leches-disponibles.component').then(m => m.LechesDisponiblesComponent),
      canActivate: [AlmacenGuard]
    },
     { path: 'pase-de-visita/:id/:idcuna', loadComponent: () => import('./pase-de-visita/pase-de-visita.component'),canActivate: [PacientesGuard] },
    { 
    path: 'dispensacion/:idPaciente/:idCuna', 
    component: DispensacionComponent 
    ,canActivate: [PacientesGuard]
  },
    {
      path: 'ver-pase-de-visita',
      loadComponent: () => import('./ver-pase-de-visita/ver-pase-de-visita.component')
      ,canActivate: [PacientesGuard]
    },
    { path: 'ver-pase-de-visita/:id/:idcuna', loadComponent: () => import('./ver-pase-de-visita/ver-pase-de-visita.component'),
      canActivate: [PacientesGuard]
    },
    
    {path: 'pacientes', loadComponent: () => import('./pacientes/pacientes.component') ,canActivate: [PacientesGuard] },
    {
      path: 'menu-historia',
      loadComponent: () => import('./menu-historia/menu-historia.component').then(m => m.MenuHistoriaComponent),
      canActivate: [HistoriaGuard]
    },
    
     {
      path: 'ver-historia-clinica/:idPaciente',
      loadComponent: () => import('./ver-historia-clinica/ver-historia-clinica.component')  
      ,canActivate: [HistoriaGuard]
    },
     {
      path: 'crear-historia-clinica', 
      loadComponent: () => import('./crear-historia-clinica/crear-historia-clinica.component')
      ,canActivate: [HistoriaGuard]
    },
    {
      path: 'buscar-historia-clinica',
      loadComponent: () => import('./buscar-historia-clinica/buscar-historia-clinica.component')
      ,canActivate: [HistoriaGuard]
    },
 {
      path: 'actualizar-historia-clinica/:idPaciente',
      loadComponent: () => import('./actualizar-historia-clinica/actualizar-historia-clinica.component')
      ,canActivate: [HistoriaGuard]
    },
     {
      path: 'reporte-por-paciente/:idPaciente',
      loadComponent: () => import('./reporte-por-paciente/reporte-por-paciente.component').then(m => m.ReportePorPacienteComponent)
      ,canActivate: [HistoriaGuard]
    },

  {
    path: '**',
    redirectTo: 'menu-areas',
    pathMatch: 'full'
  }

 ];
