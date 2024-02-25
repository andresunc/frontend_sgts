import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewServicioComponent } from '../new-servicio.component';


const routes: Routes = [
  { path: '', component: NewServicioComponent },
  
  // uso ** evitar error 400 (Éste objeto redirect siempre va al último)
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewServicioRoutingModule { }