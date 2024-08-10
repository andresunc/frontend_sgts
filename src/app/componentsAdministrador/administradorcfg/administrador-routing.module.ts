import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorComponent } from '../administrador/administrador.component';
import { CfgClientesComponent } from '../bodyAdminComponents/cfg-clientes/cfg-clientes.component';
import { CfgServiciosComponent } from '../bodyAdminComponents/cfg-servicios/cfg-servicios.component';
import { CfgRubrosComponent } from '../bodyAdminComponents/cfg-rubros/cfg-rubros.component';
import { CfgRiesgosComponent } from '../bodyAdminComponents/cfg-riesgos/cfg-riesgos.component';
import { CfgEstadosComponent } from '../bodyAdminComponents/cfg-estados/cfg-estados.component';
import { AuthGuard } from 'src/app/componentsShared/guards/auth.guard';
import { CfgItemsComponent } from '../bodyAdminComponents/cfg-items/cfg-items.component';
import { CfgUsuariosComponent } from '../bodyAdminComponents/cfg-usuarios/cfg-usuarios.component';
import { ReasignacionComponent } from '../bodyAdminComponents/reasignacion/reasignacion.component';

const routes: Routes = [
  { path: '', 
  component: AdministradorComponent,
  children:[ 
    { path: 'clientes', component: CfgClientesComponent,canActivate: [AuthGuard] },
    { path: 'servicios', component: CfgServiciosComponent,canActivate: [AuthGuard] },
    { path: 'rubros', component: CfgRubrosComponent,canActivate: [AuthGuard] },
    { path: 'riesgos', component: CfgRiesgosComponent,canActivate: [AuthGuard] },
    { path: 'estados', component: CfgEstadosComponent, canActivate: [AuthGuard]},
    { path: 'items', component: CfgItemsComponent, canActivate: [AuthGuard]},
    { path: 'reasignacion', component: ReasignacionComponent, canActivate: [AuthGuard]},
    { path: 'usuarios', component: CfgUsuariosComponent, /*canActivate: [AuthGuard]*/},
  ]
},
  
  
  // uso ** evitar error 400 (Éste objeto redirect siempre va al último)
  { path: '**', redirectTo: 'usuarios', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }
