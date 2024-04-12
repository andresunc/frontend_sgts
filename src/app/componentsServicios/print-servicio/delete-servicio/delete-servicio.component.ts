import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorComponent } from '../editor/editor.component';
import { ServicioEmpresaService } from 'src/app/services/DomainServices/servicio-empresa.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-servicio',
  templateUrl: './delete-servicio.component.html',
  styleUrls: ['./delete-servicio.component.css']
})
export class DeleteServicioComponent {

  constructor(
    private router: Router,
    private servicioEmpresa: ServicioEmpresaService,
    private _snackBar: PopupService,
    public dialogRef: MatDialogRef<EditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  deleteOk() {
    // Suscripción a Servicio Empresa para eliminar de manera lógica de la bd
    this.servicioEmpresa.deleteLogico(this.data.servicioRecibido.idServicio)
      .subscribe(
        () => {
          console.log('ServicioEmpresa Eliminado con éxito:'),
            this._snackBar.errorSnackBar(`Servicio eliminado ID: ${this.data.servicioRecibido.idServicio}`),
            this.router.navigate(['/home']);
        },
        (error) => console.error('Error al eliminar el ServicioEmpresa:', error)
      );
  }

}