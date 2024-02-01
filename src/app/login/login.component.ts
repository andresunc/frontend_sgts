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
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  hide = true;
}

