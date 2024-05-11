import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from 'src/app/componentsServicios/print-servicio/add-item/add-item.component';
import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import { ItemChecklistService } from 'src/app/services/DomainServices/item-checklist.service';
import { ServicioService } from 'src/app/services/ServiciosDto/ServicioService';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
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
  editable: boolean = true;
  servicio: Servicios;
  isAdmin: boolean;

  constructor(
    private dataShared: DataSharedService,
    private svManager: ManagerService,
    private servicioService: ServicioService,
    private itemChecklistService: ItemChecklistService,
    private authService: AuthService,
    public dialog: MatDialog) {
    this.isAdmin = this.authService.isAdmin();
    this.servicio = this.dataShared.getSharedObject();
    this.dataSourceItems = this.servicio.itemChecklistDto;
    this.avance = this.svManager.calcularAvance(this.dataSourceItems);
  }

  ngOnInit(): void {
    // Escucha los eventos de actualización
    this.dataShared.updateChecklist$.subscribe(() => {
      this.refreshItemsCheckList();
    });
  }

  refreshItemsCheckList(): void {
    this.dataShared.mostrarSpinner();
    this.servicioService.getItemsChecklist(this.servicio.idServicio)
      .subscribe(
        (data) => {
          this.dataSourceItems = data;
          this.avance = this.svManager.calcularAvance(this.dataSourceItems);
          this.dataShared.setSharedObject(this.servicio);
          this.dataShared.ocultarSpinner();
        }).add(
          this.dataShared.ocultarSpinner()
        );


  }

  completo: boolean = false;
  updateAvance(item: ItemChecklistDto) {
    this.completo = !this.completo;
    item.completo = !item.completo
    // Encuentra el índice del elemento en la lista
    const index = this.dataSourceItems.findIndex((element: any) => element.idItemChecklist === item.idItemChecklist);

    // Si se encuentra el elemento y no es undefined
    if (index !== -1 && this.dataSourceItems[index] !== undefined) {
      // Actualiza la propiedad completo del elemento encontrado
      this.dataShared.getSharedObject().itemChecklistDto[index].completo = !this.dataShared.getSharedObject().itemChecklistDto[index].completo;
      this.dataShared.setSharedObject(this.dataShared.getSharedObject());

      // Calcula el nuevo avance
      this.avance = this.svManager.calcularAvance(this.dataShared.getSharedObject().itemChecklistDto);
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

    // Verificar si el elemento existe en dataSourceItems, o sea si el resultado es distinto de -1
    if (indexItemExistente !== -1) {
      // Reemplazar el elemento existente con el nuevo item
      this.dataSourceItems[indexItemExistente] = item;
      // Verifica si el índice ya está en el array
      const indexEncontrado = this.indicesCambiados.indexOf(index);
      indexEncontrado === -1 ? this.indicesCambiados.push(index) : this.indicesCambiados.splice(indexEncontrado, 1);
      // Verificar si hay cambios finalmente
      this.modified = this.indicesCambiados.length > 0;
    } else {
      // Manejar el caso donde el elemento no está en dataSourceItems
      alert('Ocorrió un error con un aspecto en el cambio de información del ítem.');
    }

  }

  /* Lógica para los ítems eliminados */
  itemsToDelete: ItemChecklistDto[] = [];
  goDelete(item: ItemChecklistDto) {

    const index = this.dataSourceItems.indexOf(item); // buscar el item en dataSourceItems

    if (index !== -1) {
      const deletedItem = this.dataSourceItems[index];
      this.itemsToDelete.push(deletedItem); // Agregarlo a la lista de eliminados

      // Esperar 3 segundos
      setTimeout(() => {
        // Si después de 3 seg sigue estando en itemsToDelete eliminar el ítem del listado permanentemente
        const indexToDelete = this.itemsToDelete.indexOf(deletedItem);
        if (indexToDelete !== -1) {
          this.itemChecklistService.deleteListItems(this.itemsToDelete[indexToDelete])
            .subscribe(
              (data) => {
                console.log('ID del itemChecklist eliminado: ', data);
                this.dataSourceItems.splice(indexToDelete, 1);
              }, () => {
                this.itemsToDelete.splice(indexToDelete, 1);
              }
            );
          this.itemsToDelete.splice(indexToDelete, 1);
        }
      }, 3000);
    }

  }

  undoDelete(item: ItemChecklistDto) {
    const index = this.itemsToDelete.indexOf(item);
    if (index !== -1) {
      this.itemsToDelete.splice(index, 1)[0];
    }
  }
  /* Fin Lógica para la eliminación */

  /* Lógica para administrar los ítems del checklist */
  updateNotificado(item: any) {
    item.notificado = !item.notificado;
  }

  itemManagement(item: ItemChecklistDto): boolean {
    return this.isAdmin || item.idRecurso === this.authService.getCurrentUser()?.id_recurso;
  }

  // Declara un objeto para mantener el estado de incluyeImpuesto para cada ítem del acordeón
  incluyeImpuestoStates: { [idItemChecklist: number]: boolean } = {};
  updateCheckTasa(item: ItemChecklistDto) {
    // Cambia el estado de incluyeImpuesto para el ítem específico del acordeón
    this.incluyeImpuestoStates[item.idItemChecklist!] = !this.incluyeImpuestoStates[item.idItemChecklist!];
  }

  managElement() {
    console.log('Lista de items a actualizar: ', this.dataSourceItems)
    this.dataShared.mostrarSpinner();
    this.modified = false;
    if (this.dataSourceItems) {
      this.itemChecklistService.updateItemCheckList(this.dataSourceItems).subscribe(
        (data: ItemChecklistDto[]) => {
          this.servicio.itemChecklistDto = data;
          this.dataShared.setSharedObject(this.servicio);
          console.log('Items Actualizados', data);
          this.dataShared.ocultarSpinner();
        }
      ).add(
        this.dataShared.ocultarSpinner()
      )
    }
  }

  openAddItemComponent() {
    const dialogRef = this.dialog.open(AddItemComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.refreshItemsCheckList();
    });
  }
}