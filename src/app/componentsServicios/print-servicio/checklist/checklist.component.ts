import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from 'src/app/componentsShared/add-item/add-item.component';
import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import { ItemChecklistService } from 'src/app/services/DomainServices/item-checklist.service';
import { ServicioService } from 'src/app/services/ServiciosDto/ServicioService';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit {

  dataSourceItems: ItemChecklistDto[];
  avance: number = 0;
  editable: boolean = false;
  servicio: Servicios | null = null;

  constructor(
    private dataShared: DataSharedService,
    private svManager: ManagerService,
    private servicioService: ServicioService,
    private itemChecklistService: ItemChecklistService,
    private authService: AuthService,
    private _snackBar: PopupService,
    public dialog: MatDialog) {
    this.servicio = this.dataShared.getSharedObject();
    this.dataSourceItems = this.dataShared.getSharedObject().itemChecklistDto;
    this.avance = this.svManager.calcularAvance(this.dataShared.getSharedObject());
  }

  ngOnInit(): void {
    // Escucha los eventos de actualización
    this.dataShared.updateChecklist$.subscribe(() => {
      this.refreshItemsCheckList();
    });
  }

  refreshItemsCheckList(): void {
    this.servicioService.getItemsChecklist(this.dataShared.getSharedObject().idServicio)
      .subscribe(
        (data) => {
          this.dataSourceItems = data;
        }
      )
  }

  managElement() {
    console.log('Lista de items a actualizar: ', this.dataSourceItems)
    if (this.dataSourceItems) {
      this.itemChecklistService.updateItemCheckList(this.dataSourceItems).subscribe(
        (data: ItemChecklistDto[]) => {
          console.log('Items Actualizados', data);
        }
      )
    }
  }

  completo: boolean = false;
  updateAvance(item: ItemChecklistDto) {
    this.completo = !this.completo;
    item.completo = !item.completo
    // Encuentra el índice del elemento en la lista
    const index = this.servicio!.itemChecklistDto.findIndex((element) => element.idItemChecklist === item.idItemChecklist);

    // Si se encuentra el elemento y no es undefined
    if (index !== -1 && this.servicio?.itemChecklistDto[index] !== undefined) {
      // Actualiza la propiedad completo del elemento encontrado
      this.servicio.itemChecklistDto[index].completo = !this.servicio?.itemChecklistDto[index].completo;

      // Calcula el nuevo avance
      this.avance = this.svManager.calcularAvance(this.dataShared.getSharedObject());
    } else {
      // Maneja el caso en que el elemento no se encuentre o sea undefined
      console.error('No se encontró el elemento con ID:', item.idItemChecklist);
    }
  }


  // Función para detectar cambios en el listado de items
  modified: boolean = false;
  indicesCambiados: number[] = [];
  getChange(index: number, item: ItemChecklist) {

    // Buscar el índice del elemento existente en dataSourceItems
    const indexItemExistente = this.dataSourceItems.findIndex(element => element.idItemChecklist === item.idItemChecklist);

    // Verificar si el elemento existe en dataSourceItems
    if (indexItemExistente !== -1) {
      // Reemplazar el elemento existente con el nuevo item
      this.dataSourceItems[indexItemExistente] = item;
    } else {
      // Manejar el caso donde el elemento no está en dataSourceItems
      console.log('El elemento no existe en la lista.');
    }

    // Verifica si el índice ya está en el array
    const indexEncontrado = this.indicesCambiados.indexOf(index);
    indexEncontrado === -1 ? this.indicesCambiados.push(index) : this.indicesCambiados.splice(indexEncontrado, 1);
    // Verificar si hay cambios finalmente
    this.modified = this.indicesCambiados.length > 0;

  }

  updateNotificado(item: any) {
    item.notificado = !item.notificado;
  }

  incluyeImpuesto!: boolean;
  updateCheckTasa() {
    this.incluyeImpuesto = !this.incluyeImpuesto;
  }

  openAddItemComponent() {
    if (this.authService.canAddService()) {
      this.dialog.open(AddItemComponent);
    } else {
      this._snackBar.warnSnackBar('Permisos insuficientes');
    }
  }
}
