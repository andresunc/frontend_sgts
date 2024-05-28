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
  createTipoServicesUrl = this.urlBackend + '/tipoServicio/create';
  updateTipoServicesUrl = this.urlBackend + '/tipoServicio/update/';
  deleteTipoServicesUrl = this.urlBackend + '/tipoServicio/delete/';


  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método GET para obtener los tipos de servicios no eliminados
  public getTipoServicesNotDeleted(): Observable<TipoServicio[]> {

    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<TipoServicio[]>(this.getTipoServicesNotDeletedUrl, {headers})
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud cargar tipos de Servicios', error);
          return throwError(error);
        })
      );
  }

  // Método para crear un nuevo Tipo de Servicio
  public createTipoServices(newTipoServicio: TipoServicio): Observable<TipoServicio> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<TipoServicio>(this.createTipoServicesUrl, newTipoServicio, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al agregar un nuevo Tipo de Servicio', error);
          return throwError(error);
        })
      );
  }

  // Método para modificar un Tipo de Servicio
  public updateTipoServices(idTipoServicio: number, tipoServicio: TipoServicio): Observable<TipoServicio> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.put<TipoServicio>(this.updateTipoServicesUrl + idTipoServicio, tipoServicio, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al actualizar el Tipo de Servicio', error);
          return throwError(error);
        })
      );
  }

  // deleteLogico Tipo de Servicio por ID
  public deleteTipoServices(idTipoServicio: number): Observable<void> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.delete<void>(this.deleteTipoServicesUrl + idTipoServicio, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al eliminar el Tipo de Servicio', error);
          return throwError(error);
        })
      );
  }

}
