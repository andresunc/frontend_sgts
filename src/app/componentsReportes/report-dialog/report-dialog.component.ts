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
      document.body.innerHTML = printContents;
      setTimeout(() => {
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
      }, 10000);
    } else {
      console.error('printableContent is not available');
    }
  }
}