import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Sistema de Gestión y Trazabilidad de Servicios';
  islogged = false;

  constructor() { }
  
}