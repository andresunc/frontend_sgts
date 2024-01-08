import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';


/**
 * Todo componente material se debe importar y exportar
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDividerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatIconModule,
  ],
  exports: [
    CommonModule,
    MatDividerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatIconModule
  ]
})
export class MaterialModule { }
