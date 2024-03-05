import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DataSharedService } from './services/data-shared.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
 })
export class AppComponent implements OnInit, OnDestroy {

  title = 'Sistema de Gestión y Trazabilidad de Servicios';
  access: boolean = true;
  sidebarOpened: boolean = false; // Cambia a false para ocultar la barra lateral automáticamente
  
  constructor(private authService: AuthService, 
    private dataShared: DataSharedService) { }

  ngOnInit() {
    this.dataShared.getControlAccess().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.controlAccess();
    });
  }

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  controlAccess() {
    this.access = this.authService.isLoggedInUser();
  }

}
