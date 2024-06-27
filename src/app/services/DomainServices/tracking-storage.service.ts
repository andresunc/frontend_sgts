import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';
import { TrackingStorage } from 'src/app/models/DomainModels/TrackingStorage';

@Injectable({
  providedIn: 'root'
})
export class TrackingStorageService {

  private urlBackend = new UrlBackend().getUrlBackend();
  private TrackingStorageByServicioIdUrl = this.urlBackend + '/tracking_storage/by_servicio/';
  private createTrackingStorageUrl = this.urlBackend + '/tracking_storage/new';
  private createMultipleTrackingStoragesUrl = this.urlBackend + '/tracking_storage/multiple';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método GET para obtener tracking storages por id_servicio
  getTrackingStorageByServicio(idServicio: number): Observable<TrackingStorage[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    const url = `${this.TrackingStorageByServicioIdUrl}${idServicio}`;
    return this.http.get<TrackingStorage[]>(url, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud para obtener tracking storages por id_servicio', error);
          return throwError(error);
        })
      );
  }

  // Método POST para crear un nuevo tracking storage
  createTrackingStorage(trackingStorage: TrackingStorage): Observable<TrackingStorage> {
    const headers: HttpHeaders = this.authService.getHeader(); // Obtener headers para la autenticación si es necesario
    return this.http.post<TrackingStorage>(this.createTrackingStorageUrl, trackingStorage, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud para crear un nuevo tracking storage', error);
          return throwError(error);
        })
      );
  }

  // Método POST para crear múltiples tracking storages
  createMultipleTrackingStorages(trackingStorages: TrackingStorage[]): Observable<TrackingStorage[]> {
    const headers: HttpHeaders = this.authService.getHeader(); // Obtener headers para la autenticación si es necesario
    return this.http.post<TrackingStorage[]>(this.createMultipleTrackingStoragesUrl, trackingStorages, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud para crear múltiples tracking storages', error);
          return throwError(error);
        })
      );
  }
}
