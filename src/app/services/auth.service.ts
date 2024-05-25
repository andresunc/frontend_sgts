import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UrlBackend } from '../models/Url';
import { LoginData } from '../models/SupportModels/LoginData';
import { AuthUser } from '../models/SupportModels/AuthUser';
import { Servicios } from '../models/DomainModels/Servicios';
import { Params } from '../models/Params';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private urlBackend = new UrlBackend().getUrlBackend();
  private loginUrl = this.urlBackend + '/auth/login';
  params: Params = new Params();

  private isLoggedIn: boolean = false;

  constructor(private router: Router,
    private http: HttpClient,) {
    this.isLoggedIn = this.isLoggedInUser();
  }

  ngOnInit(): void {
    this.isLoggedInUser();
  }

  login(loginData: LoginData): Observable<AuthUser> {
    return this.http.post<AuthUser>(this.loginUrl, loginData)
      .pipe(
        tap((authUser: AuthUser) => {
          if (authUser && authUser.status) {
            localStorage.setItem('currentUser', JSON.stringify(authUser)); // Guardar en localStorage
            this.router.navigate(['/home']);
          }
        })
      );
  }

  // deslogearse
  logout(): void {
    window.location.reload();
    this.isLoggedIn = false;
    localStorage.removeItem('currentUser'); // Eliminar del localStorage al cerrar sesión
    this.router.navigate(['']);
  }

  // Verificar si esta logeado
  isLoggedInUser(): boolean {
    const currentUserString: string | null = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined) {
      const currentUser: AuthUser = JSON.parse(currentUserString);
      return currentUser.status!;
    } else {
      return false;
    }
  }

  // tomar el token del local storage
  getCurrentToken(): string | null {
    const currentUserString: string | null = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined) {
      const currentUser: AuthUser = JSON.parse(currentUserString);
      return currentUser.jwt!;
    } else {
      return null;
    }
  }

  // tomar el currentUser completo
  getCurrentUser(): AuthUser | null {
    const currentUserString: string | null = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined) {
      const currentUser: AuthUser = JSON.parse(currentUserString);
      return currentUser;
    } else {
      return null;
    }
  }

  // tomar el nombre de usuario del currentUser
  getCurrentName(): string | null {
    const currentUserString: string | null = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined) {
      const currentUser: AuthUser = JSON.parse(currentUserString);
      return currentUser.username!;
    } else {
      return null;
    }
  }

  // Armar el header
  getHeader(): HttpHeaders {

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getCurrentToken()}`
    });
  }

  isAdmin(): boolean {
    const currentUserString: string | null = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined) {
      const currentUser: AuthUser = JSON.parse(currentUserString);
      if (currentUser.roles) {
        // Verifica si el usuario tiene el rol ADMIN y RRHH
        const isAdmin: boolean = currentUser.roles.some(role => role.rol === this.params.ADMIN);
        return isAdmin;
      } else {
        return false; // Si no hay roles, devuelve false
      }
    } else {
      return false; // Si no hay usuario actual, devuelve false
    }
  }

  // tomar el idRecurso del usuario conectado y verificar:
  // Si puede administrar en base a que si es admin o coinciden los idRecursos.
  canEditServicio(serv: Servicios): boolean {
    const currentUserString: string | null = localStorage.getItem('currentUser');
    if (currentUserString !== null && currentUserString !== undefined) {
      const currentUser: AuthUser = JSON.parse(currentUserString);
      let isAdmin: boolean = false;
      let matchIdRol = serv.itemChecklistDto.some(item => item.idRecurso === currentUser.id_recurso);
      if (currentUser.roles) {
        isAdmin = currentUser.roles.some(role => role.rol === this.params.ADMIN);
      }
      return matchIdRol || isAdmin
    } else {
      return false;
    }
  }


}
