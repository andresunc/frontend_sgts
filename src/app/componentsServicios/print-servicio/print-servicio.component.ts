import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';
import { ContactoEmpresa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PrintService } from 'src/app/services/print.service';
import { EditorComponent } from './editor/editor.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ServicioEmpresaService } from 'src/app/services/DomainServices/servicio-empresa.service';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';
import { AuthService } from 'src/app/services/auth.service';
import { ServicioService } from 'src/app/services/ServiciosDto/ServicioService';

@Component({
  selector: 'app-print-servicio',
  templateUrl: './print-servicio.component.html',
  styleUrls: ['./print-servicio.component.css']
})
export class PrintServicioComponent implements OnInit {

  servicioRecibido!: Servicios;
  title: string = 'Información del servicio: ';
  recurrencia: number = 0;
  contactoEmpresa: ContactoEmpresa[] = [];
  authorized: boolean = false;


  constructor(
    private dataShared: DataSharedService,
    public dialog: MatDialog,
    private svManager: ManagerService,
    private printService: PrintService,
    private servicioEmpresa: ServicioEmpresaService,
    private router: Router,
    private _snackBar: PopupService,
    private authService: AuthService,
    private servicioService: ServicioService
  ) { 
    this.servicioRecibido = this.getServicioLocalStorage();
  }

  ngOnInit() {
    this.setParams();
    this.authorized = this.authService.isAdmin();
    this.getServicioById(this.servicioRecibido.idServicio);
  }

  getSvManager() {
    return this.svManager;
  }

  getServicioLocalStorage(): Servicios {
    return JSON.parse(localStorage.getItem('servicioRecibido') || '{}');
  }

  getServicioById(idServicio: number) {
    this.dataShared.mostrarSpinner();
    this.servicioService.getServicioById(idServicio)
      .subscribe(
        (data: Servicios) => {
          this.servicioRecibido = data;
          this.dataShared.ocultarSpinner();
        }
      )
  }

  setParams() {
    this.title = this.title + this.servicioRecibido.cliente + ' | ' + this.servicioRecibido.tipo;
    this.recurrencia = this.servicioRecibido.recurrencia;
    this.getContactoEmpresa();
  }

  editarServicio() {
    this.dataShared.setSharedObject(this.servicioRecibido);
    const dialogRef = this.dialog.open(EditorComponent, {
      data: { servicioRecibido: this.servicioRecibido } //
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getServicioById(this.servicioRecibido.idServicio);
    });
  }

  checkDelete(): void {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: { message: `¿Borrar el servicio ID: ${this.servicioRecibido.idServicio}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarServicio();
      } else {
        console.log('Se canceló la eliminación');
      }
    });
  }

  eliminarServicio() {
    // Suscripción a Servicio Empresa para eliminar de manera lógica de la bd
    this.servicioEmpresa.deleteLogico(this.servicioRecibido.idServicio)
      .subscribe(
        () => {
          console.log('ServicioEmpresa Eliminado con éxito:'),
            this._snackBar.errorSnackBar(`Servicio eliminado ID: ${this.servicioRecibido.idServicio}`),
            this.router.navigate(['/home']);
        },
        (error) => console.error('Error al eliminar el ServicioEmpresa:', error)
      );
  }

  private getContactoEmpresa() {
    this.printService.getContactoEmpresa(this.servicioRecibido.idCliente).subscribe(
      (data) => {
        this.contactoEmpresa = data;
        console.log('Contactos de la empresa: ', data);
      }
    );
  }

  // Función para mostrar el PopUp de contactos
  openContactPopUp() {
    this.dataShared.setSharedMessage(this.contactoEmpresa);
    this.dialog.open(ContactPopUp);
  }

  openChecklistPopUp() {
    // si no está finalizado
    if (this.servicioRecibido.idCategoria != 3) {
      this.dataShared.setSharedObject(this.servicioRecibido);
      const dialogRef = this.dialog.open(ChecklistComponent);

      dialogRef.afterClosed().subscribe(() => {
        // Se ejecutará cuando se cierre el modal del checklist
        this.dataShared.setSharedObject(this.servicioRecibido);
        this.getServicioById(this.servicioRecibido.idServicio);
      });
    } else {
      this._snackBar.warnSnackBar(`El servicio ha ${this.servicioRecibido.categoria.toLowerCase()}`)
    }
  }

}

// Modal para mostrar los contactos de la empresa
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'show-contacts.html',
  standalone: true,
  imports: [MaterialModule, CommonModule]
})
export class ContactPopUp {

  contacts: any;
  displayedColumns: string[] = ['nombre', 'apellido', 'telefono', 'email'];
  dataSource: any;

  constructor(private dataShared: DataSharedService) {
    this.contacts = this.dataShared.getSharedMessage();
    this.dataSource = this.contacts;
  }
}
