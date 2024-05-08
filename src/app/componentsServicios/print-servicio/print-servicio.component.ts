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
import { EditorComponent } from './editor/editor.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ServicioEmpresaService } from 'src/app/services/DomainServices/servicio-empresa.service';
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
import { ServicioEntityService } from 'src/app/services/DomainServices/servicio-entity.service';

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

    this.selectedEstado = this.servicioRecibido.estado;
    this.presupuestOriginal = this.servicioRecibido.total_presupuestado;
    this.recordatoriOriginal = this.servicioRecibido.fecha_notificacion;
    this.comentariOriginal = this.servicioRecibido.comentario;
    this.idEstadOriginal = this.servicioRecibido.estado;
  }

  ngOnInit() {
    this.setParams();
    this.getServicioById(this.servicioRecibido.idServicio);
  }

  getSvManager() {
    return this.svManager;
  }

  getServicioLocalStorage(): Servicios {
    return JSON.parse(localStorage.getItem('servicioRecibido') || '{}');
  }

  getServicioById(idServicio: number) {
    this.dataShared.mostrarSpinner();
    this.servicioService.getServicioById(idServicio)
      .subscribe(
        (data: Servicios) => {
          this.servicioRecibido = data;
          this.dataShared.ocultarSpinner();
        }
      )
  }

  setParams() {
    this.recurrencia = this.servicioRecibido.recurrencia;
    this.getContactoEmpresa();
    this.getEstados();
  }

  enableMenuEdit(): boolean {
    return this.authService.isAdmin()
  }

  getAvance(): number {
    return this.getSvManager().calcularAvance(this.servicioRecibido.itemChecklistDto)
  }

  authorized: boolean = false;
  completed: boolean = false;
  editarServicio() {
    this.authorized = this.authService.isAdmin();
    this.completed = this.servicioRecibido.idCategoria === 3;

    /**
     *
    this.dataShared.setSharedObject(this.servicioRecibido);
    const dialogRef = this.dialog.open(EditorComponent, {
      data: { servicioRecibido: this.servicioRecibido } //
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getServicioById(this.servicioRecibido.idServicio);
    });
     */
  }

  checkDelete(): void {
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
            this._snackBar.errorSnackBar(`Servicio eliminado ID: ${this.servicioRecibido.idServicio}`),
            this.router.navigate(['/home']);
        },
        (error) => console.error('Error al eliminar el ServicioEmpresa:', error)
      );
  }

  private getContactoEmpresa() {
    this.printService.getContactoEmpresa(this.servicioRecibido.idCliente).subscribe(
      (data) => {
        this.contactoEmpresa = data;
        console.log('Contactos de la empresa: ', data);
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

  getEstados() {
    if (this.authService.isAdmin()) {
      this.dataShared.mostrarSpinner();
      this.estadoService.getStatusNotDeleted().subscribe(
        (data) => {
          this.estadosList = data;
          this.estadoMatch = this.estadosList.find(estado => estado.tipoEstado === this.selectedEstado);
          //this.checkEditable();
          console.log('Estados cargados OK');
          this.dataShared.ocultarSpinner();
        })
    } else {
      console.log('No es admin, no se cargaron los estados para el edit');
    }
  }

  estadoMatch: Estado | undefined;
  onEstadoChange() {
    this.estadoMatch = this.estadosList.find(estado => estado.tipoEstado === this.selectedEstado);
    // this.checkEditable();
  }

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

  loadChanges() {

    this.dataShared.mostrarSpinner();

    let requestsCount = 0; // Inicializamos un contador de solicitudes

    const handleComplete = () => {
      requestsCount--;
      if (requestsCount === 0) {
        this.dataShared.ocultarSpinner(); // Ocultar el spinner y actuazlizar obj cuando no haya más solicitudes en curso
        this.getServicioById(this.servicioRecibido.idServicio)
      }
    };

    // Si estadoMatch no es nulo y los id no coinciden entonces hay cambios y ejecutar el addHistorico
    // Incrementar el contador de solicitudes antes de realizar cada solicitud
    requestsCount++;
    if (this.estadoMatch && this.estadoMatch?.idEstado != this.servicioRecibido.idEstado) {

      // Armo el objeto historico de estado
      let historicoEstado = new HistoricoEstado();
      historicoEstado.estadoIdEstado = this.estadoMatch?.idEstado;
      historicoEstado.servicioIdServicio = this.servicioRecibido.idServicio;
      this.dataShared.setSharedObject(this.servicioRecibido) //
      // Suscripción al servicio Historico Estado para agregar el último estado a la bd
      this.historicoEstado.addHistoricoEstado(historicoEstado)
        .subscribe(
          (response) => {
            console.log('HistoricoEstado agregado con éxito:', response);
          },
          (error) => console.error('Error al agregar HistoricoEstado:', error),
          handleComplete, // Llamar a handleComplete después de completar la solicitud
        );
    } else {
      console.log('No hay cambios en el estado de servicio')
    }

    // Verificar si hay cambios en el presupuesto y ejecutar
    // Incrementar el contador de solicitudes antes de realizar cada solicitud
    requestsCount++;
    if (this.presupuestOriginal != this.servicioRecibido.total_presupuestado) {

      let servicioEmpresa = new ServicioEmpresa();
      servicioEmpresa.costoServicio = this.servicioRecibido.total_presupuestado;

      // Suscripción a Servicio Empresa para agregar el último estado a la bd
      this.servicioEmpresa.update(this.servicioRecibido.idServicio, servicioEmpresa)
        .subscribe(
          (response) => {
            console.log('ServicioEmpresa actualizado con éxito:', response);
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
    requestsCount++;
    if (this.recordatoriOriginal != this.servicioRecibido.fecha_notificacion ||
      this.comentariOriginal != this.servicioRecibido.comentario) {

      let servicio: Servicio = new Servicio();
      servicio.fechaHoraAlertaVenc = new Date(this.servicioRecibido.fecha_notificacion);
      servicio.comentario = this.servicioRecibido.comentario;
      //servicio.tipoServicioIdTipoServicio = this.servicioRecibido.idTipoServicio;

      this.servicioService.update(this.servicioRecibido.idServicio, servicio)
        .subscribe(
          (response) => {
            console.log('Servicio actualizado con éxito:', response);
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
