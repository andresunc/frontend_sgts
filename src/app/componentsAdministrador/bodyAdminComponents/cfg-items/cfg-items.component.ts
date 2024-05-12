import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscribable, map, startWith } from 'rxjs';
import { Dependencia } from 'src/app/models/DomainModels/Dependencia';
import { Requisito } from 'src/app/models/DomainModels/Requisito';
import { Rubro } from 'src/app/models/DomainModels/Rubro';
import { TipoItem } from 'src/app/models/DomainModels/TipoItem';
import { TipoServicio } from 'src/app/models/DomainModels/TipoServicio';
import { DependenciaService } from 'src/app/services/DomainServices/dependencia.service';
import { RequisitoService } from 'src/app/services/DomainServices/requisito.service';
import { RubroService } from 'src/app/services/DomainServices/rubro.service';
import { TipoItemService } from 'src/app/services/DomainServices/tipo-item.service';
import { TipoServicioService } from 'src/app/services/DomainServices/tipo-servicio.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';

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
  requisitos: Requisito[] = [];
  modificarEliminarHabilitado: any;

  firstFormGroup = new FormGroup({
    nombreItem: new FormControl<string>('', [Validators.maxLength(50)]),
    tipoServicio: new FormControl<TipoServicio>(new TipoServicio, Validators.required),
    tipoItem: new FormControl<TipoItem>(new TipoItem, Validators.required),
    dependencia: new FormControl<Dependencia>(new Dependencia, Validators.required),
    rubro: new FormControl<Rubro>(new Rubro, Validators.required),
    cantidad: new FormControl<number>(0 , Validators.required),
    diasHoras: new FormControl<string>("", Validators.required),
  });


  constructor(
    private router: Router,
    private popupService: PopupService,
    private tipoItemService: TipoItemService,
    private rubroService: RubroService,
    private dependenciaService: DependenciaService,
    private tipoServicioService: TipoServicioService,
    private requisitoService: RequisitoService
  ) { }

  ngOnInit() : void {
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
        console.log(
        this.rubros,
        )
      }
    )

    this.dependenciaService.getAll()
    .subscribe(
      (data) => {
        this.dependencias = data;
        console.log(
        this.dependencias,
        )
      }
    )

    this.tipoServicioService.getTipoServicesNotDeleted()
    .subscribe(
      (data) => {
        this.tipoServicios = data;
        this.defaultTipoServicio.idTipoServicio = -99
        this.defaultTipoServicio.tipoServicio = 'indistinto';
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
        this.requisitos
        )
      }
    )
  }
  
  seleccionarRequisito(arg0: any) {
    throw new Error('Method not implemented.');
  }



  onInputFocus() {
     this.myControl.setValue('');
  }

  private _filter(value: string): Requisito[] {
    const filterValue = value.toLowerCase();
    return this.requisitos.filter(requisito => requisito.descripcion?.toLowerCase().startsWith(filterValue));
  }


  crearItem() {
    throw new Error('Method not implemented.');
  }
  modificarItem() {
    throw new Error('Method not implemented.');
  }
  checkDelete() {
    throw new Error('Method not implemented.');
  }

}
