import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { ServicioService } from 'src/app/services/ServiciosDto/ServicioService';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
import { AuthService } from 'src/app/services/auth.service';
import { Params } from 'src/app/models/Params';
import { memoize } from 'src/app/componentsShared/pipes/memoize';
import { ReboteService } from 'src/app/services/RptServices/rebote.service';
import { RptRebote } from 'src/app/models/RptModels/RptRebote';
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'app-ver-servicios',
  templateUrl: './ver-servicios.component.html',
  styleUrls: ['./ver-servicios.component.css'],
})
export class VerServiciosComponent implements OnInit, OnDestroy {

  title: string = "Gestión De Servicios";
  listServicios!: Servicios[];
  svService: ManagerService; // Trabaja para calcular algunos valores de los servicios
  dataSource = new MatTableDataSource(this.listServicios); // cfg data de la tabla: Recibe un listado de objetos a mostrar
  params: Params = new Params();
  recursoId: number | undefined;

  reboteList: RptRebote[] = [];
  minDate!: Date;
  maxDate!: Date;
  startDate!: Date | null;
  endDate!: Date | null;

  constructor(public dialog: MatDialog, private dataShared: DataSharedService,
    private servicioService: ServicioService, svManager: ManagerService,
    private authService: AuthService,
    private rptRebote: ReboteService,) {
    this.svService = svManager;
    this.recursoId = this.authService.getCurrentUser()?.id_recurso;
  }

