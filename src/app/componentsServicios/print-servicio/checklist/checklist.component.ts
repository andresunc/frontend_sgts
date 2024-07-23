import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddItemComponent } from 'src/app/componentsServicios/print-servicio/add-item/add-item.component';
import { CalcularAvancePipe } from 'src/app/componentsShared/pipes/calcularAvance';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { HistoricoEstado } from 'src/app/models/DomainModels/HistoricoEstado';

import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { TrackingStorage } from 'src/app/models/DomainModels/TrackingStorage';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import { Params } from 'src/app/models/Params';
import { EstadosService } from 'src/app/services/DomainServices/estados.service';
import { HistoricoEstadoService } from 'src/app/services/DomainServices/historico-estado.service';
import { ItemChecklistService } from 'src/app/services/DomainServices/item-checklist.service';
import { TrackingStorageService } from 'src/app/services/DomainServices/tracking-storage.service';
import { ServicioService } from 'src/app/services/ServiciosDto/ServicioService';
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
  estadosList: Estado[] = [];
  estadoPresAprob!: Estado | undefined;
  estadoEnRelevamiento!: Estado | undefined;

  constructor(
    private dataShared: DataSharedService,
    private servicioService: ServicioService,
    private itemChecklistService: ItemChecklistService,
    private authService: AuthService,
    public dialog: MatDialog,
    private calcularAvancePipe: CalcularAvancePipe,
    private fb: FormBuilder,
    public params: Params,
    public dialogRef: MatDialogRef<ChecklistComponent>,
    private authSerice: AuthService,
    private trackingService: TrackingStorageService,
    private estadoService: EstadosService,
    private historicoEstado: HistoricoEstadoService,
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
    this.getEstados();
  }

  getEstados() {
    this.dataShared.mostrarSpinner();
    this.estadoService.getStatusNotDeleted().subscribe(
      (data) => {
        this.estadosList = data;
        this.estadoPresAprob = this.estadosList.find(estado => estado.tipoEstado === this.params.PRESUPUESTO_APROBADO);
        this.estadoEnRelevamiento = this.estadosList.find(estado => estado.tipoEstado === this.params.EN_RELEVAMIENTO);
        console.log('Estados cargados OK');
      })
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
  lastChanges: { [key: string]: any } = {};
  updateAvance(item: ItemChecklistDto) {
    this.completo = !this.completo;
    item.completo = !item.completo;

    // Encuentra el índice del elemento en la lista
    const index = this.dataSourceItems.findIndex((element: any) => element.idItemChecklist === item.idItemChecklist);

    // Si se encuentra el elemento y no es undefined
    if (index !== -1 && this.dataSourceItems[index] !== undefined) {
      // Actualiza la propiedad completo del elemento encontrado
      this.dataShared.getSharedObject().itemChecklistDto[index].completo = !this.dataShared.getSharedObject().itemChecklistDto[index].completo;
      this.dataShared.setSharedObject(this.dataShared.getSharedObject());

      // Calcula el nuevo avance
      this.avance = this.calcularAvancePipe.transform(this.dataShared.getSharedObject().itemChecklistDto);

      // Guarda el cambio en lastChanges con la clave itemId_{id}
      const itemKey = `itemId_${item.idItemChecklist}`;
      this.lastChanges[itemKey] = {
        ...this.lastChanges[itemKey],
        completo: item.completo
      };

    } else {
      // Maneja el caso en que el elemento no se encuentre o sea undefined
      console.error('No se encontró el elemento con ID:', item.idItemChecklist);
    }
  }

  getLastChanges(itemId: string): { [key: string]: any } {
    const itemKey = `itemId_${itemId}`;
    return this.lastChanges[itemKey] || {};
  }


  updateNotificado(item: any) {
    item.notificado = !item.notificado;

    // Guarda el cambio en lastChanges con la clave itemId_{id}
    const itemKey = `itemId_${item.idItemChecklist}`;
    this.lastChanges[itemKey] = {
      ...this.lastChanges[itemKey],
      notificado: item.notificado
    };
  }

  getChange(controlName: string, item: any): void {
    const control = this.form.get(controlName);
    if (control) {
      const value = control.value;
      item[controlName] = value;

      // Guardar el cambio en lastChanges
      const itemKey = `itemId_${item.idItemChecklist}`;
      this.lastChanges[itemKey] = {
        ...this.lastChanges[itemKey],
        [controlName]: value
      };

      // Imprime los cambios para verificación (opcional)
      console.log(`itemId: ${itemKey} cambió ${controlName}:`, value);
      console.log('Últimos cambios:', this.lastChanges);
    }
  }

  accordionItemOpened(item: ItemChecklistDto) {
    this.form.patchValue({
      tasaValor: item.tasaValor,
      tasaCantidadHojas: item.tasaCantidadHojas,
      urlComprobanteTasa: item.urlComprobanteTasa
    });
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
                let trackingStorage = new TrackingStorage();
                trackingStorage = this.getRecursoTrackingStorage();
                trackingStorage.action = this.params.DELETE;
                trackingStorage.eventLog = `Se elimino el ítem ${deletedItem.nombreItem}`;
                trackingStorage.data = `ID: ${deletedItem.idItemChecklist}, Completo: ${deletedItem.completo}, Asignado a: ${deletedItem.responsable}`;
                this.suscribeTracking(trackingStorage);

                console.log('ID del itemChecklist eliminado: ', data);
                this.refreshItemsCheckList();
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

  save: boolean = false;
  managElement() {
    /*
    const noChange = JSON.stringify(this.initDataSourceItems) === JSON.stringify(this.dataSourceItems);
    if (noChange) {
      console.log('No hay cambios que hacer :/')
      this._snackBar.warnSnackBar('No hay cambios que hacer', 'Ok');
      return;
    }*/
    this.save = true;
    this.dataShared.mostrarSpinner();
    const transformedChanges = this.transformLastChanges(this.lastChanges);
    console.log('Lista de items a actualizar: ', this.dataSourceItems)
    
    if (this.dataSourceItems) {
      this.itemChecklistService.updateItemCheckList(this.dataSourceItems).subscribe({
        next: (data: ItemChecklistDto[]) => {
          this.checkPresupuestoAprobado();
      
          let trackingStorage = new TrackingStorage();
          trackingStorage = this.getRecursoTrackingStorage();
          trackingStorage.action = this.params.UPDATE;
          trackingStorage.eventLog = `CheckList actualizado`;
          trackingStorage.data = `${transformedChanges}`;
          this.suscribeTracking(trackingStorage);
      
          this.servicio.itemChecklistDto = data;
          this.dataShared.setSharedObject(this.servicio);
          console.log('Items Actualizados', data);
          this.dialogRef.close();
          this.save = false;
          this.dataShared.ocultarSpinner();
        },
        error: (error) => {
          this.dataShared.ocultarSpinner();
          console.error('Error actualizando el checklist:', error);
        }
      });
    }

  }

  checkPresupuestoAprobado() {

    const correntUserName = this.authService.getCurrentName();
    const isPresupuestoAprobado = (this.estadoPresAprob?.tipoEstado === this.dataShared.getSharedObject().estado);
    
    if (isPresupuestoAprobado) {
      // Set tracking storage
    let trackingStorage = new TrackingStorage();
    trackingStorage = this.getRecursoTrackingStorage();
    trackingStorage.idServicio = this.servicio.idServicio;

    // Armo el objeto historico de estado
    let historicoEstado = new HistoricoEstado();
    historicoEstado.estadoIdEstado = this.estadoEnRelevamiento?.idEstado
    historicoEstado.servicioIdServicio = this.servicio.idServicio;

    this.historicoEstado.addHistoricoEstado(historicoEstado)
      .subscribe(
        () => {
          // data para el primer tracking storages
          trackingStorage.eventLog = 'Actualización automática';
          trackingStorage.data = `El estado cambió a "${this.estadoEnRelevamiento?.tipoEstado}" porque ${correntUserName} inicio la ejecución de las actividades`;
          trackingStorage.action = this.params.UPDATE;
          this.suscribeTracking(trackingStorage);
          this.dataShared.setSharedObject(this.servicio);
        },
        (error) => console.error('Error al agregar el estado automáticamente:', error),
      );
    }

  }

  transformLastChanges(lastChanges: { [key: string]: any }): string {
    const transformedEntries = Object.entries(lastChanges).map(([key, changes]) => {
      const transformedChanges = Object.entries(changes).map(([prop, value]) => {
        const displayValue = value === true ? 'sí' : value === false ? 'no' : value;
        return `${prop}: ${displayValue}`;
      }).join(', ');
      return `${key}: ${transformedChanges}`;
    });
    return transformedEntries.join('; ');
  }

  openAddItemComponent() {
    const dialogRef = this.dialog.open(AddItemComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('cambios guardados Ok')
        this.dialog.closeAll();
        this.refreshItemsCheckList();
        setTimeout(() => {
          this.dialog.open(ChecklistComponent);
        }, 750);
      } else {
        console.log('No se guardaron los cambios')
      }
    });
  }

  suscribeTracking(trackingStorage: TrackingStorage) {
    this.trackingService.createTrackingStorage(trackingStorage)
      .subscribe(
        (trackingData) => {
          console.log('log registrado: ', trackingData);
        },
        () => {
          console.log('Error al crear el log de la trackingstorage')
        }
      );
  }

  getRecursoTrackingStorage(): TrackingStorage {

    const trackingStorage = new TrackingStorage();
    const currentUser = this.authSerice.getCurrentUser();
    trackingStorage.idRecurso = currentUser?.id_recurso;
    trackingStorage.rol = currentUser?.roles?.[0]?.rol ?? 'Sin especificar';
    trackingStorage.idServicio = this.servicio.idServicio;
    return trackingStorage;
  }
}