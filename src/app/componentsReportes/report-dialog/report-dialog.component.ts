import { Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.css']
})
export class ReportDialogComponent implements OnInit {
  title!: string;
  @ViewChild('printableContent', { static: true }) printableContent?: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { templateRef: TemplateRef<HTMLElement>, title: string }
  ) {
    this.title = data.title;
  }

  ngOnInit(): void { }

  printContent(): void {
    if (this.printableContent) {
      const printContents = this.printableContent.nativeElement.innerHTML;
      const originalContents = document.body.innerHTML;
  
      // Añadir estilos CSS para imprimir solo las páginas impares
      const style = document.createElement('style');
      style.type = 'text/css';
      style.media = 'print';
      style.innerHTML = `
        @media print {
          body {
            display: block;
          }
          @page {
            size: A4;
            margin: 0;
          }
          body > *:nth-child(odd) {
            display: block;
          }
          body > *:nth-child(even) {
            display: none;
          }
        }
      `;
  
      document.head.appendChild(style);
      document.body.innerHTML = printContents;
  
      setTimeout(() => {
        window.print();
        document.body.innerHTML = originalContents;
        document.head.removeChild(style); // Eliminar los estilos después de la impresión
        window.location.reload();
      }, 10000);
    } else {
      console.error('printableContent is not available');
    }
  }
  
}