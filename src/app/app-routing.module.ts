import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerServiciosComponent } from './componentsServicios/ver-servicios/ver-servicios.component';
import { NewServicioComponent } from './componentsServicios/new-servicio/new-servicio.component';
import { ReportesComponent } from './componentsReportes/reportes/reportes.component';

const routes: Routes = [
  { path: '', component: VerServiciosComponent },
  { path: 'nuevo', component: NewServicioComponent },
  { path: 'reportes', component: ReportesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
