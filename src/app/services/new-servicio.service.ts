import { Injectable } from '@angular/core';
import { TipoServicioService } from './DomainServices/tipo-servicio.service';
import { EstadosService } from './DomainServices/estados.service';
import { RecursoDtoService } from './ServiciosDto/recurso-dto.service';
import { EmpresaDtoService } from './ServiciosDto/empresa-dto.service';
import { NuevoServicioDto } from '../models/ModelsDto/NuevoServicioDto';
import { ServicioService } from './ServiciosDto/ServicioService';

@Injectable({
  providedIn: 'root'
})
export class NewServicioService {

  constructor(
    private estado: EstadosService, 
    private tipo: TipoServicioService,
    private recurso: RecursoDtoService,
    private empresa: EmpresaDtoService,
    private servicioService: ServicioService,
    ) { }

  /** Este Servicio requiere de los siguientes datos:
   * Tipos de servicio / GET
   * Estados del servicio / GET
   * Recursos gg / GET
   * Empresas / GET
   */

  // Tipo de servicios disponibles
  getTipoServicesNotDeleted() {
    return this.tipo.getTipoServicesNotDeleted();
  }
  
  // Estados de servicios disponibles
  getStatusNotDeleted(){
    return this.estado.getStatusNotDeleted();
  }

  // Método para consultar los Recurso gg disponibles
  getRecursos() {
    return this.recurso.getRecursos();
  }

  // Método para consultar las empresas
  getEmpresas() {
    return this.empresa.getEmpresas();
  }

  // Método para crear un nuevo servicio
  addServicio(addServicio: NuevoServicioDto) {
    return this.servicioService.addServicio(addServicio);
  }
}
