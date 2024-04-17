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
    private _snackBar: PopupService) { }

  saving: boolean = false;
  login() {

    const loginData: LoginData = new LoginData();
    loginData.username = this.username;
    loginData.password = this.password;

    if (loginData.username == "" || loginData.password == "") return;

    // Deshabilitar el boton del login Llama al método AuthService.login()
    this.saving = true;
    this.authService.login(loginData).subscribe(
      (authUser: AuthUser) => {
        console.log('Datos del login: ', authUser)
        this.dataShared.triggerControlAccess();
        this.saving = false;
      },
      (error) => {
        this.saving = false;
        if (error.status === 403) {
          console.error('Credenciales incorrectas o inexistentes:', error);
          this.handleLoginError('Credenciales incorrectas o inexistentes');
        } else {
          console.error('Error en el inicio de sesión:', error);
          this._snackBar.warnSnackBar('Error en la conexión', 'Aceptar');
        }
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

