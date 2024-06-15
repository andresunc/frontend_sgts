import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from '../reportes-pag-home/reportes.component';


const routes: Routes = [
  { 
    path: '', 
    component: ReportesComponent,
    children: [
      
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
