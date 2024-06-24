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
  private changePasswordUrl = this.urlBackend + '/usuario/changepassword/';
  private resetPasswordUrl = this.urlBackend + '/usuario/resetpassword/';
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

  modificarUsuario(usuarioActualizado: UsuarioDto): Observable<any> {
    const headers: HttpHeaders = this.authService.getHeader();
    // Crear un objeto de solicitud con la estructura esperada por el endpoint
    return this.http.put<any>(this.updateUsuarioUrl, usuarioActualizado, { headers });
  }

  changePassword(id: number, passwordObject: { password: string }): Observable<any> {
    const headers: HttpHeaders = this.authService.getHeader();
    const url = this.changePasswordUrl + id;
    return this.http.put<any>(url, passwordObject, { headers });
  }

  resetPassword(id: number, passwordObject: { password: string }): Observable<any> {
    const headers: HttpHeaders = this.authService.getHeader();
    const url = this.resetPasswordUrl + id;
    return this.http.put<any>(url, passwordObject, { headers });
  }

  getUsersDto(): Observable<UsuarioDto[]> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.get<UsuarioDto[]>(this.getUsersDtoUrl, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud cargar usuarios dto', error);
          return throwError(error);
        })
      );
  }

   // deleteLogico Tipo de Servicio por ID
   public delete(id: number): Observable<void> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.delete<void>(this.deleteUsuarioUrl + id, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar el usuario', error);
          return throwError(error);
        })
      );
  }

}