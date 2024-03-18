import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from '../reportes-pag-home/reportes.component';
import { ServiciosEnCursoComponent } from '../bodyRptComponents/servicios-en-curso/servicios-en-curso.component';

const routes: Routes = [
  { 
    path: '', 
    component: ReportesComponent,
    children: [
      { path: 'servicios-en-curso', component: ServiciosEnCursoComponent }
    ]
  },
  
  // Usa '**' para manejar cualquier otra ruta desconocida
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
