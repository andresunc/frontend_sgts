import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { EmpresaDto } from 'src/app/models/ModelsDto/EmpresaDto';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class EmpresaDtoService {

  urlBackend = new UrlBackend().getUrlBackend();
  private url = this.urlBackend + '/empresaDto/getEmpresas';

  constructor(private http: HttpClient) { }

  getEmpresas(): Observable<EmpresaDto[]> {
    return this.http.get<EmpresaDto[]>(this.url)
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
