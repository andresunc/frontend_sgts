import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { RecursoDto } from 'src/app/models/ModelsDto/RecursoDto';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class RecursoDtoService {

  urlBackend = new UrlBackend().getUrlBackend();
  private url = this.urlBackend + '/recursoDto/getRecursos';

  constructor(private http: HttpClient) { }

  // Método para obtener los recursos disponibles
  getRecursos(): Observable<RecursoDto[]> {
    return this.http.get<RecursoDto[]>(this.url)
      .pipe(
        tap((data) => {
          return data;
        }),
        catchError((error) => {
          console.error('Error en la solicitud getRecursos', error);
          return throwError(error);
        })
      );
  }
}
