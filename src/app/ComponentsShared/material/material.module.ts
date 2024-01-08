import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';


/**
 * Todo componente material se debe importar y exportar
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  exports: [
    CommonModule,
    MatDividerModule,
    MatTooltipModule,
  ]
})
export class MaterialModule { }
