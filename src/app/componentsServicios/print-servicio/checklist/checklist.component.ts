import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddItemComponent } from 'src/app/componentsServicios/print-servicio/add-item/add-item.component';
import { CalcularAvancePipe } from 'src/app/componentsShared/pipes/calcularAvance';

import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import { Params } from 'src/app/models/Params';
import { ItemChecklistService } from 'src/app/services/DomainServices/item-checklist.service';
import { ServicioService } from 'src/app/services/ServiciosDto/ServicioService';
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
  initDataSourceItems: ItemChecklistDto[];
  avance: number = 0;
  editable: boolean = true;
  servicio: Servicios;
  isAdmin: boolean;
  form!: FormGroup;

  constructor(
    private dataShared: DataSharedService,
    private popupService: PopupService,
    private servicioService: ServicioService,
    private itemChecklistService: ItemChecklistService,
    private authService: AuthService,
    public dialog: MatDialog,
    private calcularAvancePipe: CalcularAvancePipe,
    private fb: FormBuilder,
    public params: Params,
    public dialogRef: MatDialogRef<ChecklistComponent>
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.servicio = this.dataShared.getSharedObject();
    this.dataSourceItems = this.servicio.itemChecklistDto;
    this.initDataSourceItems = this.servicio.itemChecklistDto;
    this.avance = this.calcularAvancePipe.transform(this.dataSourceItems);
    this.formInit();
  }

  ngOnInit(): void {
    // Escucha los eventos de actualización
    this.dataShared.updateChecklist$.subscribe(() => {
      this.refreshItemsCheckList();
    });
    this.disableItemsTasa();
    this.canNotify();
  }

  notifyIsVisible: boolean = false;
  canNotify() {
    this.notifyIsVisible = (this.servicio.estado === this.params.PRESENTADO)
  }

  formInit() {
    this.form = this.fb.group({
      tasaValor: ['', [Validators.required, Validators.min(0), Validators.maxLength(9)]],
      tasaCantidadHojas: ['', [Validators.required, Validators.min(0), Validators.max(999)]],
      urlComprobanteTasa: ['', [Validators.required, Validators.pattern('https://.*')]]
    });
  }

  refreshItemsCheckList(): void {
    this.dataShared.mostrarSpinner();
    this.servicioService.getItemsChecklist(this.servicio.idServicio)
      .subscribe(
        (data) => {
          this.dataSourceItems = data;
          this.avance = this.calcularAvancePipe.transform(this.dataSourceItems);
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
      this.avance = this.calcularAvancePipe.transform(this.dataShared.getSharedObject().itemChecklistDto);
    } else {
      // Maneja el caso en que el elemento no se encuentre o sea undefined
      console.error('No se encontró el elemento con ID:', item.idItemChecklist);
    }
  }

  getChange(controlName: string, item: any): void {
    const control = this.form.get(controlName);
    if (control) {
      const value = control.value;
      // Aquí puedes hacer algo con el valor cambiado, como actualizar un estado o llamar a un servicio
      console.log(`Changed ${controlName}:`, value);
      // Por ejemplo, puedes actualizar `item` con el nuevo valor
      item[controlName] = value;
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
    const currentState = this.incluyeImpuestoStates[item.idItemChecklist!] || false;
    this.incluyeImpuestoStates[item.idItemChecklist!] = !currentState;

    if (this.incluyeImpuestoStates[item.idItemChecklist!]) {
      this.enableItemsTasa();
    } else {
      this.disableItemsTasa();
    }
  }

  enableItemsTasa() {
    this.form.get('tasaValor')!.enable();
    this.form.get('tasaCantidadHojas')!.enable();
    this.form.get('urlComprobanteTasa')!.enable();
  }

  disableItemsTasa() {
    this.form.get('tasaValor')!.disable();
    this.form.get('tasaCantidadHojas')!.disable();
    this.form.get('urlComprobanteTasa')!.disable();
  }

  managElement() {

    /*
    const sameChange = JSON.stringify(this.initDataSourceItems) === JSON.stringify(this.dataSourceItems);
    if (sameChange) {
      console.log('No hay cambios que hacer :/')
      this.popupService.warnSnackBar('No hay cambios que hacer', 'Ok');
      return;
    }
    */

    console.log('Lista de items a actualizar: ', this.dataSourceItems)
    this.dataShared.mostrarSpinner();
    if (this.dataSourceItems) {
      this.itemChecklistService.updateItemCheckList(this.dataSourceItems).subscribe(
        (data: ItemChecklistDto[]) => {
          this.servicio.itemChecklistDto = data;
          this.dataShared.setSharedObject(this.servicio);
          console.log('Items Actualizados', data);
          this.dialogRef.close();
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