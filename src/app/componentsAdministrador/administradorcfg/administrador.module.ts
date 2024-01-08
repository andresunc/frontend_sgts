import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { AdministradorComponent } from '../administrador/administrador.component';
import { TitleBarModule } from 'src/app/componentsShared/title-bar/title-bar.module';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';


@NgModule({
  declarations: [
    AdministradorComponent
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    TitleBarModule, // Uso el módulo de titlebar compartido.
    MaterialModule, // Uso el módulo de material compartido.
  ]
})
export class AdministradorModule { }
