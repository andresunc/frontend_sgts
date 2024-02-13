import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Servicios } from 'src/app/models/Servicios';
import { ServicioService } from 'src/app/services/ServicioService';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import ManagerService from 'src/app/services/ServiceSupports/ManagerService';

@Component({
  selector: 'app-ver-servicios',
  templateUrl: './ver-servicios.component.html',
  styleUrls: ['./ver-servicios.component.css'],
})
export class VerServiciosComponent implements OnInit, OnDestroy {

  title: string = "Gestión De Servicios";
  displayedColumns: string[] = ['cliente', 'tipo', 'avance', 'comentario', 'alertas']; // cfg columns table
  listServicios!: Servicios[];
  svService: ManagerService; // Trabaja para calcular algunos valores de los servicios
  dataSource = new MatTableDataSource(this.listServicios); // cfg data de la tabla: Recibe un listado de objetos a mostrar

  constructor(public dialog: MatDialog, private dataShared: DataSharedService,
    private servicioService: ServicioService, svManager: ManagerService) {
    this.svService = svManager;
  }

  ngOnInit() {
    // Comparto la función para filtrar servicios. Emitida desde el sidebar
    this.dataShared.getFilterByCheckbox().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.applyFilterByCheckbox();
    });
    this.loadServicios(this.defaultSelected); // Cargar los servicios con limite de cantidad
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
    const dialogRef = this.dialog.open(DialogModal);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Resultado del modal: ${result}`);
    });

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
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule]
})
export class DialogModal {
  servicio: any;
  constructor(private dataShared: DataSharedService) {
    this.servicio = this.dataShared.getSharedMessage();
  }
}