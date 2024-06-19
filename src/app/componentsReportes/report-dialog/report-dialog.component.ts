import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.css']
})
export class ReportDialogComponent implements OnInit{
  title!: string;
  
  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { templateRef: TemplateRef<HTMLElement>, title: string }
  ) {
    this.title = data.title; // Asignar el título recibido
  }

  ngOnInit(): void {
    // Código de inicialización si es necesario
  }

}
