import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';
import { Dependencia } from 'src/app/models/DomainModels/Dependencia';
import { Item } from 'src/app/models/DomainModels/Item';
import { Requisito } from 'src/app/models/DomainModels/Requisito';
import { Rubro } from 'src/app/models/DomainModels/Rubro';
import { TipoItem } from 'src/app/models/DomainModels/TipoItem';
import { TipoServicio } from 'src/app/models/DomainModels/TipoServicio';
import { DependenciaService } from 'src/app/services/DomainServices/dependencia.service';
import { ItemService } from 'src/app/services/DomainServices/item.service';
import { RequisitoService } from 'src/app/services/DomainServices/requisito.service';
import { RubroService } from 'src/app/services/DomainServices/rubro.service';
import { TipoItemService } from 'src/app/services/DomainServices/tipo-item.service';
import { TipoServicioService } from 'src/app/services/DomainServices/tipo-servicio.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-cfg-items',
  templateUrl: './cfg-items.component.html',
  styleUrls: ['./cfg-items.component.css']
})
export class CfgItemsComponent implements OnInit {

  myControl = new FormControl();
  displayFn!: ((value: any) => string);
  filteredOptions?: Observable<Requisito[]>;
  tipoItems: TipoItem[] = [];
  dependencias: Dependencia[] = [];
  rubros: Rubro[] = [];
  tipoServicios: TipoServicio[] = [];
  defaultTipoServicio: TipoServicio = new TipoServicio();
  defaultDependencia: Dependencia = new Dependencia();
  setRubro: Rubro = new Rubro();
  requisitos: Requisito[] = [];
  itemLists: Item[] = [];
  disableBtnEditDelete: boolean = true;
  itemMatch: Item | undefined = undefined;
  initialItem: Item | undefined = undefined;
  requisitoSelected: string = '';

  firstFormGroup = new FormGroup({
    nombreItem: new FormControl<string>('', [Validators.maxLength(60)]),
    tipoServicio: new FormControl<TipoServicio>(new TipoServicio, Validators.required),
    tipoItem: new FormControl<TipoItem>(new TipoItem, Validators.required),
    dependencia: new FormControl<Dependencia>(new Dependencia, Validators.required),
    rubro: new FormControl<Rubro>(new Rubro, Validators.required),
    duracionEstandar: new FormControl<number>(0, [Validators.required, Validators.min(0), Validators.max(365)]),
    diaHora: new FormControl<string>("", Validators.required),
  });


