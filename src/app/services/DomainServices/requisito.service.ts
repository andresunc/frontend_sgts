import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Requisito } from 'src/app/models/DomainModels/Requisito';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequisitoService {

  private urlBackend = new UrlBackend().getUrlBackend();
  private getRequisitosUrl = this.urlBackend + '/requisito/getAll';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método GET para obtener todas los requisitos
  getAll(): Observable<Requisito[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<Requisito[]>(this.getRequisitosUrl, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al cargar los requisitos', error);
          return throwError(error);
        })
      );
  }
}
