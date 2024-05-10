import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Dependencia } from 'src/app/models/DomainModels/Dependencia';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DependenciaService {

  private urlBackend = new UrlBackend().getUrlBackend();
  private getDependenciasUrl = this.urlBackend + '/dependencia/getAll';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método GET para obtener todas las dependencias
  getAll(): Observable<Dependencia[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<Dependencia[]>(this.getDependenciasUrl, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al cargar las dependencias', error);
          return throwError(error);
        })
      );
  }

}
