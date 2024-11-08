import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from '../reportes-pag-home/reportes.component';
import { TitleBarModule } from 'src/app/componentsShared/title-bar/title-bar.module';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [
    ReportesComponent,
    
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    TitleBarModule, // Uso el módulo de titlebar compartido.
    MaterialModule, // Uso el módulo de material compartido.
    NgChartsModule,
    [MatCardModule, MatButtonModule],
  ]
})
export class ReportesModule { }
