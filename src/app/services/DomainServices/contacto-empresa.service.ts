import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ContactoEmpresa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class ContactoEmpresaService {

  urlBackend = new UrlBackend().getUrlBackend();
  urlGetContactoEmpresa = this.urlBackend + '/contactoEmpresa/getByIdEmpresa/';

  constructor(private http: HttpClient) { }

  // Método GET para obtener los contactos de una empresa
  getContactoEmpresa(idEmpresa: number): Observable<ContactoEmpresa[]> {
    return this.http.get<ContactoEmpresa[]>( this.urlGetContactoEmpresa + idEmpresa)
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
