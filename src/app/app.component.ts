import { Component, OnInit } from '@angular/core';
import { ServicioService } from './services/ServicioService';
import { DataSharedService } from './services/data-shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'frontend_sgts';

  constructor() {  }
}
