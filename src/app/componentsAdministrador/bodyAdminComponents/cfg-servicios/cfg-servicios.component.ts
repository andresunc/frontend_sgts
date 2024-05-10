import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-cfg-servicios',
  templateUrl: './cfg-servicios.component.html',
  styleUrls: ['./cfg-servicios.component.css']
})
export class CfgServiciosComponent implements OnInit {

  tipoItemList: TipoItem[] = [];
  rubroList: Rubro[] = [];
  dependenciaList: Dependencia[] = [];
  tipoServicioList: TipoServicio[] = [];
  RequisitoList: Requisito[] = [];

  constructor(
    private tipoItemService: TipoItemService,
    private rubroService: RubroService,
    private dependenciaService: DependenciaService,
    private tipoServicioService: TipoServicioService,
    private requisitoService: RequisitoService
  ) {  }
  ngOnInit(): void {
    this.setParams();
  }

  setParams() {

    this.tipoItemService.getTipoItems()
    .subscribe(
      (data) => {
        this.tipoItemList = data;
        console.log(
          this.tipoItemList,
        )
      }
    )

    this.rubroService.getAllRubro()
    .subscribe(
      (data) => {
        this.rubroList = data;
        console.log(
        this.rubroList,
        )
      }
    )

    this.dependenciaService.getAll()
    .subscribe(
      (data) => {
        this.dependenciaList = data;
        console.log(
        this.dependenciaList,
        )
      }
    )

    this.tipoServicioService.getTipoServicesNotDeleted()
    .subscribe(
      (data) => {
        this.tipoServicioList = data;
        console.log(
        this.tipoServicioList,
        )
      }
    )

    this.requisitoService.getAll()
    .subscribe(
      (data) => {
        this.RequisitoList = data;
        console.log(
        this.RequisitoList
        )
      }
    )
  }

}
