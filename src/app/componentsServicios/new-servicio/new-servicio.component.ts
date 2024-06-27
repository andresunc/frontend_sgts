import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject, delay, retryWhen, scan, takeUntil } from 'rxjs';
import { Categoria } from 'src/app/models/DomainModels/Categoria';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { TipoServicio } from 'src/app/models/DomainModels/TipoServicio';
import { EmpresaDto } from 'src/app/models/ModelsDto/EmpresaDto';
import { NuevoServicioDto } from 'src/app/models/ModelsDto/NuevoServicioDto';
import { RecursoDto } from 'src/app/models/ModelsDto/RecursoDto';
import { Params } from 'src/app/models/Params';
import { CategoriaService } from 'src/app/services/DomainServices/categoria.service';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { NewServicioService } from 'src/app/services/new-servicio.service';

@Component({
  selector: 'app-new-servicio',
  templateUrl: './new-servicio.component.html',
  styleUrls: ['./new-servicio.component.css']
})
export class NewServicioComponent implements OnInit, OnDestroy {

  servicioForm!: FormGroup;
  title: string = "Nuevo Servicio";
  presupuesto: number = 0.0;
  tipoServiciosList: TipoServicio[] = [];
  estadoList: Estado[] = [];
  recursoList: RecursoDto[] = [];
  empresaList: EmpresaDto[] = [];
  categorias: Categoria[] = [];

  tipoServicioSelected?: TipoServicio;
  estadoSelected?: Estado;
  recursoSelected?: RecursoDto;
  empresaSelected?: EmpresaDto;
  presupuestoSelected?: number;
  params: Params = new Params();

  constructor(private fb: FormBuilder, private dataNewServ: NewServicioService,
    private dataShared: DataSharedService,
    private categoriaService: CategoriaService,
    private _snackBar: PopupService,
    private svManager: ManagerService) {
  }

