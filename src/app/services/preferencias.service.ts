import { Injectable } from '@angular/core';
import { EstadosService } from './DomainServices/estados.service';
import { TipoServicioService } from './DomainServices/tipo-servicio.service';
import { CategoriaService } from './DomainServices/categoria.service';

@Injectable({
  providedIn: 'root'
})
export class PreferenciasService {
  getAllCategorias() {
    return this.categoria.getAllCategorias();
  }

  constructor(private estados: EstadosService, private tipo: TipoServicioService, private categoria: CategoriaService) {}

  // Método para obtener los estados de los servicios: Quien lo invoque deberá suscribirse
  getStatusNotDeleted(){
    return this.estados.getStatusNotDeleted();
  }

  // Método para obtener los tipos de servicios: Quien lo invoque deberá suscribirse
  getTipoServicesNotDeleted() {
    return this.tipo.getTipoServicesNotDeleted();
  }

}
