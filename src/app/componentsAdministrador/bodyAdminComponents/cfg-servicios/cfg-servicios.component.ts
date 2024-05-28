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
initialTipoServicios: TipoServicio[] = [];
displayFn!: ((value: any) => string) | null;
disableBtnCrear: boolean = true;
disableBtnEditDelete: boolean = true;

firstFormGroup = new FormGroup({
    Servicio: new FormControl<string>(''),
})



constructor(
  private TipoServicioService: TipoServicioService,
  private dataShared: DataSharedService,
  private _snackBar: PopupService,
  private dialog: MatDialog,
  private router: Router,
) {

}

ngOnInit() {

  this.obtenerTipoServicio();

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
  private _filter(value: string): TipoServicio[]{
    const filterValue = value.toLowerCase() || '';
    return this.tipoServicios.filter(se => se.tipoServicio?.toLowerCase().startsWith(filterValue));
  }


obtenerTipoServicio() {

  this.TipoServicioService.getTipoServicesNotDeleted().subscribe((data: TipoServicio[]) => {
  this.tipoServicios = data;
  this.initialTipoServicios = JSON.parse(JSON.stringify(data));
   console.log("Tipo de Servicios obtenidos:", this.tipoServicios);
  });
 }


servicioSeleccionado: TipoServicio | undefined;
seleccionarServicio(value: any) {
  this.servicioSeleccionado = this.tipoServicios.find(se => se.tipoServicio === value);

  if (this.servicioSeleccionado) {
    this.disableBtnEditDelete = false;
    this.disableBtnCrear = true;
    // Asignar el objeto tipo servicio directamente
    this.firstFormGroup.patchValue({
      Servicio: this.servicioSeleccionado.tipoServicio
    });
  } else {
    console.error('No se encontró el Tipo de Servicio');
  }
  }
    

crearTipoServicio() {
  const tipoServicioName = this.firstFormGroup.controls.Servicio.value;
  if (tipoServicioName === '' || tipoServicioName === null || this.equalName) return;


  if (!tipoServicioName && this.servicioSeleccionado) {
    // Restablecer la variable del tipo de servicio seleccionado y deshabilitar la modificación
    this.servicioSeleccionado = undefined;
    this.disableBtnEditDelete = false;
    // Limpiar el input
    this.firstFormGroup.controls.Servicio.setValue('');
    return;
  }

  this.dataShared.mostrarSpinner();

  const servicio: TipoServicio = new TipoServicio();
  tipoServicioName ? servicio.tipoServicio = tipoServicioName : undefined;

  this.TipoServicioService.createTipoServices(servicio)
    .subscribe(
      (data) => {
        console.log('Tipo de Servicio creado: ', data);

        this._snackBar.okSnackBar('El Tipo de Servicio se creó correctamente');
        // Recargar el componente navegando a la misma ruta
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['administrador/servicios']);
        });

      },
      (error) => {
        this._snackBar.warnSnackBar('Error al crear el tipo de servicio');
        console.error('Error al crear el tipo de servicio:', error);
      }
    )
    .add(() => {
      this.dataShared.ocultarSpinner();
    });
}

@ViewChild('tipoServicioHelp') tipoServicioHelpRef!: TemplateRef<HTMLElement>;
goInstructor() {
  const title = 'Como administrar un Tipo de Servicio';
  this.dataShared.openInstructor(this.tipoServicioHelpRef, title);
}


backspace() {
  console.log('backspace works');
    this.disableBtnEditDelete = true;
    this.firstFormGroup.reset();
}

equalName: boolean = false;
checkExistName(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  const inputData = inputElement.value.trim() || '';
  this.equalName = this.tipoServicios.some(se => se.tipoServicio?.toLowerCase() === inputData.toLowerCase());
  console.log(this.equalName);

  if (this.equalName) {
    // tipo de servicio existente
    this.firstFormGroup.get('Servicio')?.setErrors({ duplicated: true});
    this.disableBtnEditDelete = true;
  }
  if (inputData.length >= 45){
    this.firstFormGroup.get('Servicio')?.setErrors({ maxlength: true});
  }
}

onInputFocus() {
  this.myControl.setValue(''); 
  this.matAutocomplete.options.forEach(option => option.deselect());

}

tipoServicioDelete() {
  if (!this.servicioSeleccionado) {
    console.error('No se ha seleccionado ningún servicio para eliminar.');
    return;
  }

  const idTipoServicioEliminar = this.servicioSeleccionado.idTipoServicio;

  this.dataShared.mostrarSpinner();
  this.disableBtnEditDelete = true;

  this.TipoServicioService.deleteTipoServices(idTipoServicioEliminar!)
    .subscribe(
      () => {
        console.log('Tipo de Servicio eliminado correctamente');

        this._snackBar.okSnackBar('El Tipo de Servicio se eliminó correctamente');


      },
      () => {
        this._snackBar.warnSnackBar('Error al eliminar el Tipo de Servicio');
      }
    )
    .add(() => {
      this.dataShared.ocultarSpinner();
      // Recargar el componente navegando a la misma ruta
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['administrador/servicios']);
      });

    });
}

checkDelete() {
  const dialogRef = this.dialog.open(DeletePopupComponent, {
    data: { message: `¿Eliminar Tipo de Servicio ${this.servicioSeleccionado?.tipoServicio}?` }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.tipoServicioDelete();
    } else {
      console.log('Se canceló la eliminación');
    }
  });
  }  

  formularioTieneErrores(): boolean {
    this.firstFormGroup.markAllAsTouched();
    const hayErrores = this.firstFormGroup.invalid || this.firstFormGroup.pending;
    console.log('Datos erroneos en el formulario: ', hayErrores)
    return hayErrores
  }

}