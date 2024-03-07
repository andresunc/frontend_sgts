import { Injectable } from '@angular/core';
import { Servicios } from '../../models/DomainModels/Servicios';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UrlBackend } from '../../models/Url';
import { PopupService } from '../SupportServices/popup.service';

@Injectable({
  providedIn: 'root'
})

export class ServicioService {

  urlBackend = new UrlBackend().getUrlBackend();
  private url = this.urlBackend + '/servicioDto/getTopServices';

  constructor(private http: HttpClient, private _snackBar: PopupService) { }

  // Método para obtener los servicios más recientes
  getTopServices(limit: number): Observable<Servicios[]> {

    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<Servicios[]>(this.url, { params: params })
      .pipe(
        tap((data) => {
          console.log('getTopServices: ', data);
          return data;
        }),
        catchError((error) => {
          this._snackBar.warnSnackBar('Error en la conexión ');
          console.error('Error en la solicitud getTopServices', error);
          return throwError(error);
        })
      );
  }

}
