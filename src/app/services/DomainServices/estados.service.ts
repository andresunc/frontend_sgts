import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  urlBackend = new UrlBackend().getUrlBackend();
  getStatusNotDeletedUrl = this.urlBackend + '/estado/getAllNotDeleted';

  constructor(private http: HttpClient) { }

  // Método GET para obtener los estados de servicios no eliminados
  getStatusNotDeleted(): Observable<Estado[]> {

    return this.http.get<Estado[]>(this.getStatusNotDeletedUrl)
      .pipe(
        tap(() => {
        }),
        catchError((error) => {
          console.error('Error en la solicitud cargarEstados', error);
          return throwError(error);
        })
      );
  }

}
