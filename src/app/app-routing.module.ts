import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerServiciosComponent } from './componentsServicios/ver-servicios/ver-servicios.component';
import { NewServicioComponent } from './componentsServicios/new-servicio/new-servicio.component';

const routes: Routes = [
  { path: '', component: VerServiciosComponent },
  { path: 'nuevo', component: NewServicioComponent },

  // Hago uso del "lazy loading" para cargar los siguientes módulos por demánda.
  { path: 'reportes', loadChildren: () => import ('./componentsReportes/reportescfg/reportes.module').then(x => x.ReportesModule) },
  { path: 'administrador', loadChildren: () => import ('./componentsAdministrador/administradorcfg/administrador.module').then(x => x.AdministradorModule) },

  // uso ** evitar error 400 (Éste objeto redirect siempre va al último)
  { path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
