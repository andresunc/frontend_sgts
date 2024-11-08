import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { AdministradorComponent } from '../administrador/administrador.component';
import { TitleBarModule } from 'src/app/componentsShared/title-bar/title-bar.module';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';
import { CfgServiciosComponent } from '../bodyAdminComponents/cfg-servicios/cfg-servicios.component';
import { CfgClientesComponent } from '../bodyAdminComponents/cfg-clientes/cfg-clientes.component';
import { ConfigMenuComponent } from 'src/app/componentsShared/config-menu/config-menu.component';
import { CfgRubrosComponent } from '../bodyAdminComponents/cfg-rubros/cfg-rubros.component';
import { CfgRiesgosComponent } from '../bodyAdminComponents/cfg-riesgos/cfg-riesgos.component';
import { CfgEstadosComponent } from '../bodyAdminComponents/cfg-estados/cfg-estados.component';

import { MatStepperModule } from '@angular/material/stepper';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CfgItemsComponent } from '../bodyAdminComponents/cfg-items/cfg-items.component';
import { CfgUsuariosComponent } from '../bodyAdminComponents/cfg-usuarios/cfg-usuarios.component';
import { ReasignacionComponent } from '../bodyAdminComponents/reasignacion/reasignacion.component';




@NgModule({
  declarations: [
    AdministradorComponent,
    CfgServiciosComponent,
    CfgClientesComponent,
    ConfigMenuComponent,
    CfgRubrosComponent,
    CfgRiesgosComponent,
    CfgEstadosComponent,
    CfgItemsComponent,
    CfgUsuariosComponent,
    ReasignacionComponent
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    TitleBarModule, // Uso el módulo de titlebar compartido.
    MaterialModule, // Uso el módulo de material compartido.
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatFormFieldModule,
    
  ]
})
export class AdministradorModule { }
