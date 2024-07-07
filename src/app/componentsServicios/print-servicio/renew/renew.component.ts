import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/DomainModels/Categoria';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { RenovarServicio } from 'src/app/models/DomainModels/RenovarServicio';
import { TrackingStorage } from 'src/app/models/DomainModels/TrackingStorage';
import { NuevoServicioDto } from 'src/app/models/ModelsDto/NuevoServicioDto';
import { RecursoDto } from 'src/app/models/ModelsDto/RecursoDto';
import { Params } from 'src/app/models/Params';
import { AuthService } from 'src/app/services/auth.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { CategoriaService } from 'src/app/services/DomainServices/categoria.service';
import { EstadosService } from 'src/app/services/DomainServices/estados.service';
import { TrackingStorageService } from 'src/app/services/DomainServices/tracking-storage.service';
import { RecursoDtoService } from 'src/app/services/ServiciosDto/recurso-dto.service';
import { ServicioService } from 'src/app/services/ServiciosDto/ServicioService';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
import { PopupService } from 'src/app/services/SupportServices/popup.service';

@Component({
  selector: 'app-renew',
  templateUrl: './renew.component.html',
  styleUrls: ['./renew.component.css']
})
export class RenewComponent implements OnInit {

  idServicio: number;
  form!: FormGroup;
  recursoList: RecursoDto[] = [];
  recursoSelected!: RecursoDto;
  estadoList: Estado[] = [];
  params: Params = new Params();
  categorias: Categoria[] = [];
  multipleTracking: TrackingStorage[] = [];

  constructor(
    private fb: FormBuilder,
    private recursoDto: RecursoDtoService,
    private estadoService: EstadosService,
    private categoriaService: CategoriaService,
    private servicioService: ServicioService,
    private authService: AuthService,
    private trackingService: TrackingStorageService,
    private svManager: ManagerService,
    private _snackBar: PopupService,
    private router: Router,
    private dataShared: DataSharedService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idServicio = data;
  }

  ngOnInit(): void {
    this.setForm();
    this.getParams();
  }

  getParams() {
    try {
      this.getRecursos();
      this.getCategorias();
      this.getEstados();
    } catch (error) {
      console.log('Error al cargar parámetros', error);
    }
  }

  getCategorias() {
    this.categoriaService.getAllCategorias()
      .subscribe((data) => {
        this.categorias = data;
      })
  }

  getEstados() {
    this.estadoService.getStatusNotDeleted()
      .subscribe((data) => {
        this.estadoList = data;
        this.setEstadosPermitidos();
      });
  }

  estadosPermitidos: Estado[] = [];
  setEstadosPermitidos() {
    const categoriaPermitida = this.categorias.find(ca => ca.categoria === this.params.SIN_INICIAR);
    this.estadosPermitidos = this.estadoList.filter(
      est => est.idCategoria === categoriaPermitida?.idCategoria &&
        est.tipoEstado !== this.params.PRESUPUESTO_RECHAZADO);
  }

  getRecursos() {
    this.recursoDto.getRecursos()
      .subscribe((data) => {
        this.recursoList = data;
        console.log(this.recursoList);
      });
  }

  setForm() {
    this.form = this.fb.group({
      presupuesto: [0, [Validators.required, Validators.min(0)]],
      responsable: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  renovar() {
    this.dataShared.mostrarSpinner();
    const costoServicio = this.form.get('presupuesto')?.value;
    const recurso = this.form.get('responsable')?.value;
    const estado = this.form.get('estado')?.value;

    const dataRenew: RenovarServicio = new RenovarServicio();
    dataRenew.id_Servicio = this.idServicio;
    dataRenew.costo_Servicio = costoServicio;
    dataRenew.recurso_GG_id_Recurso_GG = recurso.idRecurso;
    dataRenew.estado_id_Estado = estado.idEstado;

    this.servicioService.renewServicio(dataRenew)
      .subscribe((data: number) => {

        // Set tracking storage para el servicio actual;
        let trackingStorage = new TrackingStorage();
        trackingStorage = this.getRecursoTrackingStorage();
        trackingStorage.idServicio = this.idServicio;
        trackingStorage.action = this.params.CREATE;
        trackingStorage.eventLog = 'Se renovó este servicio';
        trackingStorage.data = `Referencia de renovación, servicio ID: ${data}`;
        this.multipleTracking.push(trackingStorage);

        // Set tracking storage para el servicio actual;
        let trackingStorage2 = new TrackingStorage();
        trackingStorage2 = this.getRecursoTrackingStorage();
        trackingStorage2.idServicio = data;
        trackingStorage2.action = this.params.CREATE;
        trackingStorage2.eventLog = `Nuevo servicio creado proviniente del servicio ID: ${this.idServicio}`;
        trackingStorage2.data = `Estado inicial: ${estado.tipoEstado}. Presupuesto inicial: $${costoServicio}`;
        this.multipleTracking.push(trackingStorage2);

        this.trackingService.createMultipleTrackingStorages(this.multipleTracking)
          .subscribe(
            (trackingData) => {
              console.log('Múltiples trackings: ', trackingData);
              this.router.navigate(['/home']);
              const servicioDto: NuevoServicioDto = new NuevoServicioDto();
              servicioDto.servicio.idServicio = data;
              this.svManager.castNewServicio(servicioDto);
              this._snackBar.okSnackBar('Renovación exitosa');
            },
            () => {
              console.log('Error al crear el log de la trackingstorage')
            }
          );

      }).add(
        this.dataShared.ocultarSpinner()
      )
  }

  getRecursoTrackingStorage(): TrackingStorage {

    const trackingStorage = new TrackingStorage();
    const currentUser = this.authService.getCurrentUser();
    trackingStorage.idRecurso = currentUser?.id_recurso;
    trackingStorage.rol = currentUser?.roles?.[0]?.rol ?? 'Sin especificar';
    return trackingStorage;

  }

}

