import { Injectable } from '@angular/core';
import { Servicios } from '../models/Servicios';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UrlBackend } from '../models/Url';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class ServicioService {

  urlBackend = new UrlBackend().getUrlBackend();
  private url = this.urlBackend + '/servicioDto/getTopServices';

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  getTopServices(limit: number): Observable<Servicios[]> {

    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<Servicios[]>(this.url, { params: params })
      .pipe(
        tap((data) => {
          console.log('getTopServices: ', data);
          return data;
        }),
        catchError((error) => {
          this.openSnackBar('Error en la conexión con el servidor');
          console.error('Error en la solicitud getTopServices', error);
          return throwError(error);
        })
      );
  }

  openSnackBar(errorMessage: string) {
    this._snackBar.open(errorMessage, 'cerrar', { duration: 3000, panelClass: 'error'});
  }

}
