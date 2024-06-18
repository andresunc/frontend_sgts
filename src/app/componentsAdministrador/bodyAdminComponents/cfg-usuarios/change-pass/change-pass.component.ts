import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewPassword } from 'src/app/models/ModelsDto/NewPassword';
import { UsuarioDto } from 'src/app/models/ModelsDto/UsuarioDto';
import { AuthUser } from 'src/app/models/SupportModels/AuthUser';
import { LoginData } from 'src/app/models/SupportModels/LoginData';
import { UsuarioService } from 'src/app/services/DomainServices/usuario.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit {

  user: UsuarioDto;
  userName: string | null | undefined;

  isOldPasswordValid: boolean = false;
  selectedIndex: number = 0;

  changePass = new FormGroup({
    oldPassword: new FormControl<string>('', [Validators.required, Validators.maxLength(10)]),
    newPassword: new FormControl<string>('', [Validators.required, Validators.maxLength(10)]),
    passwordRepit: new FormControl<string>('', [Validators.required, Validators.maxLength(10)]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<ChangePassComponent>,
    private _snackBar: PopupService,) {
    this.user = data;
    this.userName = this.user.username;
  }

  ngOnInit(): void {
    this.setParams();
  }

  setParams() { }

  btnCambiar: boolean = false;
  validOldPassword() {
    const userLogin: LoginData = new LoginData();
    const username = this.userName;
    const oldPassword = this.changePass.get('oldPassword')?.value;

    userLogin.username = username ?? '';
    userLogin.password = oldPassword ?? '';

    this.authService.checkPass(userLogin).subscribe(
      (response: AuthUser) => {
        if (response.status) {
          console.log('Validado OK', response.status);
          this.isOldPasswordValid = true;
          this.btnCambiar = true;
          this.selectedIndex = 1;  // Cambia al siguiente tab
        }
      },
      error => {
        this._snackBar.errorSnackBar('La contraseña no coincide');
        console.error('Error durante la verificación de password:', error);
      }
    );
  }

  setNewPassword() {
    const id = this.user.idUsuario ?? 0;
    const newPassword = this.changePass.get('newPassword')?.value ?? '';
    const passwordObject = { password: newPassword };

    this.usuarioService.setNewPassword(id, passwordObject)
      .subscribe(
        (data) => {
          // Verifica si el mensaje es "OK"
          this._snackBar.okSnackBar('Contraseña cambiada');
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error al cambiar el password:', error);
        }
      );
  }


}