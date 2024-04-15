import { Injectable } from '@angular/core';
import { Servicios } from '../../models/DomainModels/Servicios';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UrlBackend } from '../../models/Url';
import { PopupService } from '../SupportServices/popup.service';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';

@Injectable({
  providedIn: 'root'
})

export class ServicioService {

  urlBackend = new UrlBackend().getUrlBackend();
  private getTopServicesUrl = this.urlBackend + '/servicioDto/getTopServices';
  private getItemsChecklistUrl = this.urlBackend + '/servicioDto/getItemsChecklist';

  constructor(private http: HttpClient, private _snackBar: PopupService) { }

  // Método para obtener los servicios más recientes
  getTopServices(limit: number): Observable<Servicios[]> {

    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<Servicios[]>(this.getTopServicesUrl, { params: params })
      .pipe(
        tap((data) => {
          console.log('getTopServices: ', data);
          return data;
        }),
        catchError((error) => {
          this._snackBar.warnSnackBar('Error en la conexión', 'Aceptar');
          console.error('Error en la solicitud getTopServices', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener los Items del CheckList de un Servicio
  getItemsChecklist(idServicio: number): Observable<ItemChecklistDto[]> {
    const params = new HttpParams().set('idServicio', idServicio.toString());

    return this.http.get<ItemChecklistDto[]>(this.getItemsChecklistUrl, { params: params })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud getItemsChecklist', error);
          return throwError(error);
        })
      );
  }

}
