import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitleBarRoutingModule } from './title-bar-routing.module';
import { TitleBarComponent } from './title-bar.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    TitleBarComponent
  ],
  imports: [
    CommonModule,
    TitleBarRoutingModule,
    MaterialModule, // Uso el módulo de material compartido.
  ],
  exports: [
    TitleBarComponent, // Exporto al componente título dentro del módulo título
  ]
})
export class TitleBarModule { }
