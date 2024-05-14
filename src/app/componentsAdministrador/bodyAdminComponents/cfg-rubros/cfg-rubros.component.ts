import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RubroService } from 'src/app/services/DomainServices/rubro.service';
import { Rubro } from 'src/app/models/DomainModels/Rubro';
import { Observable, map, startWith } from 'rxjs';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { Router } from '@angular/router';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';


@Component({
  selector: 'app-cfg-rubros',
  templateUrl: './cfg-rubros.component.html',
  styleUrls: ['./cfg-rubros.component.css']
})
export class CfgRubrosComponent implements OnInit {
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  myControl = new FormControl();
  rubros: Rubro[] = [];
  filteredOptions?: Observable<Rubro[]>;
  displayFn!: ((value: any) => string) | null;
  modificarEliminarHabilitado: boolean = false;

  firstFormGroup = new FormGroup({
    BuscarRubro: new FormControl<string>(''),
    Rubro: new FormControl<string>(''),

  })

  constructor(
    private rubroService: RubroService,
    private dataShared: DataSharedService,
    private _snackBar: PopupService,
    private dialog: MatDialog,
    private router: Router,
  ) {

  }

  ngOnInit() {

    this.obtenerRubro();

    // Observar los cambios en el input para detectar si se ha borrado el rubro seleccionado
    this.firstFormGroup.controls.Rubro.valueChanges.subscribe({
      next: (newValue: string | null) => {
        if (!newValue && this.rubroSeleccionado) {
          // Restablecer la variable del rubro seleccionado y deshabilitar la modificación
          this.rubroSeleccionado = undefined;
          this.modificarEliminarHabilitado = false;
         
        }
      }
    });

   
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return value ? this._filter(value) : this.rubros.slice();
      })
    );
  }

  obtenerRubro() {

    this.rubroService.getAllRubro().subscribe((data: Rubro[]) => {
      this.rubros = data;
      console.log("Rubros obtenidos:", this.rubros);
    });
  }

  rubroSeleccionado: Rubro | undefined;
  seleccionarRubro(value: any) {
    this.rubroSeleccionado = this.rubros.find(ru => ru.rubro === value);
    
    if (this.rubroSeleccionado) {
      this.modificarEliminarHabilitado = true;
      // Asignar el objeto Rubro directamente
      this.firstFormGroup.patchValue({
        Rubro: this.rubroSeleccionado.rubro
      });
    } else {
      console.error('No se encontró el rubro');
    }
  }

  onInputFocus() {
    this.myControl.setValue(''); // Limpiar el valor del control para que se dispare el evento de filtro.
    this.matAutocomplete.options.forEach(option => option.deselect());
    
  }

  private _filter(value: string): Rubro[] {
    const filterValue = value.toLowerCase();
    return this.rubros.filter(rubro => rubro.rubro?.toLowerCase().startsWith(filterValue));
  }

  
  crearRubro() {

    const rubroName = this.firstFormGroup.controls.Rubro.value;
    if (rubroName === '' || rubroName === null) return;


    if (!rubroName && this.rubroSeleccionado) {
      // Restablecer la variable del rubro seleccionado y deshabilitar la modificación
      this.rubroSeleccionado = undefined;
      this.modificarEliminarHabilitado = false;
      // Limpiar el input
      this.firstFormGroup.controls.Rubro.setValue('');
      return;
    }

    this.dataShared.mostrarSpinner();

    const rubro: Rubro = new Rubro();
    rubroName ? rubro.rubro = rubroName : undefined;

    this.rubroService.createRubro(rubro)
      .subscribe(
        (data) => {
          console.log('Rubro creado: ', data);

          this._snackBar.okSnackBar('El rubro se creó correctamente');
          // Recargar el componente navegando a la misma ruta
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['administrador/rubros']);
          });

        },
        (error) => {
          this._snackBar.warnSnackBar('Error al crear el rubro');
          console.error('Error al crear el rubro:', error);
        }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
      });
  }

  modificarRubro() {

    if (!this.rubroSeleccionado) {
      console.error('No se ha seleccionado ningún rubro para modificar.');
      return;
    }
  
    const nuevoNombreRubro = this.firstFormGroup.controls.Rubro.value;
    if (!nuevoNombreRubro || nuevoNombreRubro.trim() === '') {
      console.error('El nuevo nombre del rubro no puede estar vacío.');
      return;
    }
  
    const idRubroModificar = this.rubroSeleccionado.idRubro;
    const rubroModificado: Rubro = { ...this.rubroSeleccionado, rubro: nuevoNombreRubro };
  
    this.dataShared.mostrarSpinner();
    this.modificarEliminarHabilitado = true;
  
    this.rubroService.updateRubro(idRubroModificar!, rubroModificado)
      .subscribe(
        (data) => {
          console.log('Rubro modificado: ', data);
  
          this._snackBar.okSnackBar('El rubro se modificó correctamente');
          // Recargar el componente navegando a la misma ruta
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['administrador/rubros']);
          });
  
        },
        () => {
          this._snackBar.warnSnackBar('Error al modificar el rubro');
         }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
      });

  }

  checkDelete(): void {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: { message: `¿Eliminar rubro ${this.rubroSeleccionado?.rubro}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rubroDelete();
      } else {
        console.log('Se canceló la eliminación');
      }
    });
  }


  rubroDelete() {
    if (!this.rubroSeleccionado) {
      console.error('No se ha seleccionado ningún rubro para eliminar.');
      return;
    }
  
    const idRubroEliminar = this.rubroSeleccionado.idRubro;
  
    this.dataShared.mostrarSpinner();
    this.modificarEliminarHabilitado = true;
  
    this.rubroService.deleteLogico(idRubroEliminar!)
      .subscribe(
        () => {
          console.log('Rubro eliminado correctamente');
  
          this._snackBar.okSnackBar('El rubro se eliminó correctamente');
         
          
        },
        () => {
          this._snackBar.warnSnackBar('Error al eliminar el rubro');
          }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
         // Recargar el componente navegando a la misma ruta
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['administrador/rubros']);
        });

      });
  }



}
