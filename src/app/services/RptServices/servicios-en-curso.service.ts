import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ServicioEnCurso } from 'src/app/models/RptModels/ServicioEnCurso';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class ServiciosEnCursoService {

  urlBackend = new UrlBackend().getUrlBackend();
  private url = this.urlBackend + '/reporte/getServiciosEnCurso';

  constructor(private http: HttpClient) { }

  getServiciosEnCurso(): Observable<ServicioEnCurso[]>  {

    return this.http.get<ServicioEnCurso[]>(this.url)
    .pipe(
      tap((data) => {
        console.log(data)
        return data;
      }),
      catchError((error) => {
        console.error('Error en la solicitud getRecursos', error);
        return throwError(error);
      })
    );
  }
}
