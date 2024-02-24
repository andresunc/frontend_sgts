import { Injectable } from '@angular/core';
import { TipoServicioService } from './DomainServices/tipo-servicio.service';
import { EstadosService } from './DomainServices/estados.service';

@Injectable({
  providedIn: 'root'
})
export class NewServicioService {

  constructor(private estados: EstadosService, private tipo: TipoServicioService) { }

  /** Este Servicio requiere de los siguientes datos:
   * Tipo de servicio / GET
   * Estado del servicio / GET
   * Recurso gg / GET
   * Empresa / GET
   */

  // Tipo de servicios disponibles
  getTipoServicesNotDeleted() {
    return this.tipo.getTipoServicesNotDeleted();
  }
  // Estados de servicios disponibles
  getStatusNotDeleted(){
    return this.estados.getStatusNotDeleted();
  }

  // Método para consultar los Recurso gg disponibles


}
