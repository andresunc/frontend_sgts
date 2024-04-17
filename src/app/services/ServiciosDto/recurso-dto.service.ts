import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { RecursoDto } from 'src/app/models/ModelsDto/RecursoDto';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecursoDtoService {

  urlBackend = new UrlBackend().getUrlBackend();
  private url = this.urlBackend + '/recursoDto/getRecursos';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para obtener los recursos disponibles
  getRecursos(): Observable<RecursoDto[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<RecursoDto[]>(this.url, {headers})
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          console.error('Error en la solicitud getRecursos', error);
          return throwError(error);
        })
      );
  }
}
