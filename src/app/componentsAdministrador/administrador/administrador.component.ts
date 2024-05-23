import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';



@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {

  title: string = "Configuración General";
  constructor(public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.updateTitle();
    });
  }

  updateTitle() {
    const route = this.activatedRoute.firstChild;
    if (route) {
      const routePath = route.snapshot.routeConfig?.path;
      switch (routePath) {
        case 'clientes':
          this.title = 'Configuración Clientes';
          break;
        case 'servicios':
          this.title = 'Configuración Servicios';
          break;
        case 'rubros':
          this.title = 'Configuración Rubros';
          break;
        case 'riesgos':
          this.title = 'Configuración Riesgos';
          break;
        case 'estados':
          this.title = 'Configuración Estados';
          break;
        case 'items':
          this.title = 'Configuración Items';
          break;
        case 'usuarios':
          this.title = 'Configuración Usuarios';
          break;
        default:
          this.title = 'Configuración General';
          break;
      }
    }
  }


  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
}
