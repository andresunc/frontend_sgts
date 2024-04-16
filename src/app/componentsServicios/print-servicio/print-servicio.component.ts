import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from 'src/app/componentsShared/add-item/add-item.component';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';
import { ContactoEmpresa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PrintService } from 'src/app/services/print.service';
import { EditorComponent } from './editor/editor.component';
import { DeleteServicioComponent } from './delete-servicio/delete-servicio.component';
import { ChecklistComponent } from './checklist/checklist.component';

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
  

  constructor(
    private dataShared: DataSharedService,
    public dialog: MatDialog,
    private svManager: ManagerService,
    private printService: PrintService,
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
    this.dialog.open(ChecklistComponent);
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
