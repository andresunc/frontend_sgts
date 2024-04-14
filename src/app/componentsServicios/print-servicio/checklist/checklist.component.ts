import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from 'src/app/componentsShared/add-item/add-item.component';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent {

  dataSourceItems: ItemChecklistDto[];
  avance: number = 0;
  editable: boolean = false;

  constructor(
    private dataShared: DataSharedService,
    private svManager: ManagerService,
    public dialog: MatDialog,) {
    this.dataSourceItems = this.dataShared.getSharedObject().itemChecklistDto;
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

  openAddItemComponent() {
    this.dialog.open(AddItemComponent);
  }
}
