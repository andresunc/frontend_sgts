import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { RubroService } from 'src/app/services/DomainServices/rubro.service';
import { Rubro } from 'src/app/models/DomainModels/Rubro';
import { Observable, map, startWith } from 'rxjs';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cfg-rubros',
  templateUrl: './cfg-rubros.component.html',
  styleUrls: ['./cfg-rubros.component.css']
})
export class CfgRubrosComponent implements OnInit {

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
    private router: Router,
  ) {

  }

  ngOnInit() {

    this.obtenerRubro();

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
  seleccionarRubro(idRubro: number) {
    this.rubroSeleccionado = this.rubros.find(rubro => rubro.idRubro === idRubro);

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
  }

  private _filter(value: string): Rubro[] {
    const filterValue = value.toLowerCase();
    return this.rubros.filter(rubro => rubro.rubro?.toLowerCase().startsWith(filterValue));
  }

  checkDelete() {
    throw new Error('Method not implemented.');
  }

  modificarRubro() {
    throw new Error('Method not implemented.');
  }

  crearRubro() {
    this.dataShared.mostrarSpinner();
    this.modificarEliminarHabilitado = true;

    const rubroName = this.firstFormGroup.controls.Rubro.value;

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
        this.modificarEliminarHabilitado = false;
      });
  }

}
