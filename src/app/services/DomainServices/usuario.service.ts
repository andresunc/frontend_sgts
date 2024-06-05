import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { UsuarioDto } from 'src/app/models/ModelsDto/UsuarioDto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlBackend = new UrlBackend().getUrlBackend();
  private getUsuarioNotDeleteUrl = this.urlBackend + '/usuario/getAllNotDeleted';
  private createUserUrl = this.urlBackend + '/usuario/registro';
  private updateUsuarioUrl = this.urlBackend + '/usuario/update';
  private deleteUsuarioUrl = this.urlBackend + '/usuario/delete/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  createUser(newUser: UsuarioDto): Observable<UsuarioDto> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<UsuarioDto>(this.createUserUrl, newUser, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al agregar un nuevo usuario', error);
          return throwError(error);
        })
      );
  }

}