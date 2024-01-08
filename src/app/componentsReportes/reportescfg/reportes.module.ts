import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from '../reportes/reportes.component';
import { TitleBarModule } from 'src/app/componentsShared/title-bar/title-bar.module';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';


@NgModule({
  declarations: [
    ReportesComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    TitleBarModule, // Uso el módulo de titlebar compartido.
    MaterialModule, // Uso el módulo de material compartido.
  ]
})
export class ReportesModule { }
