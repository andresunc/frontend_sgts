import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Servicios } from '../../models/DomainModels/Servicios';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import { UrlBackend } from '../../models/Url';
import { AuthService } from '../auth.service';
import { NuevoServicioDto } from 'src/app/models/ModelsDto/NuevoServicioDto';
import { Servicio } from 'src/app/models/DomainModels/Servicio';
import { RenovarServicio } from 'src/app/models/DomainModels/RenovarServicio';


@Injectable({
  providedIn: 'root'
})

export class ServicioService {

  private urlBackend = new UrlBackend().getUrlBackend();
  private getTopServicesUrl = this.urlBackend + '/servicioDto/getTopServices';
  private getItemsChecklistUrl = this.urlBackend + '/servicioDto/getItemsChecklist';
  private urlNewServicio = this.urlBackend + '/nuevo/crearServicio';
  private getServicioByIdUrl = this.urlBackend + '/servicioDto/';
  private upDateServicioUrl = this.urlBackend + '/servicio/update/';
  private getCheckRenovadoUrl = this.urlBackend + '/servicio/checkRenovado/'
  private renovarServicioUrl = this.urlBackend + '/servicio/renovarServicio'
  countdown: number = 5;
  retry: number;

  constructor(private http: HttpClient,
    private authService: AuthService) {
    this.retry = parseInt(localStorage.getItem('retry')!) || 1;
  }

  // Método para renovar un servicio
  renewServicio(data: RenovarServicio): Observable<number> {

    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<number>(this.renovarServicioUrl, data, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud renewServicio', error);
          return throwError(error);
        })
      );
  }

  // Método para saber si un servicio ha sido renovado
  CheckServicioRenovado(idServicio: number): Observable<boolean> {

    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<boolean>(this.getCheckRenovadoUrl + idServicio, { headers })
      .pipe(
        tap((isRenovado: boolean) => {
          return isRenovado;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // Método para obtener los servicios más recientes
  getTopServices(limit: number): Observable<Servicios[]> {

    const headers: HttpHeaders = this.authService.getHeader();
    const params = { limit: limit.toString() };

    return this.http.get<Servicios[]>(this.getTopServicesUrl, { headers, params })
      .pipe(
        tap((data: Servicios[]) => {
          console.log('getTopServices: ', data);
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // Método para obtener los servicios más recientes
  getServicioById(servicioId: number): Observable<Servicios> {

    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<Servicios>(this.getServicioByIdUrl + servicioId, { headers })
      .pipe(
        tap((data) => {
          console.log('Servicio ID: ' + servicioId, data);
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  // Método para obtener los Items del CheckList de un Servicio
  getItemsChecklist(idServicio: number): Observable<ItemChecklistDto[]> {

    const headers: HttpHeaders = this.authService.getHeader();
    const params = { idServicio: idServicio.toString() };

    return this.http.get<ItemChecklistDto[]>(this.getItemsChecklistUrl, { headers, params })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud getItemsChecklist', error);
          return throwError(error);
        })
      );
  }

  addServicio(addServicio: NuevoServicioDto): Observable<NuevoServicioDto> {

    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<NuevoServicioDto>(this.urlNewServicio, addServicio, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud addServicio', error);
          return throwError(error);
        })
      );
  }

  // UpDate Servicio Empresa por Servicio ID
  update(id: number, servicio: Servicio): Observable<Servicio> {

    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.put<Servicio>(this.upDateServicioUrl + id, servicio, { headers })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            console.error('Permisos insificientes', error);
            return throwError(error);
          }
          console.error('Error al actualizar el servicio', error);
          return throwError(error);
        })
      );
  }

}
