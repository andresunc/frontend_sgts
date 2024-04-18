import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UrlBackend } from 'src/app/models/Url';
import { Riesgo } from 'src/app/models/DomainModels/Riesgo';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RiesgoService {

  urlBackend = new UrlBackend().getUrlBackend();
  getAllRiesgoUrl = this.urlBackend + '/riesgo/getAll';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllRiesgo(): Observable<Riesgo[]> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<Riesgo[]>(this.getAllRiesgoUrl, { headers })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          console.error('Error en la solicitud getAllRiesgo', error);
          return throwError(error);
        })
      );
  }

}
