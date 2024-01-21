import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Servicios } from 'src/app/models/Servicios';
import { ServicioService } from 'src/app/services/ServicioService';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ver-servicios',
  templateUrl: './ver-servicios.component.html',
  styleUrls: ['./ver-servicios.component.css'],
})
export class VerServiciosComponent implements OnInit, OnDestroy {

  title: string = "Gestión De Servicios";
  displayedColumns: string[] = ['cliente', 'tipo', 'avance', 'comentario', 'alertas']; // cfg columns table
  listServicios!: Servicios[];
  dataSource = new MatTableDataSource(this.listServicios); // cfg data de la tabla: Recibe un listado de objetos a mostrar

  constructor(public dialog: MatDialog, private dataShared: DataSharedService,
    private router: Router, private servicioService: ServicioService) {  }

  ngOnInit() {
    this.loadServicios();
    this.dataShared.getFuncionEmitida().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.applyFilterByCheckbox();
    });
  }

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadServicios() {
    this.servicioService.getAllService().pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.listServicios = data;
      this.dataSource.data = this.listServicios;
      this.applyFilterByCheckbox();
    });
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
    let filteredServices = this.listServicios;

    if (filterTipoServicio.length > 0) {
      filteredServices = filteredServices.filter(servicio => filterTipoServicio.includes(servicio.tipo));
    }

    if (filterStatus.length > 0) {
      filteredServices = filteredServices.filter(servicio => filterStatus.includes(servicio.estado));
    }

    // Actualizar la tabla con los servicios filtrados
    this.dataSource = new MatTableDataSource(filteredServices);
    console.log(filteredServices);
  }


  // Funciones del paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Función para recorrer los trámites y verificar si ha sido notificado
  checkNotificaciones(element: Servicios): boolean {
    return element.itemChecklistDto.some(item => item.notificado);
  }

  // Función para mostrar alerta en la lista de servicios
  checkPresentado(element: Servicios): boolean {
    return element.idEstado === 5;
  }

  // Calcular el avance del servicio en base a los items completados
  calcularAvance(element: Servicios): number {

    const totalItems = element.itemChecklistDto.length;
    // 1 Si el total de items es mayor a 0 hacer, sino retornar 0
    // 2 Filtrar los completos? y contarlos
    // 3 Calcular y retornar el porcentaje de items completados (Completos/Total) * 100
    return totalItems > 0 ? (element.itemChecklistDto.filter(item => item.completo).length / totalItems) * 100 : 0;
  }

  // Método para enviar el objeto al componente print-servicio
  enviarObjeto(element: Servicios) {
    this.dataShared.setSharedObject(element);
    this.router.navigate(['/home/servicio']);
  }

  // Función para mostrar el servicio por modal
  openDialog(element: Servicios) {
    this.dataShared.setSharedMessage(element);
    const dialogRef = this.dialog.open(DialogModal);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  // Función y opciones para seleccionar la cantidad de servicios a mostrar
  verUltimos = [
    { value: '1', label: 'Últimos 30' },
    { value: '2', label: 'Últimos 60' },
    { value: '3', label: 'Últimos 90' },
    { value: '4', label: 'Todos' }
  ];
  defaulSelected = this.verUltimos[0].value;
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