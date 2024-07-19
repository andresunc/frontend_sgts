import { Injectable, OnDestroy } from '@angular/core';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { DataSharedService } from '../data-shared.service';
import { Router } from '@angular/router';
import { NuevoServicioDto } from 'src/app/models/ModelsDto/NuevoServicioDto';
import { ServicioService } from '../ServiciosDto/ServicioService';
import { Subject, takeUntil } from 'rxjs';
import { Params } from 'src/app/models/Params';
import { AuthService } from '../auth.service';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Clase para calcular algunos valores de los servicios
 */
export default class ManagerService implements OnDestroy {

  constructor(
    private dataShared: DataSharedService,
    private servicioService: ServicioService,
    private router: Router,
    private params: Params,
    private authService: AuthService,
    private _snackBar: PopupService) { }

  editable: boolean = false;
  changeEditable(): boolean {
    return !this.editable;
  }

  // Establece la alerta de un servicio cuando esta en estado presentado.
  checkPresentado(servicio: Servicios): boolean {
    console.log('pongoww')
    return servicio.idEstado === 5;
  }

  // Establece la alerta de un servicio cuando esta en estado notificado.
  checkNotificaciones(servicio: Servicios): boolean {
    return servicio.itemChecklistDto.some(item => item.notificado);
  }

  // Método para enviar el objeto al componente print-servicio
  enviarObjeto(servicio: Servicios) {

    const isEnCurso = (servicio.categoria === this.params.EN_CURSO);
    const isAdmin = (this.authService.isAdmin());

    if (!isAdmin && !isEnCurso) {
      console.log('Sin permisos para avanzar, el servicio no está en curso.');
      this._snackBar.warnSnackBar('Este servicio no está en curso');
      return;
    }


    // Si existe el objeto en localStorage, eliminarlo
    if (localStorage.getItem('servicioRecibido')) localStorage.removeItem('servicioRecibido');
    // Enviar el objeto al componente print-servicio
    this.dataShared.setSharedObject(servicio);
    localStorage.setItem('servicioRecibido', JSON.stringify(servicio));
    this.router.navigate(['/home/servicio']);
  }

  listServicios!: Servicios[];
  castNewServicio(newServicio: NuevoServicioDto) {
    // Se consultan los últimos 10 para evitar problemas si se crean servicios de manera simultánea
    this.servicioService.getTopServices(10)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.listServicios = data.filter(servicio => servicio.idServicio === newServicio.servicio.idServicio);
          if (this.listServicios.length > 0) {
            this.enviarObjeto(this.listServicios[0]);
          } else {
            console.log("No se encontraron servicios con el id proporcionado.");
          }
        }
      )
  }

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
