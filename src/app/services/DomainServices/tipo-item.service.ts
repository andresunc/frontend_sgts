import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { TipoItem } from 'src/app/models/DomainModels/TipoItem';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TipoItemService {

  private urlBackend = new UrlBackend().getUrlBackend();
  private getTipoItemsUrl = this.urlBackend + '/tipoItem/getAll';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getTipoItems(): Observable<TipoItem[]> {

    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<TipoItem[]>(this.getTipoItemsUrl, {headers})
    .pipe(
      catchError((error) => {
        console.error('Error en la solicitud cargar tipos de ítems', error);
        return throwError(error);
      })
    );
  }
  
}
