import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { HistoricoEstado } from 'src/app/models/DomainModels/HistoricoEstado';
import { ServicioEmpresa } from 'src/app/models/DomainModels/ServicioEmpresa';
import { EstadosService } from 'src/app/services/DomainServices/estados.service';
import { HistoricoEstadoService } from 'src/app/services/DomainServices/historico-estado.service';
import { ServicioEmpresaService } from 'src/app/services/DomainServices/servicio-empresa.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  estadosList!: Estado[];
  selectedEstado!: string;
  presupuestOriginal!: number;

  // inyecto el servicio recibido desde print
  constructor(
    private _snackBar: PopupService,
    private estadoService: EstadosService,
    private historicoEstado: HistoricoEstadoService,
    private servicioEmpresa: ServicioEmpresaService,
    public dialogRef: MatDialogRef<EditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedEstado = this.data.servicioRecibido.estado;
    this.presupuestOriginal = this.data.servicioRecibido.total_presupuestado;
  }

  ngOnInit(): void {
    this.setDateTime();
    this.estadoService.getStatusNotDeleted().subscribe(
      (data) => {
        this.estadosList = data;
        console.log(data)
      })

  }

  onEstadoChange() {
    this.data.servicioRecibido.estado = this.selectedEstado;
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
      this.data.servicioRecibido.fecha_notificacion = "";
    }
  }

  loadChanges() {

    // Busco el obj Estado que coincida con el estado seleccionado
    let estadoEncontrado = this.estadosList.find(estado => estado.tipoEstado === this.selectedEstado);

    // Verificar si hay cambios en el estado y ejecutar
    if (estadoEncontrado?.idEstado != this.data.servicioRecibido.idEstado) {

      // Armo el objeto historico de estado
      let historicoEstado = new HistoricoEstado();
      historicoEstado.estadoIdEstado = estadoEncontrado?.idEstado;
      historicoEstado.servicioIdServicio = this.data.servicioRecibido.idServicio;

      // Suscripción al servicio Historico Estado para agregar el último estado a la bd
      this.historicoEstado.addHistoricoEstado(historicoEstado)
        .subscribe(
          (response) => console.log('HistoricoEstado agregado con éxito:', response),
          (error) => console.error('Error al agregar HistoricoEstado:', error)
        );

    } else {
      console.log('No hay cambios en el estado de servicio')
    }

    // Verificar si hay cambios en el presupuesto y ejecutar
    if (this.presupuestOriginal != this.data.servicioRecibido.total_presupuestado) {

      let servicioEmpresa = new ServicioEmpresa();
      servicioEmpresa.costoServicio = this.data.servicioRecibido.total_presupuestado;

      // Suscripción a Servicio Empresa para agregar el último estado a la bd
      this.servicioEmpresa.update(this.data.servicioRecibido.idServicio, servicioEmpresa)
        .subscribe(
          (response) => console.log('ServicioEmpresa actualizado con éxito:', response),
          (error) => console.error('Error al actualizar ServicioEmpresa:', error)
        );

    } else {
      console.log('No hay cambios en el presupuesto')
    }

    // Me queda actualizar esto
    console.log('Fecha y hora de notificación:', this.data.servicioRecibido.fecha_notificacion);
    console.log('Comentario:', this.data.servicioRecibido.comentario);
  }

}