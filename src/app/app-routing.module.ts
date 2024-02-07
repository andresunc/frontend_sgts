import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerServiciosComponent } from './componentsServicios/ver-servicios/ver-servicios.component';
import { NewServicioComponent } from './componentsServicios/new-servicio/new-servicio.component';
import { PrintServicioComponent } from './componentsServicios/print-servicio/print-servicio.component';


const routes: Routes = [
  { path: 'home', component: VerServiciosComponent },
  { path: 'nuevo', component: NewServicioComponent },
  { path: 'home/servicio', component: PrintServicioComponent },

   // Hago uso del "lazy loading" para cargar los siguientes módulos por demánda.
  { path: 'reportes', loadChildren: () => import ('./componentsReportes/reportescfg/reportes.module').then(x => x.ReportesModule) },
  { path: 'administrador', loadChildren: () => import ('./componentsAdministrador/administradorcfg/administrador.module').then(x => x.AdministradorModule) },
  // uso ** evitar error 400 (Éste objeto redirect siempre va al último)
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', redirectTo: 'home', pathMatch: 'full'},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
