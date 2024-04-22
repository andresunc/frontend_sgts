import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ContactoEmpresa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContactoEmpresaService {

  urlBackend = new UrlBackend().getUrlBackend();
  urlGetContactoEmpresa = this.urlBackend + '/contactoEmpresa/getByIdEmpresa/';
  urlPostContactoEmpresa = this.urlBackend + '/contactoEmpresa/create-multiple';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método GET para obtener los contactos de una empresa
  getContactoEmpresa(idEmpresa: number): Observable<ContactoEmpresa[]> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<ContactoEmpresa[]>(this.urlGetContactoEmpresa + idEmpresa, { headers })
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
