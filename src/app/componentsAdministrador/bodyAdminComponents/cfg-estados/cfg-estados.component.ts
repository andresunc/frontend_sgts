import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderStatusComponent } from './order-status/order-status.component';

@Component({
  selector: 'app-cfg-estados',
  templateUrl: './cfg-estados.component.html',
  styleUrls: ['./cfg-estados.component.css']
})
export class CfgEstadosComponent implements OnInit {

  @ViewChild('auto') matAutocomplete!: MatAutocomplete;

  myControl = new FormControl();
  estados: Estado[] = [];
  initialEstados: Estado[] = [];
  categorias: Categoria[] = [];
  filteredOptions?: Observable<Estado[]>;
  displayFn!: ((value: any) => string) | null;
  disableBtnCrear: boolean = true;
  disableBtnEditDelete: boolean = true;

  firstFormGroup = new FormGroup({
    BuscarEstado: new FormControl<string>(''),
    Estado: new FormControl<string>(''),
    Categoria: new FormControl<number | null>(null),

  })

  constructor(
    private estadosService: EstadosService,
    private dataShared: DataSharedService,
    private _snackBar: PopupService,
    private categoriaService: CategoriaService,
    private dialog: MatDialog,
    private router: Router,
  ) {

  }

  ngOnInit() {

    this.obtenerEstado();
    this.obtenerCategorias();

    // Observar los cambios en el input para detectar si se ha borrado el estado seleccionado
    this.firstFormGroup.controls.Estado.valueChanges.subscribe({
      next: (newValue: string | null) => {
        this.disableBtnCrear = true;
        if (newValue && !this.estadoSeleccionado) {
          this.disableBtnCrear = false;
        }
       this.estadoSeleccionado = newValue ? this.estadoSeleccionado : undefined;
       this.disableBtnEditDelete = this.estadoSeleccionado ? false : true;
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
      this.initialEstados = JSON.parse(JSON.stringify(data));
      console.log("Estados obtenidos:", this.estados);
    });
  }

  obtenerCategorias() {

    this.categoriaService.getAllCategorias()
      .subscribe(
        (data) => {
          this.categorias = data;
          console.log('Categorias cargadas: ', data)
        }
      )
  }

  estadoSeleccionado: Estado | undefined;
  seleccionarEstado(value: any) {
    this.estadoSeleccionado = this.estados.find(es => es.tipoEstado === value);
    console.log(this.estadoSeleccionado)
    if (this.estadoSeleccionado) {
      this.disableBtnEditDelete = false;
      this.disableBtnCrear = true;
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
    const filterValue = value.toLowerCase() || '';
    return this.estados.filter(estado => estado.tipoEstado?.toLowerCase().startsWith(filterValue));
  }


  incomplete: boolean = false;
  crearEstado() {

    const estadoName = this.firstFormGroup.controls.Estado.value;
    const idCategoriaSeleccionada = this.firstFormGroup.controls.Categoria.value;
    if (estadoName === '' || estadoName === null || idCategoriaSeleccionada === null) {
      this.incomplete = true;
      setTimeout(() => {
        this.incomplete = false;
      }, 2000);
      return;
    }

    if (!estadoName && this.estadoSeleccionado) {
      // Restablecer la variable del estado seleccionado y deshabilitar la modificación
      this.estadoSeleccionado = undefined;
      this.disableBtnEditDelete = false;
      // Limpiar el input
      this.firstFormGroup.controls.Estado.setValue('');
      return;
    }

    this.dataShared.mostrarSpinner();

    const estado: Estado = new Estado();
    estado.tipoEstado = estadoName;
    estado.idCategoria = idCategoriaSeleccionada;

    this.estadosService.createEstado(estado)
      .subscribe(
        (data) => {
          this.dataShared.triggerUpDateSideBar(); // Actualiza la SideBar
          console.log('Estado creado: ', data);

          this._snackBar.okSnackBar('El estado se creó correctamente');
          this.obtenerEstado();

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
    let idCategoriaSeleccionada = this.firstFormGroup.controls.Categoria.value;
    idCategoriaSeleccionada ? this.firstFormGroup.controls.Categoria.value : this.estadoSeleccionado.idCategoria;

    if (!nuevoNombreEstado || nuevoNombreEstado.trim() === '') {
      console.error('El nuevo nombre del estado no puede estar vacío.');
      return;
    }
    if (idCategoriaSeleccionada === null) {
      idCategoriaSeleccionada = this.estadoSeleccionado.idCategoria!;
      console.log(`Se tomó por defecto el id ${idCategoriaSeleccionada} original del estado`);
    }

    const idEstadoModificar = this.estadoSeleccionado.idEstado;
    const estadoModificado: Estado = { ...this.estadoSeleccionado, tipoEstado: nuevoNombreEstado, idCategoria: idCategoriaSeleccionada };

    // buscar el estado con el mismo id que idEstadoModificar
    const estadoInicial = this.initialEstados.find(est => est.idEstado === idEstadoModificar);

    // Transformar los objetos con JSON.stringify, compararlos y almancenar el resultado en una variable
    const sameEstado = JSON.stringify(estadoModificado) === JSON.stringify(estadoInicial);

    // comparar las variables
    if (sameEstado) {
      console.log('No hay cambios que hacer :/')
      this._snackBar.warnSnackBar('No hay cambios que hacer', 'Ok');
      this.dataShared.ocultarSpinner();
      return;
    }

    this.dataShared.mostrarSpinner();
    this.disableBtnEditDelete = true;
    this.disableBtnCrear = false;

    this.estadosService.updateEstado(idEstadoModificar!, estadoModificado)
      .subscribe(
        (data) => {
          this.dataShared.triggerUpDateSideBar();
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

  checkDelete(): void {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: { message: `¿Eliminar estado ${this.estadoSeleccionado?.tipoEstado}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.estadoDelete();
      } else {
        console.log('Se canceló la eliminación');
      }
    });
  }

  openOrdenEstados() {
    const dialogRef = this.dialog.open(OrderStatusComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log('Se canceló el pedido de ordenar');
      }
    });
  }


  estadoDelete() {
    if (!this.estadoSeleccionado) {
      console.error('No se ha seleccionado ningún estado para eliminar.');
      return;
    }

    const idEstadoEliminar = this.estadoSeleccionado.idEstado;

    this.dataShared.mostrarSpinner();
    this.disableBtnEditDelete = true;

    this.estadosService.deleteLogico(idEstadoEliminar!)
      .subscribe(
        () => {
          console.log('Estado eliminado correctamente');

          this._snackBar.okSnackBar('El estado se eliminó correctamente');
          this.dataShared.triggerUpDateSideBar();

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

  equalName: boolean = false;
  checkExistName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputData = inputElement.value || '';
    this.equalName = this.estados.some(es => es.tipoEstado?.toLowerCase() === inputData.toLowerCase());
    console.log(this.equalName);

    if (this.equalName) {
      this.firstFormGroup.get('Estado')?.setErrors({ duplicate: true });
    } else {
      const errors = this.firstFormGroup.get('Estado')?.errors;
      if (errors) {
        delete errors['duplicate'];
        if (Object.keys(errors).length === 0) {
          this.firstFormGroup.get('Estado')?.setErrors(null);
        } else {
          this.firstFormGroup.get('Estado')?.setErrors(errors);
        }
      }
    }
  }

  formularioTieneErrores(): boolean {
    this.firstFormGroup.markAllAsTouched();
    const hayErrores = this.firstFormGroup.invalid || this.firstFormGroup.pending;
    console.log('Datos erroneos en el formulario: ', hayErrores)
    return hayErrores
  }

  @ViewChild('estadoHelp') estadoHelpRef!: TemplateRef<HTMLElement>;
  goInstructor() {
  const title = 'Como administrar un Estado';
  this.dataShared.openInstructor(this.estadoHelpRef, title);
}


backspace() {
  console.log('backspace works');
    this.disableBtnEditDelete = true;
    this.firstFormGroup.reset();
}

}
