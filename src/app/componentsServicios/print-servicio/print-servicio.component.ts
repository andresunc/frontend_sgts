import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';
import { ContactoEmpresa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PrintService } from 'src/app/services/print.service';
import { ChecklistComponent } from './checklist/checklist.component';
import { Router } from '@angular/router';
import { DeletePopupComponent } from 'src/app/componentsShared/delete-popup/delete-popup.component';
import { AuthService } from 'src/app/services/auth.service';
import { ServicioService } from 'src/app/services/ServiciosDto/ServicioService';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { EstadosService } from 'src/app/services/DomainServices/estados.service';
import { HistoricoEstado } from 'src/app/models/DomainModels/HistoricoEstado';
import { Servicio } from 'src/app/models/DomainModels/Servicio';
import { ServicioEmpresa } from 'src/app/models/DomainModels/ServicioEmpresa';
import { HistoricoEstadoService } from 'src/app/services/DomainServices/historico-estado.service';
import { ServicioEmpresaService } from 'src/app/services/DomainServices/servicio-empresa.service';
import { MatOption } from '@angular/material/core';
import { Params } from 'src/app/models/Params';
import { CalcularAvancePipe } from 'src/app/componentsShared/pipes/calcularAvance';
import { TrackingStorage } from 'src/app/models/DomainModels/TrackingStorage';
import { TrackingStorageService } from 'src/app/services/DomainServices/tracking-storage.service';
import { TrackingComponent } from './tracking/tracking.component';
import { RenewComponent } from './renew/renew.component';
import { Categoria } from 'src/app/models/DomainModels/Categoria';
import { CategoriaService } from 'src/app/services/DomainServices/categoria.service';

@Component({
  selector: 'app-print-servicio',
  templateUrl: './print-servicio.component.html',
  styleUrls: ['./print-servicio.component.css'],
  providers: [CalcularAvancePipe] // Proveer el pipe aquí
})
export class PrintServicioComponent implements OnInit {

  title: string = 'Detalle del servicio';
  recurrencia: number = 0;
  contactoEmpresa: ContactoEmpresa[] = [];
  estadosList: Estado[] = [];
  selectedEstado: string = '';
  minDate: Date;
  maxDate: Date;
  menuEditable!: boolean;

  presupuestOriginal!: number;
  txtPresupuesto!: string;
  recordatoriOriginal!: any;
  expedienteOriginal!: string;
  idEstadOriginal!: string;
  comentariOriginal!: string;
  params: Params = new Params();
  onServicio: Servicios;
  estadoServicio!: Estado | undefined;
  categorias: Categoria[] = [];

  constructor(
    private dataShared: DataSharedService,
    public dialog: MatDialog,
    private printService: PrintService,
    private servicioEmpresa: ServicioEmpresaService,
    private router: Router,
    private _snackBar: PopupService,
    private authService: AuthService,
    private servicioService: ServicioService,
    private estadoService: EstadosService,
    private historicoEstado: HistoricoEstadoService,
    private avancePipe: CalcularAvancePipe,
    private trackingService: TrackingStorageService,
    private categoriaService: CategoriaService,
  ) {
    this.minDate = new Date();
    this.maxDate = new Date(this.minDate.getFullYear() + 1, this.minDate.getMonth(), this.minDate.getDate());
    this.onServicio = this.getServicioLocalStorage();
    this.dataShared.setSharedObject(this.onServicio);
    this.menuEditable = this.enableMenuEdit();
  }

  ngOnInit() {

    const servicio = this.getServicio();
    this.setParams();
    this.getServicioById(servicio.idServicio);

    this.presupuestOriginal = servicio.total_presupuestado;
    this.txtPresupuesto = this.authService.isAdmin() ? servicio.total_presupuestado.toString() : '***************';
    this.recordatoriOriginal = servicio.fecha_notificacion;
    this.comentariOriginal = servicio.comentario;
    this.idEstadOriginal = servicio.estado;
    this.recurrencia = servicio.recurrencia;
    this.expedienteOriginal = servicio.expediente;

  }


  getServicioLocalStorage(): Servicios {
    return JSON.parse(localStorage.getItem('servicioRecibido') || '{}');
  }

