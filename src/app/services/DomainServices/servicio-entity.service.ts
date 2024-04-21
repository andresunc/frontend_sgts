import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Servicio } from 'src/app/models/DomainModels/Servicio';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioEntityService {

  urlBackend = new UrlBackend().getUrlBackend();
  upDateServicioUrl = this.urlBackend + '/servicio/update/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // UpDate Servicio Empresa por Servicio ID
  public update(id: number, servicio: Servicio): Observable<Servicio> {

    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.put<Servicio>(this.upDateServicioUrl + id, servicio, { headers })
    .pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
          console.error('Permisos insificientes', error);
          return throwError(error);
        }
        console.error('Error al actualizar el servicio', error);
        return throwError(error);
      })
    );
  }

}
