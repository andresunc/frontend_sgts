import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { TrackingStorage } from 'src/app/models/DomainModels/TrackingStorage';
import { ReasignacionResponsablesDto } from 'src/app/models/ModelsDto/ReasignacionResponsablesDto';
import { RecursoDto } from 'src/app/models/ModelsDto/RecursoDto';
import { SelectItemDto } from 'src/app/models/ModelsDto/SelectitemsDto';
import { Params } from 'src/app/models/Params';
import { AuthService } from 'src/app/services/auth.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { ItemChecklistService } from 'src/app/services/DomainServices/item-checklist.service';
import { TrackingStorageService } from 'src/app/services/DomainServices/tracking-storage.service';
import { RecursoDtoService } from 'src/app/services/ServiciosDto/recurso-dto.service';
import { SelectItemService } from 'src/app/services/ServiciosDto/select-item.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';

interface ItemsPorServicio {
  [servicioId: number]: ItemChecklist[];
}

@Component({
  selector: 'app-reasignacion',
  templateUrl: './reasignacion.component.html',
  styleUrls: ['./reasignacion.component.css']
})
export class ReasignacionComponent implements OnInit {

  items: ItemChecklist[] = [];
  recursoList: RecursoDto[] = [];
  selectedRecurso: RecursoDto | undefined;
  selectedNewRecurso: RecursoDto | undefined;
  selectItemList: SelectItemDto[] = [];
  params: Params = new Params();

  serviciosSeleccionados: number[] = [];
  itemsSeleccionados: number[] = [];

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  @ViewChild('stepper') stepper!: MatStepper;


  constructor(
    private itemChecklistService: ItemChecklistService,
    private _formBuilder: FormBuilder,
    private recursoService: RecursoDtoService,
    private dataShared: DataSharedService,
    private selectItemService: SelectItemService,
    private _snackBar: PopupService,
    private authService: AuthService,
    private trackingService: TrackingStorageService,
  ) { }

  ngOnInit(): void {
    this.getRecursoList();
    this.getSelectedItems();
    this.initializeForm();
    this.subscribeToFormChanges();
  }

  itemSeleccionado(itemId: number): boolean {
    return this.itemsSeleccionados.includes(itemId);
  }

  toggleItem(itemId: number, checked: boolean) {
    if (checked) {
      this.itemsSeleccionados.push(itemId);

      // Encontrar el servicio al que pertenece el ítem y agregarlo a serviciosSeleccionados
      for (const servicioId in this.ItemsPorServicio) {
        if (this.ItemsPorServicio[servicioId].some(item => item.idItemChecklist === itemId)) {
          if (!this.serviciosSeleccionados.includes(+servicioId)) {
            this.serviciosSeleccionados.push(+servicioId);
          }
          break; // Salir del bucle una vez que se encuentra el servicio
        }
      }
    } else {
      this.itemsSeleccionados = this.itemsSeleccionados.filter(id => id !== itemId);

      // Verificar si algún ítem del servicio sigue seleccionado
      for (const servicioId in this.ItemsPorServicio) {
        const itemsDelServicio = this.ItemsPorServicio[servicioId];
        const algunoSeleccionado = itemsDelServicio.some(item => this.itemsSeleccionados.includes(item.idItemChecklist!));

        if (!algunoSeleccionado && this.serviciosSeleccionados.includes(+servicioId)) {
          this.serviciosSeleccionados = this.serviciosSeleccionados.filter(id => id !== +servicioId);
        }
      }
    }

    // Imprimir los items y servicios seleccionados
    console.log('Ítems seleccionados:', this.itemsSeleccionados);
    console.log('Servicios seleccionados:', this.serviciosSeleccionados);
  }

