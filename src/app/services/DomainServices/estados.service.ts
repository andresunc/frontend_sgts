import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  urlBackend = new UrlBackend().getUrlBackend();
  getStatusNotDeletedUrl = this.urlBackend + '/estado/getAllNotDeleted';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método GET para obtener los estados de servicios no eliminados
  getStatusNotDeleted(): Observable<Estado[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<Estado[]>(this.getStatusNotDeletedUrl, {headers})
      .pipe(
        tap(() => {
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          console.error('Error en la solicitud cargarEstados', error);
          return throwError(error);
        })
      );
  }

}
