import { Injectable } from '@angular/core';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { DataSharedService } from '../data-shared.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

/**
 * Clase para calcular algunos valores de los servicios
 */
export default class ManagerService {

  constructor(private dataShared: DataSharedService,
    private router: Router) { }

  editable: boolean = false;
  changeEditable(): boolean {
    return !this.editable;
  }

  calcularAvance(servicio: Servicios): number {

    const totalItems = servicio.itemChecklistDto.length;
    // 1 Si el total de items es mayor a 0 hacer, sino retornar 0
    // 2 Filtrar los completos? y contarlos
    // 3 Calcular y retornar el porcentaje de items completados (Completos/Total) * 100
    return servicio.itemChecklistDto.filter(item => item.completo).length / totalItems * 100 | 0;
  }

  // Establece la alerta de un servicio cuando esta en estado presentado.
  checkPresentado(servicio: Servicios): boolean {
    return servicio.idEstado === 5;
  }

  // Establece la alerta de un servicio cuando esta en estado notificado.
  checkNotificaciones(servicio: Servicios): boolean {
    return servicio.itemChecklistDto.some(item => item.notificado);
  }

  // Método para enviar el objeto al componente print-servicio
  enviarObjeto(servicio: Servicios) {
    // Si existe el objeto en localStorage, eliminarlo
    if (localStorage.getItem('servicioRecibido')) localStorage.removeItem('servicioRecibido');
    // Enviar el objeto al componente print-servicio
    this.dataShared.setSharedObject(servicio);
    localStorage.setItem('servicioRecibido', JSON.stringify(servicio));
    this.router.navigate(['/home/servicio']);
  }

}
