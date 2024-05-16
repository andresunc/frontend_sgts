import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { RecursoDto } from 'src/app/models/ModelsDto/RecursoDto';
import { SelectItemDto } from 'src/app/models/ModelsDto/SelectitemsDto';
import { ItemChecklistService } from 'src/app/services/DomainServices/item-checklist.service';
import { RecursoDtoService } from 'src/app/services/ServiciosDto/recurso-dto.service';
import { SelectItemService } from 'src/app/services/ServiciosDto/select-item.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  isChecked = true;
  minDate: any;
  servicioRecibido!: Servicios;

  selectItemList: SelectItemDto[] = [];
  filteredItems: SelectItemDto[] = [];

  uniqueTipoServicios: string[] = [];
  uniqueDependencias: string[] = [];
  uniqueRubros: string[] = [];
  uniqueTipoItems: string[] = [];

  selectedTipoServicio: string | null = null;
  selectedDependencia: string | null = null;
  selectedRubro: string | null = null;
  selectedTipoItem: string | null = null;

  recursoList: RecursoDto[] = [];

  constructor(
    private _snackBar: PopupService,
    private dataShared: DataSharedService,
    private selectItemService: SelectItemService,
    private recursoDtoService: RecursoDtoService,
    private itemChecklistService: ItemChecklistService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.setDateTime();
    this.getParameters();
    this.setParameters();
  }

  getParameters() {

    this.selectItemService.getSelectItemDto().subscribe(
      (data: SelectItemDto[]) => {
        this.selectItemList = data;

        // Obtener valores únicos para tipoServicio, dependencia, rubro y tipoItem
        this.uniqueTipoServicios = this.getUniqueValues('tipoServicio');
        this.uniqueDependencias = this.getUniqueValues('dependencia');
        this.getUniqueRubro(); // this.uniqueRubros = this.getUniqueValues('rubro');
        this.uniqueTipoItems = this.getUniqueValues('tipoItem');

        // Filtrar los elementos al recibirlos por primera vez
        this.filterItems();
      },
      error => {
        console.error(error); // Manejo de errores
      }
    );

    this.recursoDtoService.getRecursos().subscribe(
      (data) => {
        this.recursoList = data;
      }
    )

    this.servicioRecibido = this.dataShared.getSharedObject();

  }

  setParameters() {
    // Establezco la seleccion del tipo de servicio para el filtrado por defecto
    this.selectedTipoServicio = this.servicioRecibido.tipo;
  }

  getUniqueValues(propertyName: keyof SelectItemDto): string[] {
    const values = this.selectItemList.map(item => item[propertyName]);
    // Filtrar valores undefined y convertir a string
    const uniqueValues = values.filter(value => typeof value === 'string') as string[];
    // Filtrar duplicados usando Set y convertir de nuevo a array
    return [...new Set(uniqueValues)];
  }

  getUniqueRubro() {
    // Verificar si al menos un elemento en selectItemList tiene el mismo rubro que this.servicioRecibido.rubro
    // voy a configurar por defecto el la lista de rubro a seleccionar
    if (this.selectItemList.some(item => item.rubro === this.servicioRecibido.rubro || !this.servicioRecibido.rubro)) {
      this.uniqueRubros = [this.servicioRecibido.rubro];
    } else {
      this.uniqueRubros = this.getUniqueValues('rubro');
    }
  }

  filterItems() {
    // Aplicar filtro
  
    this.filteredItems = this.selectItemList.filter(item => {
        // Verificar si tipoServicio ha sido seleccionado o si idTipoServicio es null
        const tipoServicioMatch = !this.selectedTipoServicio || item.tipoServicio === this.selectedTipoServicio || item.tipoServicio === null;
        // Verificar si dependencia ha sido seleccionada o si coincide
        const dependenciaMatch = !this.selectedDependencia || item.dependencia === this.selectedDependencia;
        // Verificar si rubro ha sido seleccionado o si coincide
        const rubroMatch = !this.selectedRubro || item.rubro === this.selectedRubro;
        // Verificar si tipoItem ha sido seleccionado o si coincide
        const tipoItemMatch = !this.selectedTipoItem || item.tipoItem === this.selectedTipoItem;
        // Comprobar si el ID del elemento no está presente en itemChecklistDto
        const idNotInDto = !this.servicioRecibido.itemChecklistDto.some(dtoItem => dtoItem.nombreItem === item.descripcion);
        // Retornar true solo si todas las condiciones coinciden
        return tipoServicioMatch && dependenciaMatch && rubroMatch && tipoItemMatch && idNotInDto;
    });
    console.log('asdasd', this.filteredItems)

    // Verificar si el elemento seleccionado todavía está presente en la lista filtrada
    const selectedItemExists = this.filteredItems.some(item => item.idItem === parseInt(this.selectItem!));

    // Si el elemento seleccionado no está presente, establecerlo en null
    if (!selectedItemExists) {
      this.selectItem = null;
      this.fechaHoraRealizacion = '';
    }
  }

  setDateTime() {
    const fullDate = new Date();
    var date = fullDate.getDate();
    var nDate = (date < 10) ? '0' + date : date;
    var month = fullDate.getMonth() + 1;
    var nMonth = (month < 10) ? '0' + month : month;
    var year = fullDate.getFullYear();
    var hours = fullDate.getHours();
    var nHours = (hours < 10) ? '0' + hours : hours;
    var minutes = fullDate.getMinutes();
    var nMinutes = (minutes < 10) ? '0' + minutes : minutes;
    // Establecer la fecha mínima como la fecha actual
    this.minDate = year + '-' + nMonth + '-' + nDate + 'T' + nHours + ':' + nMinutes;
  }

  resetDate: any;
  onChange(value: any) {
    var currenTime = new Date().getTime();
    var selectedTime = new Date(value).getTime();

    if (selectedTime < currenTime) {
      this._snackBar.errorSnackBar("Tu selección es menor al momento actual");
      this.resetDate = "";
    }
  }

  requisito: string | undefined = '';
  recomendarFechaHoraRealizacion(selectItem: string) {
    // Buscar el objeto SelectItemDto dentro del array de selectItems en función del ID del requisito
    let objetoFiltrado: SelectItemDto | undefined = this.selectItemList.find(item => item.idItem === parseInt(selectItem));

    // Verificar si se encontró el objeto y obtener la fecha recomendada en función del tiempo estándar
    if (objetoFiltrado && objetoFiltrado.fechaHoraRealizacionRecomendada) {

      this.requisito = objetoFiltrado.descripcion;
      // Obtener la fecha recomendada del objeto filtrado
      let fechaRecomendada: string = objetoFiltrado.fechaHoraRealizacionRecomendada;

      // Formatear la fecha para que coincida con el formato esperado
      let fechaFormateada: string = fechaRecomendada.split(".")[0]; // Eliminar los milisegundos
      this.fechaHoraRealizacion = fechaFormateada;
    } else {
      console.error("El objeto seleccionado no se encontró en la lista de selectItems o no tiene una fecha recomendada definida.");
    }
  }

  @ViewChild('montoTasaInput', { static: false }) montoTasaInput!: ElementRef<HTMLInputElement>;
  validarMontoTasa() {
    const montoTasa = parseFloat(this.montoTasaInput.nativeElement.value);

    if (montoTasa < 0) {
      this.montoTasaInput.nativeElement.value = '0';
    }
  }

  selectItem: string | null = null;
  fechaHoraRealizacion: string | undefined = '';
  idResponsable: string = '';
  montoTasa: number = 0;
  cantidadHojas: number = 0;
  urlComprobante: string = '';
  haSidoNotificado: boolean = false;
  incluyeTasa: boolean = false;
  // Función para guardar los datos del formulario
  saveData() {

    this.dataShared.mostrarSpinner();
    // Crear el Item del CheckList
    let addItemToCheckList = new ItemChecklist();
    addItemToCheckList.servicioIdServicio = this.servicioRecibido.idServicio;
    addItemToCheckList.itemIdItem = parseInt(this.selectItem!);
    addItemToCheckList.finEstandar = (this.fechaHoraRealizacion) ? new Date(this.fechaHoraRealizacion) : undefined;
    addItemToCheckList.recursoGgIdRecursoGg = parseInt(this.idResponsable);
    addItemToCheckList.tasaValor = this.montoTasa;
    addItemToCheckList.tasaCantidadHojas = this.cantidadHojas;
    addItemToCheckList.urlComprobanteTasa = this.urlComprobante;
    addItemToCheckList.notificado = this.haSidoNotificado;

    // Actualzar lista de items del checklist
    this.servicioRecibido.itemChecklistDto.push(addItemToCheckList);
    this.dataShared.setSharedObject(this.servicioRecibido);

    // Persistir item del checklist
    this.itemChecklistService.addItemCheckList(addItemToCheckList).subscribe(
      (data: ItemChecklist) => {
        addItemToCheckList = data;
        console.log('ItemChecklist persistido: ', addItemToCheckList);
        this.dataShared.ocultarSpinner();
      }, ()=> {
        this.dataShared.ocultarSpinner();
      }
    )

  }

}