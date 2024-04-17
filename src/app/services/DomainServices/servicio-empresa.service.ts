import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ServicioEmpresa } from 'src/app/models/DomainModels/ServicioEmpresa';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioEmpresaService {

  urlBackend = new UrlBackend().getUrlBackend();
  upDateServicioEmpresaUrl = this.urlBackend + '/servicioEmpresa/update/';
  deleteServicioEmpresaUrl = this.urlBackend + '/servicioEmpresa/delete/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // UpDate Servicio Empresa por Servicio ID
  public update(id: number, servicioEmpresa: ServicioEmpresa): Observable<ServicioEmpresa> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.put<ServicioEmpresa>(this.upDateServicioEmpresaUrl + id, servicioEmpresa, { headers })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          console.error('Error al actualizar el servicio de la empresa', error);
          return throwError(error);
        })
      );
  }

  // deleteLogico Servicio Empresa por Servicio ID
  public deleteLogico(id: number): Observable<void> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.delete<void>(this.deleteServicioEmpresaUrl + id, { headers })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          console.error('Error al eliminar el servicio', error);
          return throwError(error);
        })
      );
  }
}
