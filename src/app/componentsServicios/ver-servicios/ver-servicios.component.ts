import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Servicios } from 'src/app/models/Servicios';
import { DataSharedService } from 'src/app/services/data-shared.service';

const OneServicio: Servicios = {
  id: 10,
  tipo: "Habilitaciones",
  cliente: "YPF",
  rubro: "Estaciones de servicio",
  estado: "Presentado",
  presentado: false,
  avance: 40,
  recurrencia: 0,
  fecha_notificacion: ".",
  total_presupuestado: 58000.00,
  comentario: "",
  item_checklist: [
    {
      nombre_item: "Certificado eléctrico",
      inicio_estimado: "ku",
      fin_estimado: ".",
      ejecucion_real: ".",
      fin_real: ".",
      notificado: false,
      valor_tasa: 0,
      hojas: 0,
      responsable: "Many el constructor",
      url_comprobante: "drive.google.com/1"
    },
    {
      nombre_item: "Ambiente",
      inicio_estimado: "ka",
      fin_estimado: ".",
      ejecucion_real: ".",
      fin_real: ".",
      notificado: false,
      valor_tasa: 7000.00,
      hojas: 5,
      responsable: "Facundo Manes",
      url_comprobante: "drive.google.com"
    }
  ]
};
const TwoServicio: Servicios = {
  id: 112,
  tipo: "Ambiente",
  cliente: "Mc Donalds",
  rubro: "Alimentos",
  estado: "Presentado",
  presentado: false,
  avance: 40,
  recurrencia: 0,
  fecha_notificacion: ".",
  total_presupuestado: 58000.00,
  comentario: "20-14292139-2 \nAxion2022 \nExte. Policia Ambiental: Laura Bertea 002714/2023",
  item_checklist: [
    {
      nombre_item: "Certificado eléctrico",
      inicio_estimado: "ku",
      fin_estimado: ".",
      ejecucion_real: ".",
      fin_real: ".",
      notificado: false,
      valor_tasa: 0,
      hojas: 0,
      responsable: "Many el constructor",
      url_comprobante: "drive.google.com/1"
    },
    {
      nombre_item: "Ambiente",
      inicio_estimado: "ka",
      fin_estimado: ".",
      ejecucion_real: ".",
      fin_real: ".",
      notificado: false,
      valor_tasa: 7000.00,
      hojas: 5,
      responsable: "Facundo Manes",
      url_comprobante: "drive.google.com"
    }
  ]
};

@Component({
  selector: 'app-ver-servicios',
  templateUrl: './ver-servicios.component.html',
  styleUrls: ['./ver-servicios.component.css'],
})
export class VerServiciosComponent implements OnInit {

  notify = false; // para la lógica de las notificaciones.
  title: string = "Gestión De Servicios";
  displayedColumns: string[] = ['cliente', 'servicio', 'avance', 'comentario', 'alertas']; // cfg columns table

  constructor(public dialog: MatDialog, private dataShared: DataSharedService, private router: Router) { }

  ngOnInit(): void { }

  /**
   *     Zona de testeo. En listServicios debe ir el listado de servicios provinientes del backend
   */
  listServicios: Servicios[] = [OneServicio, TwoServicio, OneServicio, OneServicio, TwoServicio,
    OneServicio, OneServicio, OneServicio, OneServicio, TwoServicio, OneServicio, OneServicio, TwoServicio]; // emulo el servicio que recibe los objetos servicios

  dataSource = new MatTableDataSource(this.listServicios); // cfg data de la tabla: Recibe un listado de objetos a mostrar
  /**
   * Métododos que usa el formulario: filtrado y páginado
   */
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
    for (const item of element.item_checklist) {
      if (item.notificado === true) {
        return this.notify = true;
      }
    }
    return this.notify = false;
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