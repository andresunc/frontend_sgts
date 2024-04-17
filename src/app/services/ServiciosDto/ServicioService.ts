import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Servicios } from '../../models/DomainModels/Servicios';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import { PopupService } from '../SupportServices/popup.service';
import { UrlBackend } from '../../models/Url';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})

export class ServicioService {

  urlBackend = new UrlBackend().getUrlBackend();
  private getTopServicesUrl = this.urlBackend + '/servicioDto/getTopServices';
  private getItemsChecklistUrl = this.urlBackend + '/servicioDto/getItemsChecklist';

  constructor(private http: HttpClient, 
    private _snackBar: PopupService, 
    private authService: AuthService) { }

  // Método para obtener los servicios más recientes
  getTopServices(limit: number): Observable<Servicios[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getCurrentToken()}`
    });

    const params = { limit: limit.toString() };

    return this.http.get<Servicios[]>(this.getTopServicesUrl, { headers, params })
      .pipe(
        tap((data) => {
          console.log('getTopServices: ', data);
          return data;
        }),
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          this._snackBar.warnSnackBar('Error en la conexión', 'Aceptar');
          console.error('Error en la solicitud getTopServices', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener los Items del CheckList de un Servicio
  getItemsChecklist(idServicio: number): Observable<ItemChecklistDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getCurrentToken()}`
    });

    const params = { idServicio: idServicio.toString() };

    return this.http.get<ItemChecklistDto[]>(this.getItemsChecklistUrl, { headers, params })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.authService.logout();
          }
          console.error('Error en la solicitud getItemsChecklist', error);
          return throwError(error);
        })
      );
  }
}
