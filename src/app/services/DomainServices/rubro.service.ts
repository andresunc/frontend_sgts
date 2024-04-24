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
  createRubroUrl = this.urlBackend + '/rubro/create';
  upDateRubroUrl = this.urlBackend + '/rubro/update/';
  deleteRubroUrl = this.urlBackend + '/rubro/delete/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllRubro(): Observable<Rubro[]> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<Rubro[]>(this.getAllRubrosNotDeletedUrl, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud getAllRubro', error);
          return throwError(error);
        })
      );
  }

  // Método para crear un nuevo Rubro
  createRubro(newRubro: Rubro): Observable<Rubro> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<Rubro>(this.createRubroUrl, newRubro, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al agregar un nuevo Rubro', error);
          return throwError(error);
        })
      );
  }

  // Método para modificar un Rubro
  public updateRubro(idRubro: number, rubro: Rubro): Observable<Rubro> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.put<Rubro>(this.upDateRubroUrl + idRubro, rubro, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al actualizar el Rubro', error);
          return throwError(error);
        })
      );
  }

  // deleteLogico Rubro por Rubro ID
  public deleteLogico(idRubro: number): Observable<void> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.delete<void>(this.deleteRubroUrl + idRubro, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al eliminar el Rubro', error);
          return throwError(error);
        })
      );
  }

}
