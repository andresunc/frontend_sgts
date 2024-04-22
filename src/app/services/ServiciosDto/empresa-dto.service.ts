import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { EmpresaDto } from 'src/app/models/ModelsDto/EmpresaDto';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaDtoService {

  urlBackend = new UrlBackend().getUrlBackend();
  private url = this.urlBackend + '/empresaDto/getEmpresas';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getEmpresas(): Observable<EmpresaDto[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<EmpresaDto[]>(this.url, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud getRecursos', error);
          return throwError(error);
        })
      );
  }
}
