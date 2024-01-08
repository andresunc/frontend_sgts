import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorComponent } from '../administrador/administrador.component';

const routes: Routes = [
  { path: '', component: AdministradorComponent },
  
  // uso ** evitar error 400 (Éste objeto redirect siempre va al último)
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }
