import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


// Módulos compartidos
import { MaterialModule } from './componentsShared/material/material.module';
import { TitleBarModule } from './componentsShared/title-bar/title-bar.module';

// Componentes pertenecientes a éste módulo
import { SidebarComponent } from 'src/app/componentsShared/sidebar/sidebar.component';
import { VerServiciosComponent } from './componentsServicios/ver-servicios/ver-servicios.component';
import { PrintServicioComponent } from './componentsServicios/print-servicio/print-servicio.component';
import { SpinnerComponent } from './componentsShared/spinner/spinner/spinner.component';
import { CustomSnackbarComponent } from './componentsShared/popups/custom-snackbar/custom-snackbar.component';
import { AddItemComponent } from './componentsShared/add-item/add-item.component';
import { EditorComponent } from './componentsServicios/print-servicio/editor/editor.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    VerServiciosComponent,
    PrintServicioComponent,
    SpinnerComponent,
    LoginComponent,
    CustomSnackbarComponent,
    AddItemComponent,
    EditorComponent,
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
