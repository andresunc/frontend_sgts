import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Módulos compartidos
import { MaterialModule } from './componentsShared/material/material.module';

// Componentes pertenecientes a éste módulo
import { SidebarComponent } from 'src/app/componentsShared/sidebar/sidebar.component';
import { VerServiciosComponent } from './componentsServicios/ver-servicios/ver-servicios.component';
import { NewServicioComponent } from './componentsServicios/new-servicio/new-servicio.component';
import { TitlebarComponent } from './componentsShared/titlebar/titlebar.component';
import { ReportesComponent } from './componentsReportes/reportes/reportes.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    VerServiciosComponent,
    NewServicioComponent,
    TitlebarComponent,
    ReportesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule, // Uso el módulo de material compartido.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
