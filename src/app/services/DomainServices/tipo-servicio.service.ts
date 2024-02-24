import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { TipoServicio } from 'src/app/models/TipoServicio';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class TipoServicioService {

  urlBackend = new UrlBackend().getUrlBackend();
  getTipoServicesNotDeletedUrl = this.urlBackend + '/tipoServicio/getAllNotDeleted';

  constructor(private http: HttpClient) {}

  // Método GET para obtener los tipos de servicios no eliminados
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
