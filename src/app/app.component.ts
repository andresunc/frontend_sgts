import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DataSharedService } from './services/data-shared.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PopupService } from './services/SupportServices/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigMenuComponent } from './componentsShared/config-menu/config-menu.component';
import { adminMenuItems, adminMenuTitle } from './componentsAdministrador/administradorcfg/adminMenuItems';
import { SidebarComponent } from './componentsShared/sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Sistema de Gestión y Trazabilidad de Servicios';
  access: boolean = false;
  //sidebarOpened: boolean = false; // Cambia a false para ocultar la barra lateral automáticamente

  constructor(
    private authService: AuthService,
    private dataShared: DataSharedService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: PopupService,) {
    this.access = this.authService.isLoggedInUser();
  }

  ngOnInit() {
    this.dataShared.getControlAccess().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.controlAccess();
    });
  }

  controlAccess() {
    this.access = this.authService.isLoggedInUser();
  }

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openCfgList() {
    if (this.authService.isAdmin()) {
      this.dialog.open(ConfigMenuComponent, {
        data: {
          menuTitle: adminMenuTitle,
          menuItems: adminMenuItems
        }
      });
      this.router.navigate(['administrador']);
    } else {
      this._snackBar.warnSnackBar('Permisos insuficientes');
    }
  }

  

  goNuevo() {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/nuevo']);
    } else {
      this._snackBar.warnSnackBar('Permisos insuficientes');
    }
  }
}
