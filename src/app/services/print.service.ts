import { Injectable } from '@angular/core';
import { UrlBackend } from '../models/Url';
import { HttpClient } from '@angular/common/http';
import { ContactoEmpesa } from '../models/ContactoEmpresa';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  urlBackend = new UrlBackend().getUrlBackend();
  urlGetContactoEmpresa = this.urlBackend + '/contactoEmpresa/getByIdEmpresa/';
  
  constructor(private http: HttpClient) { }

  // Método para consultar los contactos de una empresa
  getContactoEmpresa(idEmpresa: number): Observable<ContactoEmpesa[]> {
    return this.http.get<ContactoEmpesa[]>( this.urlGetContactoEmpresa + idEmpresa)
    .pipe(
      tap((data) => {
        return data;
      }),
      catchError((error) => {
        console.error('Error en la solicitud getContactoEmpresa', error);
        return throwError(error);
      })
    );
  }
}
