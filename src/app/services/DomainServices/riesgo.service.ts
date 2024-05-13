import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  getAllRiesgoUrl = this.urlBackend + '/riesgo/getAllNotDeleted';
  createRiesgoUrl = this.urlBackend + '/riesgo/create';
  upDateRiesgoUrl = this.urlBackend + '/riesgo/update/';
  deleteRiesgoUrl = this.urlBackend + '/riesgo/delete/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllRiesgo(): Observable<Riesgo[]> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<Riesgo[]>(this.getAllRiesgoUrl, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud getAllRiesgo', error);
          return throwError(error);
        })
      );
  }

  // Método para crear un nuevo Riesgo
  createRiesgo(newRiesgo: Riesgo): Observable<Riesgo> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<Riesgo>(this.createRiesgoUrl, newRiesgo, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al agregar un nuevo Riesgo', error);
          return throwError(error);
        })
      );
  }

  // Método para modificar un Riesgo
  public updateRiesgo(idRiesgo: number, riesgo: Riesgo): Observable<Riesgo> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.put<Riesgo>(this.upDateRiesgoUrl + idRiesgo, riesgo, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al actualizar el Riesgo', error);
          return throwError(error);
        })
      );
  }

  // delete Riesgo por Risgoo ID
  public delete(idRiesgo: number): Observable<void> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.delete<void>(this.deleteRiesgoUrl + idRiesgo, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al eliminar el Riesgo', error);
          return throwError(error);
        })
      );
  }

}
