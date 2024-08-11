import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { ReasignacionResponsablesDto } from 'src/app/models/ModelsDto/ReasignacionResponsablesDto';
import { RecursoDto } from 'src/app/models/ModelsDto/RecursoDto';
import { SelectItemDto } from 'src/app/models/ModelsDto/SelectitemsDto';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { ItemChecklistService } from 'src/app/services/DomainServices/item-checklist.service';
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
    const obl = new ReasignacionResponsablesDto();
    obl.items = this.itemsSeleccionados;
    obl.servicios = this.serviciosSeleccionados;
    obl.responsableActual = this.selectedRecurso?.idRecurso;
    obl.nuevoResponsable = this.selectedNewRecurso?.idRecurso;

    // Mostrar el spinner al inicio
    this.dataShared.mostrarSpinner();

    this.itemChecklistService.reasignarResponsables(obl)
    .subscribe((data) =>{
      console.log(data)

      // Limpiar formularios
      this.firstFormGroup.reset();
      this.secondFormGroup.reset();

      // Resetear variables relacionadas con la selección
      this.selectedRecurso = undefined;
      this.selectedNewRecurso = undefined;
      this.itemsSeleccionados = [];
      this.serviciosSeleccionados = [];

      // Volver al primer paso
      this.stepper.reset();
      this.dataShared.ocultarSpinner();
      this._snackBar.okSnackBar('Reasignación exitosa')
    },
    error => {
      console.error(error);
      this.dataShared.ocultarSpinner();
    })
  }


}
