import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Servicios } from 'src/app/models/Servicios';
import { ServicioService } from 'src/app/services/ServicioService';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-ver-servicios',
  templateUrl: './ver-servicios.component.html',
  styleUrls: ['./ver-servicios.component.css'],
})
export class VerServiciosComponent {

  title: string = "Gestión De Servicios";
  displayedColumns: string[] = ['cliente', 'tipo', 'estado', 'comentario', 'alertas']; // cfg columns table
  listServicios: Servicios[] = [];
  dataSource = new MatTableDataSource(this.listServicios); // cfg data de la tabla: Recibe un listado de objetos a mostrar

  constructor(public dialog: MatDialog, private dataShared: DataSharedService,
    private router: Router, private servicioService: ServicioService) {

    this.servicioService.getAllService().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      console.log('Listado en MatTableDataSource', this.dataSource);
      console.log(data[0].ItemChecklist[0].notificado);
    });

  }

  // Métododos que usa el formulario: filtrado y páginado
  // función filtrado
  applyFilter(event: Event) {

    console.log("applyFilter" + this.dataSource);
    const filterValue = (event.target as HTMLInputElement).value;

    // Filtrar servicios
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  // Funciones del paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Función para recorrer los trámites y verificar si ha sido notificado
  checkNotificaciones(element: Servicios): boolean {
    if (element.ItemChecklist && Array.isArray(element.ItemChecklist)) {
      for (const item of element.ItemChecklist) {
        if (item && item.notificado) {
          return true;
        }
      }
    }
    return false;
  }

  // Función para mostrar alerta en la lista de servicios
  checkPresentado(element: Servicios): boolean {
    if (element.idEstado === 5) return true
    else return false;
  }

  // Método para enviar el objeto al componente print-servicio
  enviarObjeto(element: Servicios) {
    this.dataShared.setSharedObject(element);
    this.router.navigate(['/home/servicio']);
  }

  // Función para mostrar el servicio por modal
  openDialog(element: Servicios) {
    this.dataShared.setSharedObject(element);
    const dialogRef = this.dialog.open(DialogModal);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }
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
    this.servicio = this.dataShared.getSharedObject();
  }
}