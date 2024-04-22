import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { EmpresaWithContacts } from 'src/app/models/ModelsDto/EmpresaWithContacts';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  urlBackend = new UrlBackend().getUrlBackend();
  newEmpresaWithContactsUrl = this.urlBackend + '/empresaDto/create-empresa-with-contacts';
  upDateEmpresaWithContactsUrl = this.urlBackend + '/empresaDto/update-empresa-with-contacts';
  deleteEmpresaAndContactsUrl = this.urlBackend + '/empresa/delete/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para crear un nuevo servicio
  addEmpresaWithContacts(empresaAndContacts: EmpresaWithContacts): Observable<EmpresaWithContacts> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.post<EmpresaWithContacts>(this.newEmpresaWithContactsUrl, empresaAndContacts, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud addEmpresaWithContacts', error);
          return throwError(error);
        })
      );
  }

  // Método para actualizar una empresa con contactos
  updateEmpresaWithContacts(empresaAndContacts: EmpresaWithContacts): Observable<EmpresaWithContacts> {
  const headers: HttpHeaders = this.authService.getHeader();

  return this.http.put<EmpresaWithContacts>(this.upDateEmpresaWithContactsUrl, empresaAndContacts, { headers })
    .pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
          console.error('Permisos insificientes', error);
          return throwError(error);
        }
        console.error('Error en la solicitud updateEmpresaWithContacts', error);
        return throwError(error);
      })
    );
}


  // deleteLogico Servicio Empresa por Servicio ID
  public deleteLogico(idEmpresa: number): Observable<void> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.delete<void>(this.deleteEmpresaAndContactsUrl + idEmpresa, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar la empresa', error);
          return throwError(error);
        })
      );
  }

}
