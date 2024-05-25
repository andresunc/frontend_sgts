import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';
import { Usuario } from 'src/app/models/DomainModels/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

private urlBackend = new UrlBackend().getUrlBackend();
private getUsuarioNotDeleteUrl = this.urlBackend + '/usuario/getAllNotDeleted';
private createUsuarioUrl = this.urlBackend + '/usuario/create';
private updateUsuarioUrl = this.urlBackend + '/usuario/update';
private deleteUsuarioUrl = this.urlBackend + '/usuario/delete/';

constructor(private http: HttpClient, private authService: AuthService) { }

}