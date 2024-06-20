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
  private getUsersDtoUrl = this.urlBackend + '/usuario/getUsersDto';
  private createUserUrl = this.urlBackend + '/usuario/registro';
  private changePasswordUrl = this.urlBackend +  '/usuario/changepassword/';
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

  changePassword(id: number, passwordObject: { password: string }): Observable<any> {
    const headers: HttpHeaders = this.authService.getHeader();
    const url = this.changePasswordUrl + id;
    return this.http.put<any>(url, passwordObject, { headers });
  }

  getUsersDto(): Observable<UsuarioDto[]> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<UsuarioDto[]>(this.getUsersDtoUrl, {headers})
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud cargar usuarios dto', error);
          return throwError(error);
        })
      );
  }

}