import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from "src/app/componentsShared/material/material.module";
import { TitleBarModule } from "src/app/componentsShared/title-bar/title-bar.module";

import { NewServicioComponent } from "../new-servicio.component";
import { NewServicioRoutingModule } from "./new-servicio-routing.modules";


@NgModule({
    declarations: [
        NewServicioComponent,
    ],
    imports: [
        NewServicioRoutingModule, // Uso los componentes declarados en las rutas.
        CommonModule,
        TitleBarModule, // Uso el módulo de titlebar compartido.
        MaterialModule, // Uso el módulo de material compartido.
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class NewServicioModule { }