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
  createEstadoUrl = this.urlBackend + '/estado/create';
  upDateEstadoUrl = this.urlBackend + '/estado/update/';
  deleteEstadoUrl = this.urlBackend + '/estado/delete/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método GET para obtener los estados de servicios no eliminados
  getStatusNotDeleted(): Observable<Estado[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<Estado[]>(this.getStatusNotDeletedUrl, {headers})
      .pipe(
        tap(() => {
        }),
        catchError((error) => {
          console.error('Error en la solicitud cargarEstados', error);
          return throwError(error);
        })
      );
  }

  // Método para crear un nuevo Estado
  createEstado(newEstado: Estado): Observable<Estado> {
    const headers: HttpHeaders = this.authService.getHeader();
    console.log("headers create estado: ", headers)
    console.log("newEstado: ", newEstado)
    return this.http.post<Estado>(this.createEstadoUrl, newEstado, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al agregar un nuevo Estado', error);
          return throwError(error);
        })
      );
  }

  // Método para modificar un Estado
  public updateEstado(idEstado: number, estado: Estado): Observable<Estado> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.put<Estado>(this.upDateEstadoUrl + idEstado, estado, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al actualizar el Estado', error);
          return throwError(error);
        })
      );
  }

  // deleteLogico Estado por Estado ID
  public deleteLogico(idEstado: number): Observable<void> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.delete<void>(this.deleteEstadoUrl + idEstado, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al eliminar el Estado', error);
          return throwError(error);
        })
      );
  }

}
