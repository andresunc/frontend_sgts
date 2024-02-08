import { Component } from '@angular/core';
import { ItemChecklistDto } from 'src/app/models/IItemChecklistDto';
import ManagerService from 'src/app/services/ServiceSupports/ManagerService';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-print-servicio',
  templateUrl: './print-servicio.component.html',
  styleUrls: ['./print-servicio.component.css']
})
export class PrintServicioComponent {

  servicioRecibido: any;
  title: string = 'Información del servicio: ';
  recurrencia: number;
  avance: number;
  svManager: ManagerService;

  constructor(private dataShared: DataSharedService, svManager: ManagerService) {
    this.svManager = svManager;
    this.servicioRecibido = this.dataShared.getSharedObject();
    this.title = this.title + this.servicioRecibido.cliente + ' | ' + this.servicioRecibido.tipo;
    this.avance = this.svManager.calcularAvance(this.servicioRecibido);
    this.recurrencia = this.servicioRecibido.recurrencia;
  }

  updateAvance(item: any) {
    item.completo = !item.completo;
    this.avance = this.svManager.calcularAvance(this.servicioRecibido);
  }
}
