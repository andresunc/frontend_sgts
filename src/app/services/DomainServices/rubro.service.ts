import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UrlBackend } from 'src/app/models/Url';
import { Rubro } from 'src/app/models/DomainModels/Rubro';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RubroService {

  urlBackend = new UrlBackend().getUrlBackend();
  getAllRubrosNotDeletedUrl = this.urlBackend + '/rubro/getAllNotDeleted';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllRubro(): Observable<Rubro[]> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<Rubro[]>(this.getAllRubrosNotDeletedUrl, { headers })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          console.error('Error en la solicitud getAllRubro', error);
          return throwError(error);
        })
      );
  }
}