  /**
   * CONFIGURACIONES INICIALES
   */
  private initializeForm(): void {
    this.firstFormGroup = this._formBuilder.group({
      respActual: [null, Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      nuevoResp: [null, Validators.required],
    });
  }

  // Función para suscribirse a los cambios del FormControl
  subscribeToFormChanges(): void {
    this.firstFormGroup.get('respActual')?.valueChanges.subscribe(value => {
      this.selectedRecurso = value as RecursoDto;
      this.onResponsableSeleccionado(this.selectedRecurso.idRecurso!);
      this.itemsSeleccionados = [];
      this.serviciosSeleccionados = [];
    });

    this.secondFormGroup.get('nuevoResp')?.valueChanges.subscribe(value => {
      this.selectedNewRecurso = value as RecursoDto;
    });

  }

  // Obtener la lista de recursos
  getRecursoList(): void {
    this.recursoService.getRecursos().subscribe(
      (data) => {
        this.recursoList = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching recursos:', error);
      }
    );
  }

  // Método para cargar los ítems relacionados a un responsable
  ItemsPorServicio!: { [servicioId: number]: ItemChecklist[] }
  onResponsableSeleccionado(recursoGgId: number): void {
    // Mostrar el spinner al inicio
    this.dataShared.mostrarSpinner();

    this.itemChecklistService.getItemsByRecursoGgId(recursoGgId)
      .subscribe(
        (items: ItemChecklist[]) => {
          this.items = items;

          // Agrupar items por servicio
          this.ItemsPorServicio = this.items.reduce((groupedItems, item) => {
            const servicioId = item.servicioIdServicio!;
            if (!groupedItems[servicioId]) {
              groupedItems[servicioId] = [];
            }
            groupedItems[servicioId].push(item);
            return groupedItems;
          }, {} as ItemsPorServicio);

          console.log('Items agrupados por servicio:', this.ItemsPorServicio);
          
          if (Object.keys(this.ItemsPorServicio).length > 0) {
            this.stepper.selectedIndex = 1;
          } else {
            this._snackBar.warnSnackBar(`${this.selectedRecurso?.nombre}, no registra tareas`)
          }

          this.dataShared.ocultarSpinner();
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching items:', error);
          this.dataShared.ocultarSpinner();
        }
      );
  }

  getSelectedItems() {
    this.selectItemService.getSelectItemDto().subscribe(
      (data: SelectItemDto[]) => {
        this.selectItemList = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  getItemDescription(itemId: number): string {
    const matchingItem = this.selectItemList.find(selectedItem => selectedItem.idItem === itemId);
    return matchingItem ? matchingItem.descripcion || '' : ''; // Manejar si no se encuentra coincidencia
  }

  callReasignarResponsables() {
    const objReasignar = new ReasignacionResponsablesDto();
    objReasignar.items = this.itemsSeleccionados;
    objReasignar.servicios = this.serviciosSeleccionados;
    objReasignar.responsableActual = this.selectedRecurso?.idRecurso;
    objReasignar.nuevoResponsable = this.selectedNewRecurso?.idRecurso;

    // Mostrar el spinner al inicio
    this.dataShared.mostrarSpinner();

    this.itemChecklistService.reasignarResponsables(objReasignar)
      .subscribe((data) => {
        console.log(data)

        // Crear logs de los eventos
        this.crearLogs(objReasignar);

        // Limpiar formularios
        this.firstFormGroup.reset();
        this.secondFormGroup.reset();

        // Resetear variables relacionadas con la selección
        this.selectedRecurso = undefined;
        this.selectedNewRecurso = undefined;
        this.itemsSeleccionados = [];
        this.serviciosSeleccionados = [];

        // Volver al primer paso
        this.stepper.selectedIndex = 0;
        this.dataShared.ocultarSpinner();
        this._snackBar.okSnackBar('Reasignación exitosa');
      },
        error => {
          console.error(error);
          this.dataShared.ocultarSpinner();
        })
  }

  crearLogs(obj: ReasignacionResponsablesDto) {

    const currentUser = this.authService.getCurrentUser();
    const fullNameRecurso = `${this.selectedRecurso?.nombre} ${this.selectedRecurso?.apellido}, DNI: ${this.selectedRecurso?.dni}`
    const fullNameNuevoRecurso = `${this.selectedNewRecurso?.nombre} ${this.selectedNewRecurso?.apellido}, DNI: ${this.selectedNewRecurso?.dni}`
    const trackingStorages: TrackingStorage[] = [];

    // Verificar si 'servicios' existe y tiene elementos
    if (obj.servicios && obj.servicios.length > 0) {

      // Iterar sobre los servicios
      obj.servicios.forEach(idServicio => {

        // Datos del usuario que gestiona la reasignación
        const trackingStorage = new TrackingStorage();
        trackingStorage.idRecurso = currentUser?.id_recurso;//
        trackingStorage.rol = currentUser?.roles?.[0]?.rol ?? 'Sin especificar';//

        // Acciones que se llevaron a cabo
        trackingStorage.action = this.params.UPDATE;//
        trackingStorage.eventLog = 'Se ejecuto el proceso de reasignación';//
        trackingStorage.data = `Lo asignado a ${fullNameRecurso} ha sido reasignado a ${fullNameNuevoRecurso}`;//

        // Asignar el id del servicio al que se va a asociar el trackeo
        trackingStorage.idServicio = idServicio; // ** Asignar los id de los servicios correspondientes a cada iteración

        // Agregar tracking al array de logs
        trackingStorages.push(trackingStorage);
      })
    } else {
      console.warn("No se encontraron servicios para asignar en ReasignacionComponent");
    }

    // Suscribir multiples trackingstorages
    this.crearRegistros(trackingStorages);
  }

  crearRegistros(trackingStorages: TrackingStorage[]) {
    this.trackingService.createMultipleTrackingStorages(trackingStorages)
      .subscribe(
        (trackingData) => {
          console.log('Tracking Data: ', trackingData);
        },
        () => {
          console.error('Error al crear multiples registros en ReasignacionComponent')
        }
      );
  }
}