  constructor(
    private tipoItemService: TipoItemService,
    private rubroService: RubroService,
    private dependenciaService: DependenciaService,
    private tipoServicioService: TipoServicioService,
    private requisitoService: RequisitoService,
    private itemService: ItemService,
    private dataShared: DataSharedService,
    private dialog: MatDialog,
    private _snackBar: PopupService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.setParams();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return value ? this._filter(value) : this.requisitos.slice();
      }));

  }

  setParams() {

    this.tipoItemService.getTipoItems()
      .subscribe(
        (data) => {
          this.tipoItems = data;
          console.log(
            this.tipoItems,
          )
        }
      )

    this.rubroService.getAllRubro()
      .subscribe(
        (data) => {
          this.rubros = data;
          this.setRubro.idRubro = null;
          this.setRubro.rubro = "No aplica";
          this.rubros.push(this.setRubro);
          console.log(
            this.rubros,
          )
        }
      )

    this.dependenciaService.getAll()
      .subscribe(
        (data) => {
          this.defaultDependencia.idDependencia = null;
          this.defaultDependencia.dependencia = 'No aplica'
          this.dependencias = data;
          this.dependencias.push(this.defaultDependencia);
          console.log(
            this.dependencias,
          )
        }
      )

    this.tipoServicioService.getTipoServicesNotDeleted()
      .subscribe(
        (data) => {
          this.tipoServicios = data;
          this.defaultTipoServicio.idTipoServicio = undefined
          this.defaultTipoServicio.tipoServicio = 'Indistinto';
          this.tipoServicios.push(this.defaultTipoServicio);
          console.log(
            this.tipoServicios,
          )
        }
      )

    this.requisitoService.getAll()
      .subscribe(
        (data) => {
          this.requisitos = data;
          this.requisitos.sort((a, b) => {
            const descripcionA = a.descripcion!.toLowerCase(); // Convertimos a minúsculas para evitar problemas de ordenación
            const descripcionB = b.descripcion!.toLowerCase();
            if (descripcionA < descripcionB) {
              return -1; // a debe ir antes que b
            } else if (descripcionA > descripcionB) {
              return 1; // a debe ir después de b
            } else {
              return 0; // a y b son iguales
            }
          });
          console.log(
            'Requisitos: ', this.requisitos
          )
        }
      )

    this.itemService.getItemsNotDelete()
      .subscribe(
        (data) => {
          this.itemLists = data;
          console.log(
            'Items: ', this.itemLists
          )
        }
      )
  }

  onInputFocus() {
    this.myControl.setValue('');
  }

 
  seleccionarRequisito(nombreRequisito: string) {

    try {

      this.dataShared.mostrarSpinner();
      this.requisitoSelected = nombreRequisito;
      const requisitoMatch = this.requisitos.find(req => req.descripcion === this.requisitoSelected);
      this.itemMatch = this.itemLists.find(item => item.requisitoIdRequisito === requisitoMatch?.idRequisito);
      this.itemMatch!.descripcion = this.requisitoSelected;
      this.initialItem = JSON.parse(JSON.stringify(this.itemMatch)); // Agrego el item inicial para después compararlos en la fn de editar
      
      let diasHorasValue: string = '';
      if (this.itemMatch?.duracionEstandar && this.itemMatch.duracionEstandar <= 24) {
        diasHorasValue = 'horas';
      }
      if (this.itemMatch?.duracionEstandar && this.itemMatch.duracionEstandar > 24) {
        this.itemMatch.duracionEstandar = Math.ceil(this.itemMatch.duracionEstandar / 24); // Tomar solo la parte entera
        diasHorasValue = 'dias';
      }

      this.firstFormGroup.patchValue({
        nombreItem: this.requisitoSelected,
        tipoServicio: this.tipoServicios.find(ts => ts.idTipoServicio === this.itemMatch?.tipoServicioIdTipoServicio || ts.idTipoServicio === undefined),
        tipoItem: this.tipoItems.find(item => item.idTipoItem === this.itemMatch?.tipoItemIdTipoItem),
        dependencia: this.dependencias.find(dep => dep.idDependencia === this.itemMatch?.dependenciaIdDependencia || dep.idDependencia === undefined),
        rubro: this.rubros.find(ru => ru.idRubro === this.itemMatch?.rubroIdRubro || ru.idRubro === undefined),
        duracionEstandar: this.itemMatch?.duracionEstandar,
        diaHora: diasHorasValue
      })

      this.disableBtnEditDelete = false;
      console.log(this.firstFormGroup);

      this.dataShared.ocultarSpinner();

    } catch (error) {
      console.log('Error en la ejecución de seleccionarRequisito()')
      this.dataShared.ocultarSpinner();
    }
  }

  private _filter(value: string): Requisito[] {
    const filterValue = value.toLowerCase() || '';
    return this.requisitos.filter(requisito => requisito.descripcion?.toLowerCase().startsWith(filterValue));
  }

  crearItem() {
    this.dataShared.mostrarSpinner();

    const nombreItem = this.firstFormGroup.controls.nombreItem.value;
    const tipoServicio = this.firstFormGroup.controls.tipoServicio.value;
    const tipoItem = this.firstFormGroup.controls.tipoItem.value;
    const dependencia = this.firstFormGroup.controls.dependencia.value;
    const rubro = this.firstFormGroup.controls.rubro.value;
    let duracionEstandar = this.firstFormGroup.controls.duracionEstandar.value!;
    const diaHora = this.firstFormGroup.controls.diaHora.value;

    if (diaHora === 'dias') {
      duracionEstandar *= 24
    }
    duracionEstandar = Math.ceil(duracionEstandar);

    const item: Item = new Item();

    item.descripcion = nombreItem;
    item.tipoItemIdTipoItem = tipoItem?.idTipoItem;
    item.rubroIdRubro = rubro?.idRubro;
    item.dependenciaIdDependencia = dependencia?.idDependencia;
    item.tipoServicioIdTipoServicio = tipoServicio?.idTipoServicio;
    item.duracionEstandar = duracionEstandar

    this.itemService.createItem(item)
      .subscribe(
        (data) => {
          console.log('Creación ok', data);
          this.refresh();
          this._snackBar.okSnackBar('Ítem creado correctamente')
        }
      ).add(
        this.dataShared.ocultarSpinner()
      );

    console.log(item)
  }

  modificarItem() {

    const nombreItem = this.firstFormGroup.controls.nombreItem.value;
    const tipoServicio = this.firstFormGroup.controls.tipoServicio.value;
    const tipoItem = this.firstFormGroup.controls.tipoItem.value;
    const dependencia = this.firstFormGroup.controls.dependencia.value;
    const rubro = this.firstFormGroup.controls.rubro.value;
    let duracionEstandar = this.firstFormGroup.controls.duracionEstandar.value!;
    const diaHora = this.firstFormGroup.controls.diaHora.value;

    if (diaHora === 'dias') {
      duracionEstandar *= 24
    }
    duracionEstandar = Math.ceil(duracionEstandar);

    this.itemMatch!.tipoItemIdTipoItem = tipoItem?.idTipoItem;
    this.itemMatch!.rubroIdRubro = rubro?.idRubro;
    this.itemMatch!.dependenciaIdDependencia = dependencia?.idDependencia;
    this.itemMatch!.tipoServicioIdTipoServicio = tipoServicio?.idTipoServicio;

    this.itemMatch!.duracionEstandar = duracionEstandar;
    this.itemMatch!.descripcion = nombreItem;

    const sameItem = JSON.stringify(this.initialItem) === JSON.stringify(this.itemMatch);
    console.log(sameItem, 'A: ' , this.initialItem, 'B:', this.itemMatch)

    if (sameItem) {
      console.log('No hay cambios que hacer :/')
      this._snackBar.warnSnackBar('No hay cambios que hacer', 'Ok');
      return;
    }

    this.dataShared.mostrarSpinner();
    this.itemService.updateItem(this.itemMatch!)
      .subscribe(
        (data) => {
          console.log('Actualizado, ', data);
          this.refresh();
          this._snackBar.okSnackBar('Ítem editado correctamente')
        }
      ).add(
        this.dataShared.ocultarSpinner()
      )

  }

  checkDelete() {

    if (!this.formularioTieneErrores()) {
      
      const nombreItem = this.firstFormGroup.get('nombreItem')?.value;
      const dialogRef = this.dialog.open(DeletePopupComponent, {
        data: { message: `¿Eliminar el ítem ${nombreItem}?` }
      });

      dialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            this.eliminarItem();
          } else {
            console.log('Se canceló la eliminación');
          }
        });
    } else {
      this.firstFormGroup.markAllAsTouched();
    }
  }

  eliminarItem() {
    this.itemService.deleteItem(this.itemMatch?.idItem!)
      .subscribe(() => {
        this.refresh();
        this._snackBar.errorSnackBar('Ítem eliminado correctamente')
      })
  }

  refresh() {
    this.firstFormGroup.reset();
    // Recargar el componente navegando a la misma ruta
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['administrador/items']);
    });
  }

  @ViewChild('itemHelp') estadoHelpRef!: TemplateRef<HTMLElement>;
  goInstructor() {
  const title = 'Como administrar un Item';
  this.dataShared.openInstructor(this.estadoHelpRef, title);
}

  backspace() {
    console.log('backspace works');
    this.disableBtnEditDelete = true;
    this.firstFormGroup.reset();
  }

  equalName : boolean = true;
  checkRequisitoName(event: Event): void {
    
    const inputElement = event.target as HTMLInputElement;
    const inputData = inputElement.value.trim() || '';
    this.equalName = this.requisitos.some(re => re.descripcion?.toLowerCase() === inputData.toLowerCase());

    console.log(this.equalName)

    if (this.equalName) {
      this.firstFormGroup.get('nombreItem')?.setErrors({ duplicate: true });
    } else {
      const errors = this.firstFormGroup.get('nombreItem')?.errors;
      if (errors) {
        delete errors['duplicate'];
        if (Object.keys(errors).length === 0) {
          this.firstFormGroup.get('nombreItem')?.setErrors(null);
        } else {
          this.firstFormGroup.get('nombreItem')?.setErrors(errors);
        }
      }
    }
  }

  formularioTieneErrores(): boolean {
    this.firstFormGroup.markAllAsTouched();
    const hayErrores = this.firstFormGroup.invalid || this.firstFormGroup.pending;
    return hayErrores
  }

}
