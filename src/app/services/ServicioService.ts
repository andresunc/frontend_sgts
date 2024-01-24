import { Injectable } from '@angular/core';
import { Servicios } from '../models/Servicios';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ServicioService {

  private url = 'http://localhost:8080/servicioDto/getTopServices';

  constructor(private http: HttpClient) { }

  getTopServices(limit: number): Observable<Servicios[]> {

    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<Servicios[]>(this.url, { params: params } )
      .pipe(
        tap((data) => {
          return data;
        }),
        catchError((error) => {
          console.error('Error en la solicitud getTopServices', error);
          return throwError(error);
        })
      );
  }

}
