import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { HistoricoEstado } from 'src/app/models/DomainModels/HistoricoEstado';
import { Servicio } from 'src/app/models/DomainModels/Servicio';
import { ServicioEmpresa } from 'src/app/models/DomainModels/ServicioEmpresa';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { EstadosService } from 'src/app/services/DomainServices/estados.service';
import { HistoricoEstadoService } from 'src/app/services/DomainServices/historico-estado.service';
import { ServicioEmpresaService } from 'src/app/services/DomainServices/servicio-empresa.service';
import { ServicioService } from 'src/app/services/ServiciosDto/ServicioService';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { ValideishonService } from 'src/app/valideishon.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  estadosList!: Estado[];
  selectedEstado!: string;
  presupuestOriginal!: number;
  recordatoriOriginal!: any;
  idEstadOriginal!: string;
  comentariOriginal!: string;
  servicioRecibido!: Servicios;

  // inyecto el servicio recibido desde print
  constructor(
    private _snackBar: PopupService,
    private estadoService: EstadosService,
    private historicoEstado: HistoricoEstadoService,
    private servicioEmpresa: ServicioEmpresaService,
    private servicioService: ServicioService,
    private dataShared: DataSharedService,
    public dialogRef: MatDialogRef<EditorComponent>,
    public valideishon: ValideishonService,
  ) {
    this.servicioRecibido = this.dataShared.getSharedObject();
    this.selectedEstado = this.servicioRecibido.estado;
    this.presupuestOriginal = this.servicioRecibido.total_presupuestado;
    this.recordatoriOriginal = this.servicioRecibido.fecha_notificacion;
    this.comentariOriginal = this.servicioRecibido.comentario;
    this.idEstadOriginal = this.servicioRecibido.estado;
  }

  ngOnInit(): void {
    this.setDateTime();
    this.dataShared.mostrarSpinner();
    this.estadoService.getStatusNotDeleted().subscribe(
      (data) => {
        this.estadosList = data;
        this.estadoMatch = this.estadosList.find(estado => estado.tipoEstado === this.selectedEstado);
        this.checkEditable();
        this.dataShared.ocultarSpinner();
      })
  }

  checkEditable(): boolean {
    // Estado contiene un idCategoria
    // La categoria "Finalizado" tiene el id: 3
    // Si la categoria del estado seleccionado es igual a 3 no se podrá editar el servicio
    return this.estadoMatch?.idCategoria === 3;
  }

  estadoMatch: Estado | undefined;
  onEstadoChange() {
    this.estadoMatch = this.estadosList.find(estado => estado.tipoEstado === this.selectedEstado);
    this.checkEditable();
  }

  minDate: any;
  setDateTime() {
    const fullDate = new Date();
    var date = fullDate.getDate();
    var nDate = (date < 10) ? '0' + date : date;
    var month = fullDate.getMonth() + 1;
    var nMonth = (month < 10) ? '0' + month : month;
    var year = fullDate.getFullYear();
    var hours = fullDate.getHours();
    var nHours = (hours < 10) ? '0' + hours : hours;
    var minutes = fullDate.getMinutes();
    var nMinutes = (minutes < 10) ? '0' + minutes : minutes;
    // Establecer la fecha mínima como la fecha actual
    this.minDate = year + '-' + nMonth + '-' + nDate + 'T' + nHours + ':' + nMinutes;
  }

  handleChange(event: any) {
    const value = event.target.value;
    if (value != null) {
      this.onChange(value);
    }
  }

  onChange(value: any) {
    var currenTime = new Date().getTime();
    var selectedTime = new Date(value).getTime();

    if (selectedTime < currenTime) {
      this._snackBar.errorSnackBar("Tu selección es menor al momento actual");
      this.servicioRecibido.fecha_notificacion = "";
    }
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
        this.dataShared.ocultarSpinner(); // Ocultar el spinner cuando no haya más solicitudes en curso
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
            this.dataShared.setSharedObject(this.servicioRecibido);
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