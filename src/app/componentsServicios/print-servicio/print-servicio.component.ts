import { Component } from '@angular/core';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-print-servicio',
  templateUrl: './print-servicio.component.html',
  styleUrls: ['./print-servicio.component.css']
})
export class PrintServicioComponent {

  servicioRecibido: any;
  title: string = 'Gestión De Servicios';
  
  constructor(private dataShared: DataSharedService) { 
    this.servicioRecibido = this.dataShared.getSharedObject();
    this.title = 'Gestión De Servicios/' + this.servicioRecibido.tipo + '/' + this.servicioRecibido.cliente ; 
  }

}
