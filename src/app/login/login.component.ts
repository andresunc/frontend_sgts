import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DataSharedService } from '../services/data-shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;

  errorMessage: string = '';

  constructor(private authService: AuthService, private dataShared: DataSharedService) {}

  login() {
    console.log(this.username);
    console.log(this.password);
    if (this.username === '' || this.password === '') return;
    // Llama al método login de AuthService
    this.authService.login(this.username, this.password).subscribe(
      (loginSuccessful) => {
        if (loginSuccessful) {
          this.dataShared.triggerControlAccess();
        } else {
          this.handleLoginError('Credenciales incorrectas o inexistentes');
          console.log('Inicio de sesión fallido');
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
        this.handleLoginError('Hubo un error durante el inicio de sesión. Por favor, intenta de nuevo más tarde');
      }
    );
  }

  private handleLoginError(message: string) {
    this.errorMessage = message;
     setTimeout(() => {
        this.errorMessage = '';
        }, 3000);
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Debes completar el campo';
    }

    return this.email.hasError('email') ? 'No es un usuario valido' : '';
  }
  
}

