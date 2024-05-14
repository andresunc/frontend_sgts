import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
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
  modificarEliminarHabilitado: boolean = false;

  firstFormGroup = new FormGroup({
    nombreItem: new FormControl<string>('', [Validators.maxLength(60)]),
    tipoServicio: new FormControl<TipoServicio>(new TipoServicio, Validators.required),
    tipoItem: new FormControl<TipoItem>(new TipoItem, Validators.required),
    dependencia: new FormControl<Dependencia>(new Dependencia, Validators.required),
    rubro: new FormControl<Rubro>(new Rubro, Validators.required),
    duracionEstandar: new FormControl<number>(0, Validators.required),
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
          this.setRubro.idRubro = 99;
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
          this.defaultDependencia.idDependencia = 99;
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
          this.defaultTipoServicio.idTipoServicio = 99
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

  itemMatch: Item | undefined = new Item();
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
        nombreItem: requisitoMatch?.descripcion,
        tipoServicio: this.tipoServicios.find(ts => ts.idTipoServicio === this.itemMatch?.tipoServicioIdTipoServicio || ts.idTipoServicio === 99),
        tipoItem: this.tipoItems.find(item => item.idTipoItem === this.itemMatch?.tipoItemIdTipoItem),
        dependencia: this.dependencias.find(dep => dep.idDependencia === this.itemMatch?.dependenciaIdDependencia || dep.idDependencia === 99),
        rubro: this.rubros.find(ru => ru.idRubro === this.itemMatch?.rubroIdRubro || ru.idRubro === 99),
        duracionEstandar: this.itemMatch?.duracionEstandar,
        diaHora: diasHorasValue
      })

      this.showItemSelected = true;
      this.myControl.setValue(nombreRequisito);

      this.dataShared.ocultarSpinner();

    } catch (error) {
      console.log('Error en la ejecución de seleccionarRequisito()')
      this.dataShared.ocultarSpinner();
    }
  }

  backspace() {
    console.log('backspace works');
    this.showItemSelected = false;
    this.firstFormGroup.reset();
  }

  onInputFocus() {
    this.myControl.setValue('');
  }

  private _filter(value: string): Requisito[] {
    const filterValue = value.toLowerCase();
    return this.requisitos.filter(requisito => requisito.descripcion?.toLowerCase().startsWith(filterValue));
  }


  crearItem() {
    /* this.dataShared.mostrarSpinner();
     this.modificarEliminarHabilitado = true;
 
     const nombreItem = this.firstFormGroup.get('nombreItem')?.value;
     const tipoServicio = this.firstFormGroup.controls.tipoServicio;
     const tipoItem = this.firstFormGroup.controls.tipoItem;
     const dependencia = this.firstFormGroup.controls.dependencia;
     const rubro = this.firstFormGroup.controls.rubro;
     
     const duracionEstandar = this.firstFormGroup.get('duracionEstandar')?.value;
     const diaHora = this.firstFormGroup.get('diaHora')?.value;
 
     const Item: Item = new Item();
     const Requisito: Requisito = new Requisito();
     Requisito.descripcion = nombreItem;
     empresa.direccion = direccion;
     empresa.rubroIdRubro = rubro.value?.idRubro;
     empresa.riesgoIdRiesgo = riesgo.value?.idRiesgo;
     empresa.razonSocial = razonSocial;
 
     const empresaWithContacts: EmpresaWithContacts = new EmpresaWithContacts();
     empresaWithContacts.empresa = empresa;
     empresaWithContacts.contactos = this.contactos;
 
     this.empresaService.addEmpresaWithContacts(empresaWithContacts)
       .pipe(takeUntil(this.unsubscribe$))
       .subscribe(
         (data) => {
           console.log('Empresa creada: ', data);
 
           this.popupService.okSnackBar('La empresa se creó correctamente');
           console.log('La empresa se creó correctamente.');
           // Recargar el componente navegando a la misma ruta
           this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
             this.router.navigate(['administrador/clientes']);
           });
 
         },
         (error) => {
           this.popupService.warnSnackBar('Error al crear la empresa');
           console.error('Error al crear la empresa:', error);
         }
       )
       .add(() => {
         this.dataShared.ocultarSpinner();
         this.modificarEliminarHabilitado = false;
       })*/
  }
  modificarItem() {
    throw new Error('Method not implemented.');
  }
  checkDelete() {
    throw new Error('Method not implemented.');
  }

}
