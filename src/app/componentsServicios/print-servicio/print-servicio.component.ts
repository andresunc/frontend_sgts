import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from 'src/app/componentsShared/add-item/add-item.component';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';
import { ContactoEmpesa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PrintService } from 'src/app/services/print.service';
import { EditorComponent } from './editor/editor.component';
import { DeleteServicioComponent } from './delete-servicio/delete-servicio.component';

@Component({
  selector: 'app-print-servicio',
  templateUrl: './print-servicio.component.html',
  styleUrls: ['./print-servicio.component.css']
})
export class PrintServicioComponent implements OnInit {

  servicioRecibido!: Servicios;
  title: string = 'Información del servicio: ';
  recurrencia: number = 0;
  contactoEmpresa: ContactoEmpesa[] = [];
  

  constructor(
    private dataShared: DataSharedService,
    public dialog: MatDialog,
    private svManager: ManagerService,
    private printService: PrintService,
    private _snackBar: PopupService
  ) { }

  getSvManager() {
    return this.svManager;
  }

  ngOnInit() {
    this.loadServicioRecibido();
  }

  loadServicioRecibido() {
    // Intentará obtener el servicio desde localStorage
    this.servicioRecibido = JSON.parse(localStorage.getItem('servicioRecibido') || '{}');
    // Si no está en localStorage, obtenerlo de dataShared y guardarlo en localStorage
    if (!this.servicioRecibido) {
      this.servicioRecibido = this.dataShared.getSharedObject();
      localStorage.setItem('servicioRecibido', JSON.stringify(this.servicioRecibido));
    }

    this.title = this.title + this.servicioRecibido.cliente + ' | ' + this.servicioRecibido.tipo;
    //this.avance = this.svManager.calcularAvance(this.servicioRecibido);
    this.recurrencia = this.servicioRecibido.recurrencia;
    this.getContactoEmpresa();
  }

  /**
   * Función para activar la edición de los items 
   * (Refactorizar segun permisos de usuario)
   */
  editable: boolean = false;
  editarServicio() {
    this.editable = !this.editable;
    
    if (this.editable) console.log('Ahora es posible editar las características de ésta página');

    this.dialog.open(EditorComponent, {
      data: { servicioRecibido: this.servicioRecibido } //
    });
  }

  eliminarServicio() {
    this.dialog.open(DeleteServicioComponent, {
      data: { servicioRecibido: this.servicioRecibido } //
    });
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

  // Función para mostrar el PopUp de contactos
  openContactPopUp() {
    this.dataShared.setSharedMessage(this.contactoEmpresa);
    this.dialog.open(ContactPopUp);
  }

  openChecklistPopUp() {
    this.dataShared.setSharedObject(this.servicioRecibido);
    this.dialog.open(ChecklistPopUp);
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

// Modal para mostrar el checklist del servicio
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'print-item.html',
  styleUrls: ['./print-servicio.component.css'],
  standalone: true,
  imports: [MaterialModule, CommonModule]
})
export class ChecklistPopUp {

  dataSource: ItemChecklistDto[];
  avance: number = 0;
  editable: boolean = false;

  constructor(
    private dataShared: DataSharedService,
    private svManager: ManagerService,
    public dialog: MatDialog,) {
    this.dataSource = this.dataShared.getSharedObject().itemChecklistDto;
    this.avance = this.svManager.calcularAvance(this.dataShared.getSharedObject());
  }

  updateAvance(item: any) {
    item.completo = !item.completo;
    this.avance = this.svManager.calcularAvance(this.dataShared.getSharedObject());
  }

  // Función para detectar cambios en el listado de items
  modified: boolean = false;
  indicesCambiados: number[] = [];
  getChange(index: number) {
    // Verifica si el índice ya está en el array
    const indexEncontrado = this.indicesCambiados.indexOf(index);
    indexEncontrado === -1 ? this.indicesCambiados.push(index) : this.indicesCambiados.splice(indexEncontrado, 1);
    // Verificar si hay cambios finalmente
    this.modified = this.indicesCambiados.length > 0;
  }

  updateNotificado(item: any) {
    item.notificado = !item.notificado;
  }

  openItemPopUp() {
    this.dialog.open(AddItemComponent);
  }

}
