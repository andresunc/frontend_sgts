import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ServicioEnCurso } from 'src/app/models/RptModels/ServicioEnCurso';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiciosEnCursoService {

  urlBackend = new UrlBackend().getUrlBackend();
  private getServiciosEnCursoUrl = this.urlBackend + '/reporte/getServiciosEnCurso';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getServiciosEnCurso(): Observable<ServicioEnCurso[]>  {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<ServicioEnCurso[]>(this.getServiciosEnCursoUrl, {headers})
    .pipe(
      tap((data) => {
        console.log(data)
        return data;
      }),
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
