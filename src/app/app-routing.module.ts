import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerServiciosComponent } from './componentsServicios/ver-servicios/ver-servicios.component';
import { NewServicioComponent } from './componentsServicios/new-servicio/new-servicio.component';
import { PrintServicioComponent } from './componentsServicios/print-servicio/print-servicio.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Nueva ruta para LoginComponent
  { path: 'home', component: VerServiciosComponent },
  { path: 'nuevo', component: NewServicioComponent },
  { path: 'home/servicio', component: PrintServicioComponent },

  // Hago uso del "lazy loading" para cargar los siguientes módulos por demánda.
  { path: 'reportes', loadChildren: () => import ('./componentsReportes/reportescfg/reportes.module').then(x => x.ReportesModule) },
  //{ path: 'administrador', loadChildren: () => import ('./componentsAdministrador/administradorcfg/administrador.module').then(x => x.AdministradorModule) },
  { path: 'administrador/home', loadChildren: () => import('./componentsAdministrador/administradorcfg/administrador.module').then(x => x.AdministradorModule) },
  // uso ** evitar error 400 (Éste objeto redirect siempre va al último)W
  { path: '', redirectTo: 'login', pathMatch: 'full'}, // Redirige a la pantalla de inicio de sesión por defecto
  { path: '**', redirectTo: 'login', pathMatch: 'full'}, // Redirige a la pantalla de inicio de sesión para cualquier ruta desconocida
  //{ path: '', redirectTo: 'home', pathMatch: 'full'},
  //{ path: '**', redirectTo: 'home', pathMatch: 'full'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
