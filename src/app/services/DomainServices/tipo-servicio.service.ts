import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { TipoServicio } from 'src/app/models/DomainModels/TipoServicio';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TipoServicioService {

  urlBackend = new UrlBackend().getUrlBackend();
  getTipoServicesNotDeletedUrl = this.urlBackend + '/tipoServicio/getAllNotDeleted';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método GET para obtener los tipos de servicios no eliminados
  getTipoServicesNotDeleted(): Observable<TipoServicio[]> {

    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<TipoServicio[]>(this.getTipoServicesNotDeletedUrl, {headers})
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud cargar tipos de Servicios', error);
          return throwError(error);
        })
      );
  }
}
