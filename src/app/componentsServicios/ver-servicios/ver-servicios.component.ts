import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
export class VerServiciosComponent implements OnInit {

  title: string = "Gestión De Servicios";
  //displayedColumns: string[] = ['cliente', 'tipo', 'estado', 'comentario', 'alertas']; // cfg columns table
  displayedColumns: string[] = ['cliente']; // cfg columns table
  listServicios!: Servicios[];

  constructor(public dialog: MatDialog, private dataShared: DataSharedService,
    private router: Router, private servicioService: ServicioService) { }

  ngOnInit(): void {
    this.servicioService.getAllService().subscribe((data) => {
      data.forEach(x => console.log(x));
      this.listServicios = data;
    });
  }

  dataSource = new MatTableDataSource(this.listServicios); // cfg data de la tabla: Recibe un listado de objetos a mostrar

  // Métododos que usa el formulario: filtrado y páginado
  // función filtrado
  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    // Filtrar servicios
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  // Funciones del paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Funciones para recorrer los trámites y verificar si ha sido notificado
  checkNotificaciones(element: Servicios): boolean {
    for (const item of element.ItemChecklist) {
      if (item.notificado) return true;
    }
    return false;
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