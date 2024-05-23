import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent {

  message: string;
  title: string;
  action: string;

  constructor(public dialogRef: MatDialogRef<DeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title?: string, action?: string }) {
    this.message = data.message;
    this.title = data.title || 'Confirmación de eliminación';
    this.action = data.action || 'Sí, Eliminar';
  }

  checkDelete(result: boolean): void {
    this.dialogRef.close(result);
  }

}