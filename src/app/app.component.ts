import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Sistema de Gestión y Trazabilidad de Servicios';
  islogged = false;

  titleBarLogout: EventEmitter<void> = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) { }

  
  handleLoginSuccess() {
    this.islogged = true; // Actualizar el estado islogged cuando se inicie sesión correctamente

  }

  handleLogout() {
    this.islogged = false;
    this.router.navigate(['/login']);
  }

 }
