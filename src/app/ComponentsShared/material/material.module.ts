import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';

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
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDialogModule,
    MatMenuModule,
    MatListModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCheckboxModule,
  ],
  exports: [
    CommonModule,
    MatDividerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDialogModule,
    MatMenuModule,
    MatListModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCheckboxModule,
  ]
})
export class MaterialModule { }
