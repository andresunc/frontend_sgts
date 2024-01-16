import { Injectable } from '@angular/core';
import { Servicios } from '../models/Servicios';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ServicioService {

  private url = 'http://localhost:8080/servicioDto/getAll';

  constructor(private http: HttpClient) { }

  getAllService(): Observable<Servicios[]> {

    return this.http.get<Servicios[]>(this.url)
      .pipe(
        tap((data) => {
          return data;
        }),
        catchError((error) => {
          console.error('Error en la solicitud getAllService', error);
          return throwError(error);
        })
      );
  }

}
