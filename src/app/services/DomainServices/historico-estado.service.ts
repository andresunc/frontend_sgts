import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HistoricoEstado } from 'src/app/models/DomainModels/HistoricoEstado';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class HistoricoEstadoService {

  urlBackend = new UrlBackend().getUrlBackend();
  addNewHistoricoEstadoUrl = this.urlBackend + '/historicoestado/create';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para crear un nuevo HistoricoEstado
  addHistoricoEstado(addHistoricoEstado: HistoricoEstado): Observable<HistoricoEstado> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<HistoricoEstado>(this.addNewHistoricoEstadoUrl, addHistoricoEstado, { headers })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          console.error('Error al agregar un nuevo HistoricoEstado', error);
          return throwError(error);
        })
      );
  }
}
