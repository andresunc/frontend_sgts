import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.css']
})
export class ReportDialogComponent implements OnInit{
  title!: string;
  @ViewChild('printableContent', { static: false }) printableContent?: ElementRef;
  
  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { templateRef: TemplateRef<HTMLElement>, title: string }
  ) {
    this.title = data.title; // Asignar el título recibido
  }

  ngOnInit(): void {
    // Código de inicialización si es necesario
  }

  printContent(): void {
    setTimeout(() => {
      if (this.printableContent) {
        const printContents = this.printableContent.nativeElement.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
      } else {
        console.error('printableContent is not available');
      }
    }, 1000); 
  }
}
