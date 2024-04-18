import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditorComponent } from 'src/app/componentsServicios/print-servicio/editor/editor.component';
import { ServicioEmpresaService } from 'src/app/services/DomainServices/servicio-empresa.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent {

  message: string;

  constructor(public dialogRef: MatDialogRef<DeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }) {
      this.message = data.message;
     }

  checkDelete(result: boolean): void {
    this.dialogRef.close(result);
  }
  
}
