import { Component } from '@angular/core';
import ManagerService from 'src/app/services/ServiceSupports/ManagerService';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-print-servicio',
  templateUrl: './print-servicio.component.html',
  styleUrls: ['./print-servicio.component.css']
})
export class PrintServicioComponent {

  servicioRecibido: any;
  title: string = 'Gestión De Servicios';
  svService: ManagerService;
  
  constructor(private dataShared: DataSharedService, svManager: ManagerService) { 
    this.servicioRecibido = this.dataShared.getSharedObject();
    this.title = 'Gestión De Servicios | ' + this.servicioRecibido.tipo + ' | ' + this.servicioRecibido.cliente ; 
    this.svService = svManager;
  }

}
