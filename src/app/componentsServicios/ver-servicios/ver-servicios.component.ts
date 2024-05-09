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
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(public dialog: MatDialog, private dataShared: DataSharedService,
    private servicioService: ServicioService, private svManager: ManagerService,
    private _snackBar: PopupService, private authService: AuthService) {
    this.svService = svManager;
  }

  ngOnInit() {
    // Comparto la función para filtrar servicios. Emitida desde el sidebar
    this.dataShared.getFilterByCheckbox().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.applyFilterByCheckbox();
    });
    this.loadServicios(this.defaultSelected); // Cargar los servicios con limite de cantidad
  }

  enableRow(serv: Servicios): boolean {
    return this.authService.canEditServicio(serv);
  }

  // Método para cargar los servicios con limite de cantidad
  loadServicios(limit: number) {
    this.dataShared.mostrarSpinner();
    this.servicioService.getTopServices(limit)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.listServicios = data; // Asigno los servicios a la lista
          this.dataSource.data = this.listServicios; // Asigno los servicios a la tabla
          this.applyFilterByCheckbox(); // Aplico el filtro de estados y tipos de servicios
          limit === 0 ? this._snackBar.okSnackBar(`Todos los servicios cargados correctamente`)
            : limit > 30 ? this._snackBar.okSnackBar(`Últimos ${limit} servicios cargados`)
              : undefined;
        }
      ).add(() => this.dataShared.ocultarSpinner());
  }

  calcularDiferencia(fecha_alta: string): string {
    const fechaActual = new Date();
    const fechaAlta = new Date(fecha_alta);
    const diffTiempo = Math.abs(fechaActual.getTime() - fechaAlta.getTime());
    const diffSegundos = Math.floor(diffTiempo / 1000);
    const diffMinutos = Math.floor(diffSegundos / 60);
    const diffHoras = Math.floor(diffMinutos / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffDias === 0 && diffHoras === 0 && diffMinutos < 1) {
      return 'hace unos segundos';
    } else if (diffDias === 0 && diffHoras === 0) {
      return `hace ${diffMinutos} minuto${diffMinutos !== 1 ? 's' : ''}`;
    } else if (diffDias === 0) {
      return `hace ${diffHoras} hora${diffHoras !== 1 ? 's' : ''}`;
    } else if (diffDias === 1) {
      return 'hace 1 día';
    } else if (diffDias < 30) {
      return `hace ${diffDias} día${diffDias !== 1 ? 's' : ''}`;
    } else {
      const diffMeses = Math.floor(diffDias / 30);
      const diasAdicionales = diffDias % 30;
      if (diasAdicionales === 0) {
        return `hace ${diffMeses} mes${diffMeses !== 1 ? 'es' : ''}`;
      } else {
        return `hace ${diffMeses} mes${diffMeses !== 1 ? 'es' : ''} y ${diasAdicionales} día${diasAdicionales !== 1 ? 's' : ''}`;
      }
    }
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Filtrar servicios por estados, función activada desde el Sidebar
  applyFilterByCheckbox() {

    // Cargo las preferencias de estados y tipos de servicios seleccionados desde el sidebar
    const filterStatus: any[] = this.dataShared.getSharedEstado();
    const filterTipoServicio: any[] = this.dataShared.getSharedTipoServicio();

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
  defaultSelected = this.verUltimos[0].value;
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