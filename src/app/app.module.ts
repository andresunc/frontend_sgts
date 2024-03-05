import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';



// Módulos compartidos
import { MaterialModule } from './componentsShared/material/material.module';
import { TitleBarModule } from './componentsShared/title-bar/title-bar.module';

// Componentes pertenecientes a éste módulo
import { SidebarComponent } from 'src/app/componentsShared/sidebar/sidebar.component';
import { VerServiciosComponent } from './componentsServicios/ver-servicios/ver-servicios.component';
import { PrintServicioComponent } from './componentsServicios/print-servicio/print-servicio.component';
import { SpinnerComponent } from './componentsShared/spinner/spinner/spinner.component';
import { CustomSnackbarComponent } from './componentsShared/popups/custom-snackbar/custom-snackbar.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    VerServiciosComponent,
    PrintServicioComponent,
    SpinnerComponent,
    LoginComponent,
    CustomSnackbarComponent,
    
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
    MatSidenavModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatButtonModule,
    MatDividerModule, 
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
