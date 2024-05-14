import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    private snackService: PopupService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.setParams();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return value ? this._filter(value) : this.requisitos.slice();
      })

    );

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
          this.setRubro.idRubro = undefined;
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
          this.defaultDependencia.idDependencia = undefined;
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

  itemMatch: Item | undefined = undefined;
  requisitoSelected: string = '';
  showItemSelected: boolean = false;
  seleccionarRequisito(nombreRequisito: string) {

    try {

      this.dataShared.mostrarSpinner();
      this.requisitoSelected = nombreRequisito;
      const requisitoMatch = this.requisitos.find(req => req.descripcion === this.requisitoSelected);
      this.itemMatch = this.itemLists.find(item => item.requisitoIdRequisito === requisitoMatch?.idRequisito);
      let diasHorasValue: string = '';
      if (this.itemMatch?.duracionEstandar && this.itemMatch.duracionEstandar <= 24) {
        diasHorasValue = 'horas'
      }
      if (this.itemMatch?.duracionEstandar && this.itemMatch.duracionEstandar > 24) {
        this.itemMatch.duracionEstandar = Math.floor(this.itemMatch.duracionEstandar / 24); // Tomar solo la parte entera
        diasHorasValue = 'dias'
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

  backspace() {
    console.log('backspace works');
    this.disableBtnEditDelete = true;
    this.firstFormGroup.reset();
  }

  private _filter(value: string): Requisito[] {
    const filterValue = value.toLowerCase();
    return this.requisitos.filter(requisito => requisito.descripcion?.toLowerCase().startsWith(filterValue));
  }


  crearItem() {
    this.dataShared.mostrarSpinner();

    const nombreItem = this.firstFormGroup.get('nombreItem')?.value;
    const tipoServicio = this.firstFormGroup.controls.tipoServicio.value;
    const tipoItem = this.firstFormGroup.controls.tipoItem.value;
    const dependencia = this.firstFormGroup.controls.dependencia.value;
    const rubro = this.firstFormGroup.controls.rubro.value;
    let duracionEstandar = this.firstFormGroup.get('duracionEstandar')?.value!;
    const diaHora = this.firstFormGroup.controls.diaHora.value;

    if (diaHora === 'dias') {
      duracionEstandar = duracionEstandar * 24
    }

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
          this.snackService.okSnackBar('Ítem creado correctamente')
        }
      ).add(
        this.dataShared.ocultarSpinner()
      );

    console.log(item)
  }

  modificarItem() {
    throw new Error('Method not implemented.');
  }

  checkDelete() {
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
  }

  eliminarItem() {
    this.itemService.deleteItem(this.itemMatch?.idItem!)
      .subscribe( () => {
        this.refresh();
        this.snackService.errorSnackBar('Ítem eliminado correctamente') 
      })
  }

  refresh() {
    this.firstFormGroup.reset();
    // Recargar el componente navegando a la misma ruta
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['administrador/items']);
    });
  }

}
