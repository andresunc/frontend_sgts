import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RiesgoService } from 'src/app/services/DomainServices/riesgo.service';
import { Riesgo } from 'src/app/models/DomainModels/Riesgo';
import { Observable, map, startWith } from 'rxjs';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { Router } from '@angular/router';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-cfg-riesgos',
  templateUrl: './cfg-riesgos.component.html',
  styleUrls: ['./cfg-riesgos.component.css']
})
export class CfgRiesgosComponent implements OnInit {
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  myControl = new FormControl();
  riesgos: Riesgo[] = [];
  initialRiesgos: Riesgo[] = [];
  filteredOptions?: Observable<Riesgo[]>;
  displayFn!: ((value: any) => string) | null;
  disableBtnCrear: boolean = true;
  disableBtnEditDelete: boolean = true;

  

  firstFormGroup = new FormGroup({
    Riesgo: new FormControl<string>(''),

  })

  constructor(
    private riesgoService: RiesgoService,
    private dataShared: DataSharedService,
    private _snackBar: PopupService,
    private dialog: MatDialog,
    private router: Router,
  ) {

  }

  ngOnInit() {

    this.obtenerRiesgo();

    // Observar los cambios en el input para detectar si se ha borrado el riesgo seleccionado
    this.firstFormGroup.controls.Riesgo.valueChanges.subscribe({
      next: (newValue: string | null) => {
        console.log("valor newValue", newValue)
        this.disableBtnCrear = true;
        if (newValue && !this.riesgoSeleccionado){
          // habilitar boton crear solo para nuevos valores sin seleccion previa de riesgo
          this.disableBtnCrear = false;
        }
        // cuando no tengamos valores de riesgo, eliminar posible seleccion
        this.riesgoSeleccionado = newValue ? this.riesgoSeleccionado : undefined;
        // si hay riesgo seleccionado, habilito su modificacion
        this.disableBtnEditDelete = this.riesgoSeleccionado ? false : true;
       }
    });


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return value ? this._filter(value) : this.riesgos.slice();
      })
    );
  }

  obtenerRiesgo() {

    this.riesgoService.getAllRiesgo().subscribe((data: Riesgo[]) => {
      this.riesgos = data;
      this.initialRiesgos = JSON.parse(JSON.stringify(data));
      console.log("Riesgos obtenidos:", this.riesgos);
    });
  }

  riesgoSeleccionado: Riesgo | undefined;
  seleccionarRiesgo(value: any) {
    this.riesgoSeleccionado = this.riesgos.find(ri => ri.riesgo === value);

    if (this.riesgoSeleccionado) {
      this.disableBtnEditDelete = false;
      this.disableBtnCrear = true;
      // Asignar el objeto Riesgo directamente
      this.firstFormGroup.patchValue({
        Riesgo: this.riesgoSeleccionado.riesgo
      });
    } else {
      console.error('No se encontró el riesgo');
    }
  }

  onInputFocus() {
    this.myControl.setValue(''); // Limpiar el valor del control para que se dispare el evento de filtro.
    this.matAutocomplete.options.forEach(option => option.deselect());

  }

  @ViewChild('riesgoHelp') riesgoHelpRef!: TemplateRef<HTMLElement>;
  goInstructor() {
    const title = 'Como administrar un riesgo';
    this.dataShared.openInstructor(this.riesgoHelpRef, title);
  }

  private _filter(value: string): Riesgo[] {
    const filterValue = value.toLowerCase() || '';
    return this.riesgos.filter(riesgo => riesgo.riesgo?.toLowerCase().startsWith(filterValue));
  }


  crearRiesgo() {

    const riesgoName = this.firstFormGroup.controls.Riesgo.value;
    if (riesgoName === '' || riesgoName === null || this.equalName) return;


    if (!riesgoName && this.riesgoSeleccionado) {
      // Restablecer la variable del riesgo seleccionado y deshabilitar la modificación
      this.riesgoSeleccionado = undefined;
      this.disableBtnEditDelete = false;
      // Limpiar el input
      this.firstFormGroup.controls.Riesgo.setValue('');
      return;
    }

    this.dataShared.mostrarSpinner();

    const riesgo: Riesgo = new Riesgo();
    riesgoName ? riesgo.riesgo = riesgoName : undefined;

    this.riesgoService.createRiesgo(riesgo)
      .subscribe(
        (data) => {
          console.log('Riesgo creado: ', data);

          this._snackBar.okSnackBar('El riesgo se creó correctamente');
          // Recargar el componente navegando a la misma ruta
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['administrador/riesgos']);
          });

        },
        (error) => {
          this._snackBar.warnSnackBar('Error al crear el riesgo');
          console.error('Error al crear el riesgo:', error);
        }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
      });
  }

  modificarRiesgo() {

    if (!this.riesgoSeleccionado) {
      console.error('No se ha seleccionado ningún riesgo para modificar.');
      return;
    }

    const nuevoNombreRiesgo = this.firstFormGroup.controls.Riesgo.value;
    if (!nuevoNombreRiesgo || nuevoNombreRiesgo.trim() === '') {
      console.error('El nuevo nombre del riesgo no puede estar vacío.');
      return;
    }

    const idRiesgoModificar = this.riesgoSeleccionado.idRiesgo;
    const riesgoModificado: Riesgo = { ...this.riesgoSeleccionado, riesgo: nuevoNombreRiesgo };

    const riesgoInitial = this.initialRiesgos.find(ri => ri.idRiesgo === idRiesgoModificar);

    const sameRiesgo = JSON.stringify(riesgoInitial) === JSON.stringify(riesgoModificado);

    console.log(sameRiesgo)

    if (sameRiesgo) {
      console.log('No hay cambios que hacer :/')
      this._snackBar.warnSnackBar('No hay cambios que hacer', 'Ok');
      return;
    }

    this.dataShared.mostrarSpinner();
    this.disableBtnEditDelete = true;
    this.disableBtnCrear = false;

    this.riesgoService.updateRiesgo(idRiesgoModificar!, riesgoModificado)
      .subscribe(
        (data) => {
          console.log('Riesgo modificado: ', data);

          this._snackBar.okSnackBar('El riesgo se modificó correctamente');
          // Recargar el componente navegando a la misma ruta
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['administrador/riesgos']);
          });

        },
        () => {
          this._snackBar.warnSnackBar('Error al modificar el riesgo');
        }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
      });

  }

  checkDelete(): void {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: { message: `¿Eliminar riesgo ${this.riesgoSeleccionado?.riesgo}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.riesgoDelete();
      } else {
        console.log('Se canceló la eliminación');
      }
    });
  }


  riesgoDelete() {
    if (!this.riesgoSeleccionado) {
      console.error('No se ha seleccionado ningún riesgo para eliminar.');
      return;
    }

    const idRiesgoEliminar = this.riesgoSeleccionado.idRiesgo;

    this.dataShared.mostrarSpinner();
    this.disableBtnEditDelete = true;

    this.riesgoService.delete(idRiesgoEliminar!)
      .subscribe(
        () => {
          console.log('Riesgo eliminado correctamente');

          this._snackBar.okSnackBar('El riesgo se eliminó correctamente');


        },
        () => {
          this._snackBar.warnSnackBar('Error al eliminar el riesgo');
        }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
        // Recargar el componente navegando a la misma ruta
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['administrador/riesgos']);
        });

      });
  }

  formularioTieneErrores(): boolean {
    this.firstFormGroup.markAllAsTouched();
    const hayErrores = this.firstFormGroup.invalid || this.firstFormGroup.pending;
    console.log('Datos erroneos en el formulario: ', hayErrores)
    return hayErrores
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
    this.equalName = this.riesgos.some(ri => ri.riesgo?.toLowerCase() === inputData.toLowerCase());
    console.log(this.equalName);

    if (this.equalName) {
      // riesgo existente
      this.firstFormGroup.get('Riesgo')?.setErrors({ duplicated: true});
      this.disableBtnEditDelete = true;
    }
    if (inputData.length >= 45){
      this.firstFormGroup.get('Riesgo')?.setErrors({ maxlength: true});
    }
  }

}