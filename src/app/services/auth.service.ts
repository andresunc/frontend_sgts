import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = false;

  constructor(private router: Router) { }

  login(username: string, password: string): Observable<boolean> {
    // Simular lógica de inicio de sesión
    if (username === 'usuario' && password === '1234') {
      this.isLoggedIn = true;
      this.router.navigate(['/home']);
      return of(true); // Simula un inicio de sesión exitoso
    } else {
      this.isLoggedIn = false;
      return of(false); // Simula un inicio de sesión fallido
    }
  }

  logout(): void {
    this.isLoggedIn = false;
    this.router.navigate(['']);
  }

  isLoggedInUser(): boolean {
    return this.isLoggedIn;
  }
  
}
