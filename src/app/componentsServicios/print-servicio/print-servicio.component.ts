import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/componentsShared/material/material.module';
import { ContactoEmpresa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import ManagerService from 'src/app/services/SupportServices/ManagerService';
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

@Component({
  selector: 'app-print-servicio',
  templateUrl: './print-servicio.component.html',
  styleUrls: ['./print-servicio.component.css']
})
export class PrintServicioComponent implements OnInit {

  servicioRecibido!: Servicios;
  title: string = 'Detalle del servicio';
  recurrencia: number = 0;
  contactoEmpresa: ContactoEmpresa[] = [];
  estadosList: Estado[] = [];
  selectedEstado: string = '';
  minDate: Date;
  maxDate: Date;

  presupuestOriginal!: number;
  recordatoriOriginal!: any;
  idEstadOriginal!: string;
  comentariOriginal!: string;

  constructor(
    private dataShared: DataSharedService,
    public dialog: MatDialog,
    private svManager: ManagerService,
    private printService: PrintService,
    private servicioEmpresa: ServicioEmpresaService,
    private router: Router,
    private _snackBar: PopupService,
    private authService: AuthService,
    private servicioService: ServicioService,
    private estadoService: EstadosService,
    private historicoEstado: HistoricoEstadoService,
  ) {
    this.servicioRecibido = this.getServicioLocalStorage();
    this.minDate = new Date();
    this.maxDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 6, this.minDate.getDate());

    // this.selectedEstado = this.servicioRecibido.estado; Borrar ?
    this.presupuestOriginal = this.servicioRecibido.total_presupuestado;
    this.recordatoriOriginal = this.servicioRecibido.fecha_notificacion;
    this.comentariOriginal = this.servicioRecibido.comentario;
    this.idEstadOriginal = this.servicioRecibido.estado;
  }

  ngOnInit() {
    this.setParams();
    this.getServicioById(this.servicioRecibido.idServicio);
    console.log('PRUEBA de RECURSIVIDAD');
  }

  getSvManager() {
    console.log('PRUEBA de RECURSIVIDAD 2');
    return this.svManager;
  }

  getServicioLocalStorage(): Servicios {
    console.log('PRUEBA de RECURSIVIDAD 3');
    return JSON.parse(localStorage.getItem('servicioRecibido') || '{}');
  }

  getServicioById(idServicio: number) {
    console.log('PRUEBA de RECURSIVIDAD 4');
    this.dataShared.mostrarSpinner();
    this.servicioService.getServicioById(idServicio)
      .subscribe(
        (data: Servicios) => {
          this.servicioRecibido = data;
          this.dataShared.ocultarSpinner();
        },
        () => {
          this.dataShared.ocultarSpinner();
        }
      )
  }

  setParams() {
    console.log('PRUEBA de RECURSIVIDAD 5');
    this.recurrencia = this.servicioRecibido.recurrencia;
    this.getContactoEmpresa();
    this.getEstados();
  }

  hayNotificados(): boolean {
    console.log('PRUEBA de RECURSIVIDAD 6');
    const notNotify = this.servicioRecibido.itemChecklistDto.some(item => item.notificado);
    const isPresentado = this.servicioRecibido.estado.toLowerCase() === 'presentado';
    console.log('Hay notificados ', notNotify, isPresentado, (notNotify && isPresentado))
    return notNotify && isPresentado;
  }

  blockLowOrder(estado: Estado): boolean {
    return estado.orden! < this.estadoMatch?.orden!;
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

  alertaNotificado() {
    console.log('PRUEBA de RECURSIVIDAD 7');
    this._snackBar.warnSnackBar('Hay ítems marcados como nofitificados')
  }

  enableMenuEdit(): boolean {
    console.log('PRUEBA de RECURSIVIDAD 8');
    return this.authService.isAdmin()
  }

  getAvance(): number {
    console.log('PRUEBA de RECURSIVIDAD 9');
    return this.getSvManager().calcularAvance(this.servicioRecibido.itemChecklistDto)
  }

  isEditable: boolean = false;
  editarServicio() {
    console.log('PRUEBA de RECURSIVIDAD 10');
    this.isEditable = this.authService.isAdmin();
  }

  checkDelete(): void {
    console.log('PRUEBA de RECURSIVIDAD 11');
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: { message: `¿Borrar el servicio ID: ${this.servicioRecibido.idServicio}?` }
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
    // Suscripción a Servicio Empresa para eliminar de manera lógica de la bd
    this.servicioEmpresa.deleteLogico(this.servicioRecibido.idServicio)
      .subscribe(
        () => {
          console.log('ServicioEmpresa Eliminado con éxito:'),
            this._snackBar.okSnackBar(`Servicio eliminado ID: ${this.servicioRecibido.idServicio}`),
            this.router.navigate(['/home']);
        },
        (error) => console.error('Error al eliminar el ServicioEmpresa:', error)
      );
  }

  private getContactoEmpresa() {
    this.printService.getContactoEmpresa(this.servicioRecibido.idCliente).subscribe(
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
    if (this.servicioRecibido.idCategoria != 3) {
      this.dataShared.setSharedObject(this.servicioRecibido);
      const dialogRef = this.dialog.open(ChecklistComponent);

      dialogRef.afterClosed().subscribe(() => {
        // Se ejecutará cuando se cierre el modal del checklist
        this.dataShared.setSharedObject(this.servicioRecibido);
        this.getServicioById(this.servicioRecibido.idServicio);
      });
    } else {
      this._snackBar.warnSnackBar(`El servicio ha ${this.servicioRecibido.categoria.toLowerCase()}`)
    }
  }

  // Lógica para los estados
  getEstados() {
    if (this.authService.isAdmin()) {
      this.dataShared.mostrarSpinner();
      this.estadoService.getStatusNotDeleted().subscribe(
        (data) => {
          this.estadosList = data;
          this.estadoMatch = this.estadosList.find(estado => estado.tipoEstado === this.servicioRecibido.estado);
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
  onEstadoChange() {
    this.estadoMatch = this.estadosList.find(estado => estado.tipoEstado === this.servicioRecibido.estado);
    this.checkEditable();
  }

  checkEditable(): boolean {
    /**
     * Todo Estado contiene un atributo llamado idCategoria.
     * La categoria "Finalizado" tiene el id: 3
     * Si la categoria del estado seleccionado es igual a 3 no se podrá editar el servicio
     */
    return this.estadoMatch?.idCategoria === 3;
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

    this.dataShared.mostrarSpinner();
    this.isEditable = !this.isEditable; // Cambiar estado booleano de isEditable
    let requestsCount = 0; // Inicializamos un contador de solicitudes

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
        this.getServicioById(this.servicioRecibido.idServicio);
        console.log('ACTUALIZACIONES FINALIZADAS OK')
      }
    };

    // Si estadoMatch no es nulo y los id no coinciden entonces hay cambios y ejecutar el addHistorico
    // Incrementar el contador de solicitudes antes de realizar cada solicitud

    if (this.estadoMatch && this.estadoMatch?.idEstado != this.servicioRecibido.idEstado) {
      requestsCount++;

      // Armo el objeto historico de estado
      let historicoEstado = new HistoricoEstado();
      historicoEstado.estadoIdEstado = this.estadoMatch?.idEstado;
      historicoEstado.servicioIdServicio = this.servicioRecibido.idServicio;
      this.dataShared.setSharedObject(this.servicioRecibido) //
      // Suscripción al servicio Historico Estado para agregar el último estado a la bd
      this.historicoEstado.addHistoricoEstado(historicoEstado)
        .subscribe(
          (response) => {
            console.log('Historico Estado actualizado OK:', response);
            this.blockOrder = true;
          },
          (error) => console.error('Error al agregar HistoricoEstado:', error),
          handleComplete, // Llamar a handleComplete después de completar la solicitud
        );
    } else {
      console.log('No hay cambios en el estado de servicio')
    }

    // Verificar si hay cambios en el presupuesto y ejecutar
    // Incrementar el contador de solicitudes antes de realizar cada solicitud
    if (this.presupuestOriginal != this.servicioRecibido.total_presupuestado) {

      requestsCount++;
      let servicioEmpresa = new ServicioEmpresa();
      servicioEmpresa.costoServicio = this.servicioRecibido.total_presupuestado;

      // Suscripción a Servicio Empresa para agregar el último estado a la bd
      this.servicioEmpresa.update(this.servicioRecibido.idServicio, servicioEmpresa)
        .subscribe(
          (response) => {
            console.log('Presupuesto actualizado OK:', response);
            this.dataShared.setSharedObject(this.servicioRecibido);
          },
          (error) => console.error('Error al actualizar ServicioEmpresa:', error),
          handleComplete // Llamar a handleComplete después de completar la solicitud
        );

    } else {
      console.log('No hay cambios en el presupuesto')
    }

    // Verificar si hay cambios en el servicio y ejecutar (Recordatorio, comentario)
    // Incrementar el contador de solicitudes antes de realizar cada solicitud

    if (this.recordatoriOriginal != this.servicioRecibido.fecha_notificacion ||
      this.comentariOriginal != this.servicioRecibido.comentario) {

      requestsCount++;
      let servicio: Servicio = new Servicio();
      servicio.fechaHoraAlertaVenc = this.servicioRecibido.fecha_notificacion ? new Date(this.servicioRecibido.fecha_notificacion) : undefined;
      servicio.comentario = this.servicioRecibido.comentario;
      //servicio.tipoServicioIdTipoServicio = this.servicioRecibido.idTipoServicio;

      this.servicioService.update(this.servicioRecibido.idServicio, servicio)
        .subscribe(
          (response) => {
            console.log('Se actualizó el comentario o recordatorio OK:', response);
            this.dataShared.setSharedObject(this.servicioRecibido);
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
