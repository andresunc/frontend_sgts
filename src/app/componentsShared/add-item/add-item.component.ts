import { Component, OnInit } from '@angular/core';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { RecursoDto } from 'src/app/models/ModelsDto/RecursoDto';
import { SelectItemDto } from 'src/app/models/ModelsDto/SelectitemsDto';
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

  selectItems: SelectItemDto[] = [];
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
    private recursoDtoService: RecursoDtoService
  ) { }

  ngOnInit(): void {
    this.setDateTime();
    this.getParameters();
    this.setParameters();
  }

  setParameters() {
    this.servicioRecibido = this.dataShared.getSharedObject();
    this.selectedTipoServicio = this.servicioRecibido.tipo;
    this.selectedRubro = this.servicioRecibido.rubro;
  }

  getParameters() {

    this.dataShared.mostrarSpinner();

    this.selectItemService.getSelectItemDto().subscribe(
      (data: SelectItemDto[]) => {
        this.selectItems = data;

        // Obtener valores únicos para tipoServicio, dependencia, rubro y tipoItem
        this.uniqueTipoServicios = this.getUniqueValues('tipoServicio');
        this.uniqueDependencias = this.getUniqueValues('dependencia');
        this.uniqueRubros = this.getUniqueValues('rubro');
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

    this.dataShared.ocultarSpinner();

  }

  getUniqueValues(propertyName: keyof SelectItemDto): string[] {
    const values = this.selectItems.map(item => item[propertyName]);
    // Filtrar valores undefined y convertir a string
    const uniqueValues = values.filter(value => typeof value === 'string') as string[];
    // Filtrar duplicados usando Set y convertir de nuevo a array
    return [...new Set(uniqueValues)];
  }

  filterItems() {
    // Aplicar filtro
    this.filteredItems = this.selectItems.filter(item => {
      // Verificar si la propiedad ha sido seleccionada y es diferente de null
      const tipoServicioMatch = !this.selectedTipoServicio || item.tipoServicio === this.selectedTipoServicio;
      const dependenciaMatch = !this.selectedDependencia || item.dependencia === this.selectedDependencia;
      const rubroMatch = !this.selectedRubro || item.rubro === this.selectedRubro;
      const tipoItemMatch = !this.selectedTipoItem || item.tipoItem === this.selectedTipoItem;

      // Retornar true solo si todas las condiciones coinciden
      return tipoServicioMatch && dependenciaMatch && rubroMatch && tipoItemMatch;
    });

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

  selectItem: string | null = null;
  fechaHoraRealizacion: string | undefined = '';
  idResponsable: string = '';
  montoTasa: number = 0;
  cantidadHojas: number = 0;
  urlComprobante: string = '';
  haSidoNotificado: boolean = false;
  incluyeTasa: boolean = false;
  // Función para guardar los datos del formulario
  guardarDatos() {

    this.dataShared.mostrarSpinner();

    // Aquí puedes acceder a los valores de las variables y hacer lo que necesites con ellos
    console.log('Item seleccionado:', this.selectItem);
    console.log('Fecha y hora de realización:', this.fechaHoraRealizacion);
    console.log('Responsable:', this.idResponsable);
    console.log('Monto de tasa:', this.montoTasa);
    console.log('Cantidad de hojas:', this.cantidadHojas);
    console.log('URL de comprobante:', this.urlComprobante);
    console.log('Ha sido notificado:', this.haSidoNotificado);

    this.dataShared.ocultarSpinner();
  }

  requisito: string | undefined = '';
  recomendarFechaHoraRealizacion(selectItem: string) {
    // Buscar el item seleccionado dentro del array de selectItems
    let objetoFiltrado: SelectItemDto | undefined = this.selectItems.find(item => item.idItem === parseInt(selectItem));

    // Verificar si se encontró el objeto
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

}
