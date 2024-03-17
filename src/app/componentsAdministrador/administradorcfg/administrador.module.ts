import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { AdministradorComponent } from '../administrador/administrador.component';
import { TitleBarModule } from 'src/app/componentsShared/title-bar/title-bar.module';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';
import { CfgServiciosComponent } from '../bodyAdminComponents/cfg-servicios/cfg-servicios.component';
import { CfgClientesComponent } from '../bodyAdminComponents/cfg-clientes/cfg-clientes.component';
import { ConfigMenuComponent } from 'src/app/componentsShared/config-menu/config-menu.component';


@NgModule({
  declarations: [
    AdministradorComponent,
    CfgServiciosComponent,
    CfgClientesComponent,
    ConfigMenuComponent,
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    TitleBarModule, // Uso el módulo de titlebar compartido.
    MaterialModule, // Uso el módulo de material compartido.
    
  ]
})
export class AdministradorModule { }
