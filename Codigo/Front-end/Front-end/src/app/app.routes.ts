import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; 

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
      canActivate: []
    },
    
    {
    path: '**',
    redirectTo: 'menu-areas',
    pathMatch: 'full'
    }

 ];
