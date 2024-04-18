import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Empresa } from 'src/app/models/DomainModels/Empresa';
import { EmpresaWithContacts } from 'src/app/models/ModelsDto/EmpresaWithContacts';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  urlBackend = new UrlBackend().getUrlBackend();
  newEmpresaWithContactsUrl = this.urlBackend + '/empresaDto/create-empresa-with-contacts';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para crear un nuevo servicio
  addEmpresaWithContacts(empresaAndContacts: EmpresaWithContacts): Observable<EmpresaWithContacts> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.post<EmpresaWithContacts>(this.newEmpresaWithContactsUrl, empresaAndContacts, { headers })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          console.error('Error en la solicitud addEmpresaWithContacts', error);
          return throwError(error);
        })
      );
  }

}
