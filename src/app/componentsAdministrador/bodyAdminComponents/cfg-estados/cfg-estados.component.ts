import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EstadosService } from 'src/app/services/DomainServices/estados.service';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { Observable, map, startWith } from 'rxjs';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { Router } from '@angular/router';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { CategoriaService } from 'src/app/services/DomainServices/categoria.service';
import { Categoria } from 'src/app/models/DomainModels/Categoria';

@Component({
  selector: 'app-cfg-estados',
  templateUrl: './cfg-estados.component.html',
  styleUrls: ['./cfg-estados.component.css']
})
export class CfgEstadosComponent implements OnInit {

  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  myControl = new FormControl();
  estados: Estado[] = [];
  categorias: Categoria[] = [];
  filteredOptions?: Observable<Estado[]>;
  displayFn!: ((value: any) => string) | null;
  modificarEliminarHabilitado: boolean = false;

  firstFormGroup = new FormGroup({
    BuscarEstado: new FormControl<string>(''),
    Estado: new FormControl<string>(''),

  })

  constructor(
    private estadosService: EstadosService,
    private dataShared: DataSharedService,
    private _snackBar: PopupService,
    private categoriaService: CategoriaService,
    private router: Router,
  ) {

  }

  ngOnInit() {

    this.obtenerEstado();
    this.optenerCategorias();

    // Observar los cambios en el input para detectar si se ha borrado el estado seleccionado
    this.firstFormGroup.controls.Estado.valueChanges.subscribe({
      next: (newValue: string | null) => {
        if (!newValue && this.estadoSeleccionado) {
          // Restablecer la variable del estado seleccionado y deshabilitar la modificación
          this.estadoSeleccionado = undefined;
          this.modificarEliminarHabilitado = false;

        }
      }
    });


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return value ? this._filter(value) : this.estados.slice();
      })
    );
  }

  obtenerEstado() {

    this.estadosService.getStatusNotDeleted().subscribe((data: Estado[]) => {
      this.estados = data;
      console.log("Estados obtenidos:", this.estados);
    });
  }

  optenerCategorias() {

    this.categoriaService.getAllCategorias()
    .subscribe(
      (data) => {
        this.categorias = data;
        console.log('Categorias cargadas: ', data)
      }
    )
  }

  estadoSeleccionado: Estado | undefined;
  seleccionarEstado(idEstado: number) {
    this.estadoSeleccionado = this.estados.find(estado => estado.idEstado === idEstado);

    if (this.estadoSeleccionado) {
      this.modificarEliminarHabilitado = true;
      // Asignar el objeto Estado directamente
      this.firstFormGroup.patchValue({
        Estado: this.estadoSeleccionado.tipoEstado,
      });
    } else {
      console.error('No se encontró el estado');
    }
  }

  onInputFocus() {
    this.myControl.setValue(''); // Limpiar el valor del control para que se dispare el evento de filtro.
    this.matAutocomplete.options.forEach(option => option.deselect());

  }

  private _filter(value: string): Estado[] {
    const filterValue = value.toLowerCase();
    return this.estados.filter(estado => estado.tipoEstado?.toLowerCase().startsWith(filterValue));
  }


  crearEstado() {

    const estadoName = this.firstFormGroup.controls.Estado.value;
    if (estadoName === '' || estadoName === null) return;


    if (!estadoName && this.estadoSeleccionado) {
      // Restablecer la variable del estado seleccionado y deshabilitar la modificación
      this.estadoSeleccionado = undefined;
      this.modificarEliminarHabilitado = false;
      // Limpiar el input
      this.firstFormGroup.controls.Estado.setValue('');
      return;
    }

    this.dataShared.mostrarSpinner();

    const estado: Estado = new Estado();
    estadoName ? estado.tipoEstado = estadoName : undefined;

    this.estadosService.createEstado(estado)
      .subscribe(
        (data) => {
          console.log('Estado creado: ', data);

          this._snackBar.okSnackBar('El estado se creó correctamente');
          // Recargar el componente navegando a la misma ruta
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['administrador/estados']);
          });

        },
        (error) => {
          this._snackBar.warnSnackBar('Error al crear el estado');
          console.error('Error al crear el estado:', error);
        }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
      });
  }

  modificarEstado() {

    if (!this.estadoSeleccionado) {
      console.error('No se ha seleccionado ningún estado para modificar.');
      return;
    }

    const nuevoNombreEstado = this.firstFormGroup.controls.Estado.value;
    if (!nuevoNombreEstado || nuevoNombreEstado.trim() === '') {
      console.error('El nuevo nombre del estado no puede estar vacío.');
      return;
    }

    const idEstadoModificar = this.estadoSeleccionado.idEstado;
    const estadoModificado: Estado = { ...this.estadoSeleccionado, tipoEstado: nuevoNombreEstado };

    this.dataShared.mostrarSpinner();
    this.modificarEliminarHabilitado = true;

    this.estadosService.updateEstado(idEstadoModificar!, estadoModificado)
      .subscribe(
        (data) => {
          console.log('Estado modificado: ', data);

          this._snackBar.okSnackBar('El estado se modificó correctamente');
          // Recargar el componente navegando a la misma ruta
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['administrador/estados']);
          });

        },
        () => {
          this._snackBar.warnSnackBar('Error al modificar el estado');
        }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
      });

  }

  estadoDelete() {
    if (!this.estadoSeleccionado) {
      console.error('No se ha seleccionado ningún estado para eliminar.');
      return;
    }

    const idEstadoEliminar = this.estadoSeleccionado.idEstado;

    this.dataShared.mostrarSpinner();
    this.modificarEliminarHabilitado = true;

    this.estadosService.deleteLogico(idEstadoEliminar!)
      .subscribe(
        () => {
          console.log('Estado eliminado correctamente');

          this._snackBar.okSnackBar('El estado se eliminó correctamente');


        },
        () => {
          this._snackBar.warnSnackBar('Error al eliminar el estado');
        }
      )
      .add(() => {
        this.dataShared.ocultarSpinner();
        // Recargar el componente navegando a la misma ruta
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['administrador/estados']);
        });

      });
  }



}
