import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';


// Módulos compartidos
import { MaterialModule } from './componentsShared/material/material.module';
import { TitleBarModule } from './componentsShared/title-bar/title-bar.module';

// Componentes pertenecientes a éste módulo
import { SidebarComponent } from 'src/app/componentsShared/sidebar/sidebar.component';
import { VerServiciosComponent } from './componentsServicios/ver-servicios/ver-servicios.component';
import { NewServicioComponent } from './componentsServicios/new-servicio/new-servicio.component';
import { PrintServicioComponent } from './componentsServicios/print-servicio/print-servicio.component';
import { SpinnerComponent } from './componentsShared/spinner/spinner/spinner.component';



@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    VerServiciosComponent,
    NewServicioComponent,
    PrintServicioComponent,
    SpinnerComponent,
    LoginComponent,
    
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule, // Uso el módulo de material compartido.
    TitleBarModule, // Uso el módulo de titlebar compartido.
    HttpClientModule, // Uso Módulo para peticiones HTTP
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
