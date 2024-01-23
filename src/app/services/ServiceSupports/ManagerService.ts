import { Injectable } from '@angular/core';
import { Servicios } from 'src/app/models/Servicios';
import { DataSharedService } from '../data-shared.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export default class ManagerService {

  constructor(private dataShared: DataSharedService,
    private router: Router) { }

  calcularAvance(servicio: Servicios): number {

    const totalItems = servicio.itemChecklistDto.length;
    // 1 Si el total de items es mayor a 0 hacer, sino retornar 0
    // 2 Filtrar los completos? y contarlos
    // 3 Calcular y retornar el porcentaje de items completados (Completos/Total) * 100
    return totalItems > 0 ? (servicio.itemChecklistDto.filter(item => item.completo).length / totalItems) * 100 : 0;
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
    this.dataShared.setSharedObject(servicio);
    this.router.navigate(['/home/servicio']);
  }


}
