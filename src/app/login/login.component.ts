import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DataSharedService } from '../services/data-shared.service';
import { LoginData } from '../models/SupportModels/LoginData';
import { AuthUser } from '../models/SupportModels/AuthUser';
import { PopupService } from '../services/SupportServices/popup.service';

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

  constructor(private authService: AuthService,
    private dataShared: DataSharedService,
    private _snackBar: PopupService) {}

  login() {

    this.dataShared.mostrarSpinner();

    const loginData: LoginData = new LoginData();
    loginData.username = this.username;
    loginData.password = this.password;

    if (!loginData) return;
    // Llama al método login de AuthService
    this.authService.login(loginData).subscribe(
      (authUser: AuthUser) => {
        if (authUser.status) {
          console.log('Datos del login: ', authUser)
          this.dataShared.triggerControlAccess();
        } else {
          this.handleLoginError('Credenciales incorrectas o inexistentes');
          console.log('Inicio de sesión fallido');
        }
      },
      (error) => {
        if (error.status === 403) {
          console.error('Credenciales incorrectas o inexistentes:', error);
          this.handleLoginError('Credenciales incorrectas o inexistentes');
        } else {
          console.error('Error en el inicio de sesión:', error);
          this._snackBar.warnSnackBar('Error en la conexión', 'Aceptar');
        }
      }
    );

    this.dataShared.ocultarSpinner();
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

