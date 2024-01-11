import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorComponent } from '../administrador/administrador.component';
import { CfgClientesComponent } from '../bodyAdminComponents/cfg-clientes/cfg-clientes.component';
import { CfgServiciosComponent } from '../bodyAdminComponents/cfg-servicios/cfg-servicios.component';

const routes: Routes = [
  { path: '', component: AdministradorComponent },
  { path: 'clientes', component: CfgClientesComponent },
  { path: 'servicios', component: CfgServiciosComponent },
  
  // uso ** evitar error 400 (Éste objeto redirect siempre va al último)
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }
