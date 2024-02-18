import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ContactoEmpesa } from 'src/app/models/ContactoEmpresa';
import ManagerService from 'src/app/services/ServiceSupports/ManagerService';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-print-servicio',
  templateUrl: './print-servicio.component.html',
  styleUrls: ['./print-servicio.component.css']
})
export class PrintServicioComponent {

  servicioRecibido: any;
  title: string = 'Información del servicio: ';
  recurrencia: number;
  avance: number;
  contactoEmpresa: ContactoEmpesa[] = [];

  constructor(private dataShared: DataSharedService, public dialog: MatDialog,
    private svManager: ManagerService,private printService: PrintService) {
    this.servicioRecibido = this.dataShared.getSharedObject();
    this.title = this.title + this.servicioRecibido.cliente + ' | ' + this.servicioRecibido.tipo;
    this.avance = this.svManager.calcularAvance(this.servicioRecibido);
    this.recurrencia = this.servicioRecibido.recurrencia;
    this.getContactoEmpresa();
  }

  updateAvance(item: any) {
    console.log('Servicio recibido: ', this.servicioRecibido);
    item.completo = !item.completo;
    this.avance = this.svManager.calcularAvance(this.servicioRecibido);
  }

  updateNotificado(item: any) {
    item.notificado = !item.notificado;
  }

  private getContactoEmpresa() {
    this.printService.getContactoEmpresa(this.servicioRecibido.idCliente).subscribe(
      (data) => {
        this.contactoEmpresa = data;
        console.log('Contactos de la empresa: ', data);
      },
      (error) => {
        console.error('Error al consultar los contactos de la empresa', error);
      }
    );
  }

  // Función para mostrar el servicio por modal
  openDialog() {
    this.dataShared.setSharedMessage(this.contactoEmpresa);
    const dialogRef = this.dialog.open(DialogModal);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Resultado del modal: ${result}`);
    });

  }


}

/**
 * Este es el componente modal. Exportado para usar el html
 */
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'ShowContacts.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatTableModule]
})
export class DialogModal {
  
  contacts: any;
  displayedColumns: string[] = ['nombre', 'apellido', 'telefono', 'email'];
  dataSource: any;

  constructor(private dataShared: DataSharedService) {
    this.contacts = this.dataShared.getSharedMessage();
    this.dataSource = this.contacts;
  }
}