  sending: boolean = false;
  sendNewServicio() {

    this.sending = true;

    const nuevoServicioDto: NuevoServicioDto = new NuevoServicioDto();

    let tipoServicio: TipoServicio = this.servicioForm.get('tipo')?.value;
    let estado: Estado = this.servicioForm.get('estado')?.value;
    let recurso: RecursoDto = this.servicioForm.get('responsable')?.value;
    let empresa: EmpresaDto = this.servicioForm.get('empresa')?.value;

    nuevoServicioDto.servicio.tipoServicioIdTipoServicio = tipoServicio.idTipoServicio;
    nuevoServicioDto.historicoEstado.estadoIdEstado = estado.idEstado;
    nuevoServicioDto.servicioEmpresa.recursoGgIdRecursoGg = recurso.idRecurso;
    nuevoServicioDto.servicioEmpresa.empresaIdEmpresa = empresa.idEmpresa;
    nuevoServicioDto.servicioEmpresa.costoServicio = this.servicioForm.get('monto')?.value;
    nuevoServicioDto.itemChecklist = null;

    console.log('Se solicita crear el servicio: ' + nuevoServicioDto)

    this.dataShared.mostrarSpinner();
    this.dataNewServ.addServicio(nuevoServicioDto)
      .pipe(
        takeUntil(this.unsubscribe$)
      ) // este pipe es para agregaer la desuscripción
      .subscribe(
        (response: NuevoServicioDto) => {
          // Enviar info a la tracking
          this.svManager.castNewServicio(response);
          console.log('Servicio creado exitosamente:', response);
          this._snackBar.okSnackBar('Servicio creado exitosamente');
          this.servicioForm.reset();
          this.goToNextTab(0);
          this.sending = false;
          this.dataShared.ocultarSpinner();
        },
        () => {
          this.sending = false;
          this.dataShared.ocultarSpinner();
          this._snackBar.errorSnackBar('Error al crear servicio');
        }
      );

  }

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    // Inicializar el formulario en el método ngOnInit
    this.servicioForm = this.fb.group({
      monto: ['', [Validators.pattern('[0-9]*(\.[0-9]*)?')]],
      tipo: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      empresa: ['', [Validators.required]],
    });
    // Suscribirse a los cambios en el formulario
    this.servicioForm.get('monto')?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      // Actualizar la variable presupuesto cada vez que cambie el valor del formulario
      this.presupuesto = parseFloat(value) || 0.0;
    });

    /**
     * Obtener los datos necesarios para el formulario
     *  El Sistema intentará obtener los datos de los servicios,
     * en caso de error, se reintentará cada 2 segundos hasta 3 veces.
     */
    const maxCount = 2; // Número máximo de reintentos
    const timeDelay = 2000; // Tiempo de espera entre reintentos
    this.dataShared.mostrarSpinner(); // Mostrar el spinner de carga
    try {
      // 0 Obtener las categorias
      this.categoriaService.getAllCategorias()
      .subscribe(
        (data) => {
          this.categorias = data;
        }
      )
      // 1 Obtener los tipos de servicios
      this.dataNewServ.getTipoServicesNotDeleted().pipe(
        retryWhen(errors =>
          errors.pipe(
            delay(timeDelay),
            scan((retryCount, error) => {
              if (retryCount >= maxCount) {
                throw error;
              }
              console.log(`Error al obtener los tipos de servicio, reintentando...${retryCount + 1}/${maxCount}`);
              return retryCount + 1;
            }, 0),
            takeUntil(this.unsubscribe$)
          )
        ),
      ).subscribe((data) => {
        this.tipoServiciosList = data;
        console.log(this.tipoServiciosList);
      });

      // 2 Obtener los estados de los servicios
      this.dataNewServ.getStatusNotDeleted().pipe(
        retryWhen(errors =>
          errors.pipe(
            // Retry cada 2 segundos
            delay(timeDelay),
            scan((retryCount, error) => {
              if (retryCount >= maxCount) {
                throw error;
              }
              console.log(`Error al obtener los estados, reintentando...${retryCount + 1}/${maxCount}`);
              return retryCount + 1;
            }, 0),
            takeUntil(this.unsubscribe$)
          )
        ),
      ).subscribe((data) => {
        this.estadoList = data;
        this.setEstadosPermitidos();
        console.log(this.estadoList);
      });

      // 3 Obtener los recursos gg
      this.dataNewServ.getRecursos().pipe(
        retryWhen(errors =>
          errors.pipe(
            // Retry cada 2 segundos
            delay(timeDelay),
            scan((retryCount, error) => {
              if (retryCount >= maxCount) {
                throw error;
              }
              console.log(`Error al obtener los recursos gg, reintentando...${retryCount + 1}/${maxCount}`);
              return retryCount + 1;
            }, 0),
            takeUntil(this.unsubscribe$)
          )
        ),
      ).subscribe((data) => {
        this.recursoList = data;
        console.log(this.recursoList);
      });

      // 4 Obtener las empresas
      this.dataNewServ.getEmpresas().pipe(
        retryWhen(errors =>
          errors.pipe(
            // Retry cada 2 segundos
            delay(timeDelay),
            scan((retryCount, error) => {
              if (retryCount >= maxCount) {
                throw error;
              }
              console.log(`Error al obtener las empresas, reintentando...${retryCount + 1}/${maxCount}`);
              return retryCount + 1;
            }, 0),
            takeUntil(this.unsubscribe$)
          )
        ),
      ).subscribe((data) => {
        this.empresaList = data;
        console.log(this.empresaList);
      });

    } catch (error) {
      console.error('Error general:', error);
    } finally {
      this.dataShared.ocultarSpinner();
    }

    /**
     * Fin de la obtención de datos
     */
  }

  selectedTabIndex: number = 0;
  goToNextTab(value: number) {
    this.selectedTabIndex = value
  }

  tabChanged(event: MatTabChangeEvent) {
    // Actualizar el índice del tab seleccionado
    this.selectedTabIndex = event.index;
  }

  getColor(entity: any): string {
    return (entity === undefined) ? 'text-danger' : 'none';
  }

  estadosPermitidos: Estado[] = [];
  setEstadosPermitidos() {
    /**
     * Categoria permitida "Sin iniciar"
     */
    const categoriaPermitida = this.categorias.find(ca => ca.categoria === this.params.SIN_INICIAR);
    this.estadosPermitidos = this.estadoList.filter(est => est.idCategoria === categoriaPermitida?.idCategoria);
  }

}
