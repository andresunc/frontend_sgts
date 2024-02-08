import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Estados } from '../models/Estados';
import { TipoServicio } from '../models/TipoServicio';
import { UrlBackend } from '../models/Url';

@Injectable({
  providedIn: 'root'
})
export class PreferenciasService {
  urlBackend = new UrlBackend().getUrlBackend();
  getStatusNotDeletedUrl = this.urlBackend + '/estado/getAllNotDeleted';
  getTipoServicesNotDeletedUrl = this.urlBackend + '/tipoServicio/getAllNotDeleted';

  constructor(private http: HttpClient) {}

  // Método para obtener los estados de los servicios: Quien lo invoque deberá suscribirse
  getStatusNotDeleted(): Observable<Estados[]> {

    return this.http.get<Estados[]>(this.getStatusNotDeletedUrl)
      .pipe(
        tap(() => {
        }),
        catchError((error) => {
          console.error('Error en la solicitud cargarEstados', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener los tipos de servicios: Quien lo invoque deberá suscribirse
  getTipoServicesNotDeleted(): Observable<TipoServicio[]> {

    return this.http.get<TipoServicio[]>(this.getTipoServicesNotDeletedUrl)
      .pipe(
        tap(() => {
        }),
        catchError((error) => {
          console.error('Error en la solicitud cargar tipos de Servicios', error);
          return throwError(error);
        })
      );
  }

}
