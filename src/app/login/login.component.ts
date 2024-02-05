import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  
  email = new FormControl('', [Validators.required, Validators.email]);


  login() {
    // Aquí puedes implementar la lógica de autenticación
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Debes completar el campo';
    }

    return this.email.hasError('email') ? 'No es un usuario valido' : '';
  }
  hide = true;
}

