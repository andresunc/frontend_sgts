import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  title!: string;

  constructor(
    public dialogRef: MatDialogRef<InstructorComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { templateRef: TemplateRef<HTMLElement>, title: string }
  ) {
    this.title = data.title; // Asignar el título recibido
  }

  ngOnInit(): void {
    // Código de inicialización si es necesario
  }
}
