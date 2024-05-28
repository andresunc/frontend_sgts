import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TipoServicioService } from 'src/app/services/DomainServices/tipo-servicio.service';
import { TipoServicio } from 'src/app/models/DomainModels/TipoServicio';
import { Observable, map, startWith } from 'rxjs';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { Router } from '@angular/router';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';


@Component({
  selector: 'app-cfg-servicios',
  templateUrl: './cfg-servicios.component.html',
  styleUrls: ['./cfg-servicios.component.css']
})
export class CfgServiciosComponent implements OnInit{
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

myControl = new FormControl();

filteredOptions?: Observable<TipoServicio[]>;
tipoServicios: TipoServicio[] = [];
displayFn!: ((value: any) => string) | null;
disableBtnCrear: boolean = true;
disableBtnEditDelete: boolean = true;

firstFormGroup = new FormGroup({
    Servicio: new FormControl<string>(''),
})
  servicioSeleccionado: any;


constructor(
  private TipoServicioService: TipoServicioService,
  private dataShared: DataSharedService,
  private _snackBar: PopupService,
  private dialog: MatDialog,
  private router: Router,
) {

}

ngOnInit() {

  // Observar los cambios en el input para detectar si se ha borrado el riesgo seleccionado
  this.firstFormGroup.controls.Servicio.valueChanges.subscribe({
    next: (newValue: string | null) => {
      this.disableBtnCrear = true;
      if (newValue && !this.servicioSeleccionado){
          this.disableBtnCrear = false;
      }
       this.servicioSeleccionado = newValue ? this.servicioSeleccionado : undefined;
       this.disableBtnEditDelete = this.servicioSeleccionado ? false : true;
     }
  });

  this.filteredOptions = this.myControl.valueChanges.pipe(
    startWith(''),
    map(value => {
      return value ? this._filter(value) : this.tipoServicios.slice();
    })
  );

}
  private _filter(value: any): any {
    throw new Error('Method not implemented.');
  }




crearTipoServicio() {
throw new Error('Method not implemented.');
}
goInstructor() {
throw new Error('Method not implemented.');
}

seleccionarServicio(arg0: any) {
throw new Error('Method not implemented.');
}

backspace() {
throw new Error('Method not implemented.');
}

equalName: boolean = false;
checkExistName($event: Event) {
throw new Error('Method not implemented.');
}
onInputFocus() {
throw new Error('Method not implemented.');
}

checkDelete() {
  throw new Error('Method not implemented.');
  }  
}