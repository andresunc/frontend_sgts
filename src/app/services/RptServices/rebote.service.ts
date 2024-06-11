import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { RptRebote } from 'src/app/models/RptModels/RptRebote';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReboteService {

  private urlBackend = new UrlBackend().getUrlBackend();
  private getLast60Rebotes = this.urlBackend + '/rebote/last60';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getRebotes(): Observable<RptRebote[]>  {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<RptRebote[]>(this.getLast60Rebotes, {headers})
    .pipe(
      tap((data) => {
        return data;
      }),
      catchError((error) => {
        console.error('Error en la solicitud getRebotes', error);
        return throwError(error);
      })
    );
  }
}
