import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = false;

  constructor() { }

  login(username: string, password: string): Observable<boolean> {
    // Simular lógica de inicio de sesión
    if (username === 'jniferalvarez@gmail.com' && password === 'Contraseña1234') {
      this.isLoggedIn = true;
      return of(true); // Simula un inicio de sesión exitoso
    } else {
      this.isLoggedIn = false;
      return of(false); // Simula un inicio de sesión fallido
    }
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  isLoggedInUser(): boolean {
    return this.isLoggedIn;
  }
  
}
