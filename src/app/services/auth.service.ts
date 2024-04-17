import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UrlBackend } from '../models/Url';
import { LoginData } from '../models/SupportModels/LoginData';
import { AuthUser } from '../models/SupportModels/AuthUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  urlBackend = new UrlBackend().getUrlBackend();
  private loginUrl = this.urlBackend + '/auth/login';

  private isLoggedIn: boolean = false;

  constructor(private router: Router, private http: HttpClient) {
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

  // Armar el header
  getHeader(): HttpHeaders {

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getCurrentToken()}`
    });
  }


}
