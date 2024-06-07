import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServicioEnCurso } from 'src/app/models/RptModels/ServicioEnCurso';

@Component({
  selector: 'app-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.css']
})
export class DataSourceComponent {

  serviciosEnCurso: ServicioEnCurso[] = [];
  
  constructor(public dialogRef: MatDialogRef<DataSourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dataSorce: ServicioEnCurso[] }) {

      this.serviciosEnCurso = data.dataSorce;
  }
}
