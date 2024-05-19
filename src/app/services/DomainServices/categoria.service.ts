import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Categoria } from 'src/app/models/DomainModels/Categoria';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private urlBackend = new UrlBackend().getUrlBackend();
  private getCategorias = this.urlBackend + '/categoria/getAll';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método GET para obtener las categorias que agrupan a los estados
  getAllCategorias(): Observable<Categoria[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<Categoria[]>(this.getCategorias, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud cargar las categorias', error);
          return throwError(error);
        })
      );
  }
}
