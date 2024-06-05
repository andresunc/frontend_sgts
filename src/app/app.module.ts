import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule } from '@angular/material/core';


// Módulos compartidos
import { MaterialModule } from './componentsShared/material/material.module';
import { TitleBarModule } from './componentsShared/title-bar/title-bar.module';

// Componentes pertenecientes a éste módulo
import { SidebarComponent } from 'src/app/componentsShared/sidebar/sidebar.component';
import { PrintServicioComponent } from './componentsServicios/print-servicio/print-servicio.component';
import { SpinnerComponent } from './componentsShared/spinner/spinner/spinner.component';
import { CustomSnackbarComponent } from './componentsShared/popups/custom-snackbar/custom-snackbar.component';
import { AddItemComponent } from './componentsServicios/print-servicio/add-item/add-item.component';
import { ChecklistComponent } from './componentsServicios/print-servicio/checklist/checklist.component';
import { DeletePopupComponent } from './componentsShared/delete-popup/delete-popup.component';
import { ErrorInterceptor } from './ErrorInterceptor/error.interceptor';
import { InstructorComponent } from './componentsShared/instructor/instructor.component';
import { OrderStatusComponent } from './componentsAdministrador/bodyAdminComponents/cfg-estados/order-status/order-status.component';

import { VerServiciosComponent } from './componentsServicios/ver-servicios/ver-servicios.component';
import { CalcularAvancePipe } from './componentsShared/pipes/calcularAvance';
import { HayNotificadosPipe } from './componentsShared/pipes/hayNotificados';
import { DiferenciaFechasPipe } from './componentsShared/pipes/diferenciaFechas';
import { Params } from './models/Params';

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MMM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

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
    ChecklistComponent,
    DeletePopupComponent,
    InstructorComponent,
    OrderStatusComponent,
    DiferenciaFechasPipe,
    CalcularAvancePipe,
    HayNotificadosPipe,
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
  exports: [
    DiferenciaFechasPipe,
    CalcularAvancePipe,
    HayNotificadosPipe,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    CalcularAvancePipe,
    Params,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