  ngOnInit() {
    // Comparto la función para filtrar servicios. Emitida desde el sidebar
    this.dataShared.getFilterByCheckbox().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.applyFilterByCheckbox();
    });
    this.loadServicios(this.defaultSelected); // Cargar los servicios con limite de cantidad
    this.getRebotes();
  }

  @memoize
  enableRow(serv: Servicios): boolean {
    return this.authService.canEditServicio(serv);
  }

  @memoize
  checkAllDoneForResource(serv: Servicios): boolean {
    const itemsPorRecurso = serv.itemChecklistDto.filter(item => item.idRecurso === this.recursoId);
    const elRecursoTieneItems = itemsPorRecurso.length > 0
    const todoHecho = itemsPorRecurso.every(item => item.completo === true);
    return elRecursoTieneItems && todoHecho;
  }

  // Método para cargar los servicios con limite de cantidad
  loadServicios(limit: number) {
    this.dataShared.mostrarSpinner();
    this.servicioService.getTopServices(limit)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {

          if (this.authService.isAdmin()) {
            this.listServicios = data;
          } else {
            this.listServicios = data.filter(s => s.itemChecklistDto.some(i => i.idRecurso === this.recursoId));
          }

          this.dataSource.data = this.listServicios // Asigno los servicios a la tabla
          this.applyFilterByCheckbox(); // Aplico el filtro de estados y tipos de servicios
          /*
          limit === 0 ? this._snackBar.okSnackBar(`Todos los servicios cargados correctamente`)
            : limit > 30 ? this._snackBar.okSnackBar(`Últimos ${limit} servicios cargados`)
              : undefined;
          */
        }
      ).add(() => this.dataShared.ocultarSpinner());
  }


  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }



  // Métododo para filtrar servicios por el buscador
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    // Verificar si el valor es un número
    const isNumber = !isNaN(Number(filterValue));
    if (isNumber) {
      // Si es un número, realiza la conversión y filtra por idServicio
      const idServicio = Number(filterValue);
      this.applyFilterById(idServicio);
    } else {
      // Si no es un número, aplica el filtro de texto
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // Si el valor del filtro está vacío, restablecer la tabla para mostrar todos los servicios
    if (filterValue.trim() === "") {
      this.dataSource.data = this.listServicios;
      this.updatePaginator();
      return;
    }
  }

  // Método para filtrar servicios por idServicio
  applyFilterById(id: number) {
    // Filtrar los servicios que coincidan con el idServicio
    const filteredServices = this.listServicios.filter(servicio => servicio.idServicio === id);

    // Actualizar la tabla con los servicios filtrados
    this.dataSource = new MatTableDataSource(filteredServices);

    // Actualizar el paginador con los servicios filtrados
    this.updatePaginator();
  }



  // Filtrar servicios por estados, función activada desde el Sidebar
  applyFilterByCheckbox() {

    // Cargo las preferencias de estados y tipos de servicios seleccionados desde el sidebar
    const filterStatus: any[] = this.dataShared.getSharedEstado();
    const filterTipoServicio: any[] = this.dataShared.getSharedTipoServicio();
    const filterCategoria: any[] = this.dataShared.getSharedCategoria();

    // Si la lista de "estados" o "tipo de servicios" a filtrar está vacía mostrar todos los servicios
    // Sino armar un nuevo array[Servicios] con los servicios que coincidan con las preferencias del filtro

    // Filtrar por tipo de servicio y/o estado
    let filteredServices: Servicios[] = this.listServicios;

    if (filterTipoServicio.length > 0) {
      filteredServices = filteredServices.filter(servicio => filterTipoServicio.includes(servicio.tipo));
    }

    if (filterStatus.length > 0) {
      filteredServices = filteredServices.filter(servicio => filterStatus.includes(servicio.estado));
    }

    if (filterCategoria.length > 0) {
      filteredServices = filteredServices.filter(servicio => filterCategoria.includes(servicio.categoria));
    }

    // Actualizar la tabla con los servicios filtrados
    this.dataSource = new MatTableDataSource(filteredServices);
    // Actualizar el paginador con los servicios filtrados
    this.updatePaginator();
  }

  // Funciones del paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.updatePaginator();
  }
  updatePaginator() {
    this.dataSource.paginator = this.paginator;
  }

  // Función para mostrar el servicio por modal
  openDialog(element: Servicios) {
    this.dataShared.setSharedMessage(element);
    this.dialog.open(DialogModal);
  }

  // Configuración del limite de servicios a mostrar
  verUltimos = [
    { value: 30, label: "Últimos 30" },
    { value: 60, label: "Últimos 60" },
    { value: 90, label: "Últimos 90" },
    { value: 0, label: "Todos" }
  ];
  defaultSelected = this.verUltimos[3].value;

  /**
   * Zona para la lógica de los indicadores
   */

  /* Captura el cambio de fechas */
  getRebotes() {
    this.rptRebote.getRebotes()
      .subscribe(data => {
        this.reboteList = data;
        this.setMinMaxDate();
      })
  }


  onDateChange(event: any) {
    this.startDate = event.value?.start;
    this.endDate = event.value?.end;
  }


  setMinMaxDate() {
    const reboteMinDate = this.reboteList.reduce((min, rebote) => new Date(rebote.fecha!) < new Date(min.fecha!) ? rebote : min, this.reboteList[0]);
    const reboteMaxDate = this.reboteList.reduce((max, rebote) => new Date(rebote.fecha!) > new Date(max.fecha!) ? rebote : max, this.reboteList[0]);

    // Convertir las fechas a objetos Date
    const minDate = new Date(reboteMinDate.fecha!);
    const maxDate = new Date(reboteMaxDate.fecha!);

    // Sumar un día a la fecha mínima y máxima
    minDate.setDate(minDate.getDate() + 1);
    maxDate.setDate(maxDate.getDate() + 1);

    // Asignar las fechas modificadas a las propiedades minDate y maxDate
    this.minDate = minDate;
    this.maxDate = maxDate;
  }



  strReboteAmbi: string = '';
  strReboteHYS: string = '';
  strReboteHOL: string = '';
  efiAMBI: number | undefined = undefined;
  efiHYS: number | undefined = undefined;
  efiHOL: number | undefined = undefined;

  calcularEficiencia() {
    console.clear();
    const startDateStr = this.startDate!.toISOString().substring(0, 10);
    const endDateStr = this.endDate!.toISOString().substring(0, 10);

    // Filtrar los datos dentro del rango de fechas
    const reboteListInRange = this.reboteList.filter(rb => {
      const fechaStr = new Date(rb.fecha!).toISOString().substring(0, 10);
      return fechaStr >= startDateStr && fechaStr <= endDateStr;
    });

    // Ordenar los datos por fecha de manera ascendente
    reboteListInRange.sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime());

    console.log('Rebotes del rango seleccionado: ', reboteListInRange);

    if (reboteListInRange.length < 2) {
      console.error('Rango de fechas no válido o insuficientes datos.');
      return;
    };

    // Identificar el valor final
    const ultimoRebote = reboteListInRange[reboteListInRange.length - 1];
    console.log('');
    console.log('Último registro de rebote para AMBI, HYS, HOL, que representa el (Valor final) respectivamente: ', ultimoRebote);

    // Calcular el promedio de los valores previos (valor inicial)
    const previosRebotes = reboteListInRange.slice(0, -1);
    console.log('');
    console.log('-- Promedio Previos que no incluyen el valor del último rebote y que representan el (Valor incial) por tipo de servicio --')
    const promedioPreviosAMBI = previosRebotes.reduce((sum, rb) => sum + rb.reboteAmbiente!, 0) / previosRebotes.length;
    console.log('Promedio AMBI (valor inicial): ', promedioPreviosAMBI);
    const promedioPreviosHYS = previosRebotes.reduce((sum, rb) => sum + rb.reboteHys!, 0) / previosRebotes.length;
    console.log('Promedios HYS (valor inicial): ', promedioPreviosHYS);
    const promedioPreviosHOL = previosRebotes.reduce((sum, rb) => sum + rb.reboteHabilitaciones!, 0) / previosRebotes.length;
    console.log('promedios HOL (valor inicial): ', promedioPreviosHOL);

    // Calcular la diferencia porcentual
    console.log('');
    console.log('-- Formula para calcular la diferencia porcentual entre el punto A (valor inicial) y el punto B (Valor final), respecto al rebote --');
    console.log('Resultado: ((Valor final − valor inicial) / Valor inicial) * 100');
    let difPorcentualAMBI = 100 * (ultimoRebote.reboteAmbiente! - promedioPreviosAMBI) / promedioPreviosAMBI;
    difPorcentualAMBI = difPorcentualAMBI === Infinity ? 0 : difPorcentualAMBI;

    let difPorcentualHYS = 100 * (ultimoRebote.reboteHys! - promedioPreviosHYS) / promedioPreviosHYS;
    difPorcentualHYS = difPorcentualHYS === Infinity ? 0 : difPorcentualHYS;

    let difPorcentualHOL = 100 * (ultimoRebote.reboteHabilitaciones! - promedioPreviosHOL) / promedioPreviosHOL;
    difPorcentualHOL = difPorcentualHOL === Infinity ? 0 : difPorcentualHOL;

    // Actualizar los resultados
    this.strReboteAmbi = difPorcentualAMBI.toFixed(2);
    this.efiAMBI = parseFloat(this.strReboteAmbi);

    this.strReboteHYS = difPorcentualHYS.toFixed(2);
    this.efiHYS = parseFloat(this.strReboteHYS);

    this.strReboteHOL = difPorcentualHOL.toFixed(2);
    this.efiHOL = parseFloat(this.strReboteHOL);

    // Mostrar diferencias
    console.log('');
    console.log(`Rebote en Ambiente: ${resultadoRebote(this.efiAMBI)}`);
    console.log(`${this.efiAMBI} = ((${ultimoRebote.reboteAmbiente} − ${promedioPreviosAMBI}) / ${promedioPreviosAMBI}) * 100`);

    console.log(`Rebote en Ambiente: ${resultadoRebote(this.efiHYS)}`);
    console.log(`${this.efiHYS} = ((${ultimoRebote.reboteHys} − ${promedioPreviosHYS}) / ${promedioPreviosHYS}) * 100`);

    console.log(`Rebote en Ambiente: ${resultadoRebote(this.efiHOL)}`);
    console.log(`${this.efiHOL} = ((${ultimoRebote.reboteHabilitaciones} − ${promedioPreviosHOL}) / ${promedioPreviosHOL}) * 100`);

    // Transformar los signos de los resultados para hablar de eficiencia
    this.efiAMBI = invertirSignos(this.efiAMBI)
    this.efiHYS = invertirSignos(this.efiHYS)
    this.efiHOL = invertirSignos(this.efiHOL)

    function resultadoRebote(resultado: number) {
      if (resultado > 0) {
        return `El porcentaje aumentó en ${resultado}%`;
      } else if (resultado < 0) {
        return `El porcentaje disminuyó en ${resultado}%`;
      } else {
        return "Sin cambios";
      }
    }

    function invertirSignos(number: number): number {
      if (number > 0) {
        return (number * -1)
      } else if (number < 0) {
        return Math.abs(number);
      }
      return 0
    }
  }

  
}

/**
 * Este es el componente modal. Exportado para usar el html
 */
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'showMessage.html',
  styleUrls: ['./ver-servicios.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule]
})
export class DialogModal {
  servicio: any;
  constructor(private dataShared: DataSharedService) {
    this.servicio = this.dataShared.getSharedMessage();
  }
}

@Pipe({
  name: 'replaceType'
})
export class ReplaceTypePipe implements PipeTransform {

  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'ambiente':
        return 'AMBI';
      case 'habilitaciones':
        return 'HOL';
      case 'higiene y seguridad':
        return 'HYS';
      default:
        return value;
    }
  }

}