  getServicioById(idServicio: number) {
    this.dataShared.mostrarSpinner();
    this.servicioService.getServicioById(idServicio)
      .subscribe(
        (data: Servicios) => {
          this.dataShared.setSharedObject(data);
          this.estadoServicio = this.estadosList.find(estado => estado.tipoEstado === data.estado);
          this.dataShared.ocultarSpinner();
        },
      ).add(
        () => {
          this.dataShared.ocultarSpinner();
        }
      )
  }

  setParams() {
    this.getContactoEmpresa();
    this.getEstados();
    this.getCategorias();
    this.getServicio();
    this.CheckServicioRenovado();
  }

  getCategorias() {
    this.categoriaService.getAllCategorias()
      .subscribe((data) => {
        this.categorias = data;
        this.setShowBtnRenew();
      })
  }

  getServicio(): Servicios {
    return this.dataShared.getSharedObject();
  }

  blockLowOrder(estado: Estado): boolean {
    if (this.estadoServicio === undefined) {
      this.estadoServicio = this.estadosList[0];
    }
    return estado.orden! < this.estadoServicio!.orden!;
  }

  blockOrder: boolean = true;
  warnEnable(option: MatOption): void {
    if (option.disabled) {
      this.alertDisblockOrder();
    }
  }

  alertDisblockOrder() {

    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        title: 'Selección de estados pasados',
        message: `Revertir la seleccion a un estado anterior impactará en los informes y análisis.
        ¿Deseas revertir?`,
        action: 'Revertir',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.blockOrder = false;
      } else {
        console.log('Se canceló la acción');
      }
    });
  }

  /**
   * Si this.blockOrder, es decir, el orden de los estados esta desbloqueado.
   * Los insert de los nuevos registros para los estados se harán por el método "Revertir" en el backend
   */

  alertaNotificado() {
    this._snackBar.warnSnackBar('Hay ítems marcados como nofitificados')
  }


  enableMenuEdit(): boolean {
    return this.authService.isAdmin()
  }


  getAvance(): number {
    return this.avancePipe.transform(this.getServicio().itemChecklistDto);
  }

  isEditable: boolean = false;
  editarServicio() {
    this.isEditable = this.authService.isAdmin();
  }

  cancelEdit() {
    this.isEditable = !this.isEditable 
  }

  openTracking() {
    const servicio = this.getServicio();
    const dialogRef = this.dialog.open(TrackingComponent, { data: servicio.idServicio });
  }

  checkDelete(): void {
    const servicio = this.getServicio();
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: { message: `¿Borrar el servicio ID: ${servicio.idServicio}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eliminarServicio();
      } else {
        console.log('Se canceló la eliminación');
      }
    });
  }

  eliminarServicio() {

    // Set tracking storage
    let trackingStorage = new TrackingStorage();
    trackingStorage = this.getRecursoTrackingStorage();
    trackingStorage.action = this.params.DELETE;
    trackingStorage.eventLog = 'Se eliminó de manera lógica en la tabla servicio_empresa';
    trackingStorage.data = 'Sin datos adicionales';

    // Suscripción a Servicio Empresa para eliminar de manera lógica de la bd
    const servicio = this.getServicio();
    this.servicioEmpresa.deleteLogico(servicio.idServicio)
      .subscribe(
        () => {

          // Enviar info a la tracking
          trackingStorage.idServicio = servicio.idServicio;
          this.suscribeTracking(trackingStorage);

          console.log('ServicioEmpresa Eliminado con éxito:'),
            this._snackBar.okSnackBar(`Servicio eliminado ID: ${servicio.idServicio}`),
            this.router.navigate(['/home']);
        },
        (error) => console.error('Error al eliminar el ServicioEmpresa:', error)
      );
  }

  private getContactoEmpresa() {
    const servicio = this.getServicio();
    this.printService.getContactoEmpresa(servicio.idCliente).subscribe(
      (data) => {
        this.contactoEmpresa = data;
        console.log('Contactos de la empresa: 12', data);
      }
    );
  }

  // Función para mostrar el PopUp de contactos
  openContactPopUp() {
    this.dataShared.setSharedMessage(this.contactoEmpresa);
    this.dialog.open(ContactPopUp);
  }

  openChecklistPopUp() {
    // si no está finalizado
    const servicio = this.getServicio();
    if (servicio.categoria === this.params.EN_CURSO) {
      this.dataShared.setSharedObject(servicio);
      const dialogRef = this.dialog.open(ChecklistComponent);

      dialogRef.afterClosed().subscribe(() => {
        // Se ejecutará cuando se cierre el modal del checklist
        this.getServicioById(servicio.idServicio);
      });
    } else if (servicio.categoria === this.params.FINALIZADO) {
      this._snackBar.warnSnackBar(`El servicio ha ${servicio.categoria.toLowerCase() || undefined}`)
    } else {
      this._snackBar.warnSnackBar('Este servicio aún no ha inicializado')
    }
  }

  // Lógica para los estados
  getEstados() {
    if (this.authService.isAdmin()) {
      const servicio = this.getServicio();
      this.dataShared.mostrarSpinner();
      this.estadoService.getStatusNotDeleted().subscribe(
        (data) => {
          this.estadosList = data;
          this.estadoServicio = this.estadosList.find(estado => estado.tipoEstado === servicio.estado);
          //this.checkEditable();
          console.log('Estados cargados OK');
          this.dataShared.ocultarSpinner();
        })
    } else {
      console.log('No es admin, no se cargaron los estados para el edit');
    }
  }

  /**
   * Buscar en la lista de estados el objeto que conicida con el seleccionado
   * Llamar a this.checkEditable()
   */
  estadoMatch: Estado | undefined;
  checkListNotCompleted: boolean = false;
  onEstadoChange() {
    // No se puede presentar si no está completo. No se puede finalizar si esta incompleto
    const isPresentado = (this.getServicio().estado === this.params.PRESENTADO);

    // Lógica para evitar que se pueda presentar si no esta completo el checklist
    // Si el estado es presentado y el checklist no esta completo
    if (isPresentado && !this.isCheckListComplete()) {
      this.checkListNotCompleted = true;
      this._snackBar.warnSnackBar('Debes completar el CheckList');
    } else {
      this.checkListNotCompleted = false;
    }

    this.estadoMatch = this.estadosList.find(estado => estado.tipoEstado === this.getServicio().estado);
    this.checkEditable();
  }

  isCheckListComplete(): boolean {
    return this.getServicio().itemChecklistDto.every(item => item.completo === true);
  }

  checkEditable(): boolean {
    /**
     * Todo Estado contiene un atributo llamado idCategoria.
     * La categoria "Finalizado" tiene el id: 3
     * Si la categoria del estado seleccionado es igual a 3 no se podrá editar el servicio
     */
    const categoria = this.categorias.find(ca => ca.categoria == this.params.FINALIZADO)
    return this.estadoMatch?.idCategoria === categoria?.idCategoria;
  }
  /* Fin de la sección de lógica para los estados */

  // Lógica para el presupuesto 
  @ViewChild('presupuestoInput', { static: false }) presupuestoInput!: ElementRef<HTMLInputElement>;
  validarPresupuesto() {
    const presupuesto = parseFloat(this.presupuestoInput.nativeElement.value);
    if (presupuesto < 0) {
      this.presupuestoInput.nativeElement.value = '0';
    }
  }

  maxDigits = 10;
  limitarLongitud(event: any) {
    if (event.target.value.length > this.maxDigits) {
      event.target.value = event.target.value.slice(0, this.maxDigits);
    }
  }
  /* Fin de lógica para el presupuesto */

  /**
   * Lógica para el almacenamiento de los cambios
   */
  loadChanges() {

    const servicio = this.getServicio();
    this.dataShared.mostrarSpinner();
    this.isEditable = !this.isEditable; // Cambiar estado booleano de isEditable
    let requestsCount = 0; // Inicializamos un contador de solicitudes

    // Set tracking storage
    let trackingStorage = new TrackingStorage();
    trackingStorage = this.getRecursoTrackingStorage();
    trackingStorage.idServicio = servicio.idServicio;

    /**
     * 1 - Ocultar el spinner
     * 2 - Actuazlizar obj cuando no haya más solicitudes en curso
     * 3 - Volver el botón al estado con el que entró a la función
     */
    const handleComplete = () => {
      requestsCount--;
      if (requestsCount < 0) this.dataShared.ocultarSpinner();
      console.log('valor del handleComplete: ', requestsCount);
      if (requestsCount === 0) {
        this.dataShared.ocultarSpinner();
        this.getServicioById(servicio.idServicio);
        console.log('ACTUALIZACIONES FINALIZADAS OK')
      }
    };

    // Si estadoMatch no es nulo y los id no coinciden entonces hay cambios y ejecutar el addHistorico
    // Incrementar el contador de solicitudes antes de realizar cada solicitud
    if (this.estadoMatch && this.estadoMatch?.idEstado != servicio.idEstado) {
      requestsCount++;

      try {
        // Armo el objeto historico de estado
        let historicoEstado = new HistoricoEstado();
        historicoEstado.estadoIdEstado = this.estadoMatch?.idEstado;
        historicoEstado.servicioIdServicio = servicio.idServicio;

        if (this.blockOrder) {
          // Agregar estado si blockOrder es true
          this.historicoEstado.addHistoricoEstado(historicoEstado)
            .subscribe(
              (response) => {
                // data para el primer tracking storages
                trackingStorage.eventLog = 'Estado del servicio actualizado';
                trackingStorage.data = `Establecido a: ${this.estadoMatch?.tipoEstado}`;
                trackingStorage.action = this.params.UPDATE;
                this.suscribeTracking(trackingStorage);
                this.dataShared.setSharedObject(servicio);
                console.log('Historico con blockOrder = true:', response);
                this.blockOrder = true;

                const categoria = this.categorias.find(ca => ca.categoria === this.params.FINALIZADO)
                this.showBtnRenew = this.estadoMatch?.idCategoria === categoria?.idCategoria;
              },
              (error) => console.error('Error al agregar HistoricoEstado:', error),
              handleComplete, // Llamar a handleComplete después de completar la solicitud
            );
        } else {
          // Agregar estado si blockOrder es false, ingresa por el método revertirHsEstado
          this.historicoEstado.revertirHsEstado(historicoEstado)
            .subscribe(
              (response) => {
                // data para el primer tracking storage
                trackingStorage.eventLog = 'Estado del servicio revertido';
                trackingStorage.data = `Establecido a: ${this.estadoMatch?.tipoEstado}`;
                trackingStorage.action = this.params.DELETE;
                this.suscribeTracking(trackingStorage);

                this.dataShared.setSharedObject(servicio)
                console.log('Historico con blockOrder = false:', response);
                this.blockOrder = true;

                const categoria = this.categorias.find(ca => ca.categoria === this.params.FINALIZADO)
                this.showBtnRenew = this.estadoMatch?.idCategoria === categoria?.idCategoria;
              },
              (error) => console.error('Error al agregar HistoricoEstado:', error),
              handleComplete, // Llamar a handleComplete después de completar la solicitud
            );
        }

      } catch (error) {
        console.log('Error en el try-catch en el insert Histórico Estado')
      }

    } else {
      console.log('No hay cambios en el estado de servicio')
    }

    // Verificar si hay cambios en el presupuesto y ejecutar
    // Incrementar el contador de solicitudes antes de realizar cada solicitud
    if (this.presupuestOriginal != servicio.total_presupuestado) {

      requestsCount++;
      let servicioEmpresa = new ServicioEmpresa();
      servicioEmpresa.costoServicio = servicio.total_presupuestado;

      // Suscripción a Servicio Empresa para agregar el último estado a la bd
      this.servicioEmpresa.update(servicio.idServicio, servicioEmpresa)
        .subscribe(
          (response) => {
            // data para el segundo tracking storage
            trackingStorage.eventLog = 'Presupuesto del servicio actualizado';
            trackingStorage.data = `$${servicio.total_presupuestado}`;
            trackingStorage.action = this.params.UPDATE;
            this.suscribeTracking(trackingStorage);

            console.log('Presupuesto actualizado OK:', response);
            this.dataShared.setSharedObject(servicio);
          },
          (error) => console.error('Error al actualizar ServicioEmpresa:', error),
          handleComplete // Llamar a handleComplete después de completar la solicitud
        );

    } else {
      console.log('No hay cambios en el presupuesto')
    }

    // Verificar si hay cambios en el servicio y ejecutar (Recordatorio, comentario, expediente)
    // Incrementar el contador de solicitudes antes de realizar cada solicitud

    if (this.recordatoriOriginal != servicio.fecha_notificacion ||
      this.comentariOriginal != servicio.comentario ||
      this.expedienteOriginal != servicio.expediente) {

      const recordatorioCambiado = (this.recordatoriOriginal != servicio.fecha_notificacion);
      const cometarioCambiado = (this.comentariOriginal != servicio.comentario);
      const expedienteCambiado = (this.expedienteOriginal != servicio.expediente);

      requestsCount++;
      let servicix: Servicio = new Servicio();
      servicix.fechaHoraAlertaVenc = servicio.fecha_notificacion ? new Date(servicio.fecha_notificacion) : undefined;
      servicix.comentario = servicio.comentario;
      servicix.expediente = servicio.expediente;

      if (recordatorioCambiado) {
        // data para el tercer tracking storage
        trackingStorage.eventLog = 'Recordatorio del servicio actualizado';
        trackingStorage.data = this.extractDateFromISO(servicio.fecha_notificacion);
        trackingStorage.action = this.params.UPDATE;
        this.suscribeTracking(trackingStorage);
      }

      if (expedienteCambiado) {
        // data para el tercer tracking storage
        trackingStorage.eventLog = 'Expediente del servicio actualizado';
        trackingStorage.data = servicix.expediente;
        trackingStorage.action = this.params.UPDATE;
        this.suscribeTracking(trackingStorage);
      }

      if (cometarioCambiado) {
        // data para el tercer tracking storage
        trackingStorage.eventLog = 'Comentario del servicio actualizado';
        trackingStorage.data = servicio.comentario;
        trackingStorage.action = this.params.UPDATE;
        this.suscribeTracking(trackingStorage);
      }

      this.servicioService.update(servicio.idServicio, servicix)
        .subscribe(
          (response) => {
            console.log('Comentario, Recordatorio, Expediente OK:', response);
            this.dataShared.setSharedObject(servicio);
          },
          (error) => console.error('Error al actualizar el Servicio:', error),
          handleComplete // Llamar a handleComplete después de completar la solicitud
        );

    } else {
      console.log('No hay cambios en el recordatorio o el comentario')
    }

    // Llamar a handleComplete si no hay solicitudes que realizar
    if (requestsCount === 0) {
      handleComplete();
    }

  }

  suscribeTracking(trackingStorage: TrackingStorage) {
    this.trackingService.createTrackingStorage(trackingStorage)
      .subscribe(
        (trackingData) => {
          console.log('log registrado: ', trackingData);
        },
        () => {
          console.log('Error al crear el log de la trackingstorage')
        }
      );
  }

  getRecursoTrackingStorage(): TrackingStorage {

    const trackingStorage = new TrackingStorage();
    const currentUser = this.authService.getCurrentUser();
    trackingStorage.idRecurso = currentUser?.id_recurso;
    trackingStorage.rol = currentUser?.roles?.[0]?.rol ?? 'Sin especificar';
    return trackingStorage;
  }

  extractDateFromISO(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isRenovado: boolean = false;
  CheckServicioRenovado() {
    const servicio = this.getServicio();
    this.servicioService.CheckServicioRenovado(servicio.idServicio)
      .subscribe(
        (isRenovado) => {
          if (isRenovado) {
            this.isRenovado = isRenovado
          }
        }
      )
  }

  showBtnRenew: boolean = false;
  setShowBtnRenew() {
    const categoria = this.categorias.find(ca => ca.categoria === this.params.FINALIZADO)
    this.showBtnRenew = this.getServicio().idCategoria === categoria?.idCategoria;
  }

  openRenovar() {
    const servicio = this.getServicio();
    this.dialog.open(RenewComponent, { data: servicio.idServicio });
  }

}

// Modal para mostrar los contactos de la empresa
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'show-contacts.html',
  standalone: true,
  imports: [MaterialModule, CommonModule]
})
export class ContactPopUp {

  contacts: any;
  displayedColumns: string[] = ['nombre', 'apellido', 'telefono', 'email'];
  dataSource: any;

  constructor(private dataShared: DataSharedService) {
    this.contacts = this.dataShared.getSharedMessage();
    this.dataSource = this.contacts;
  }
}