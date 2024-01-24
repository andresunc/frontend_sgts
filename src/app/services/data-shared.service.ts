import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharedService {

  private sharedObject: any;
  private sharedMessage: any;
  private sharedEstado: any[] = [];
  private sharedTipoServicio: any[] = [];
  private EventEmitter: EventEmitter<void> = new EventEmitter<void>();
  /* Atributos para el Spinner */
  private spinner = new BehaviorSubject<boolean>(false);
  goSpinner = this.spinner.asObservable();

  constructor() { }

  setSharedObject(data: any) {
    this.sharedObject = data;
  }

  getSharedObject() {
    return this.sharedObject;
  }

  setSharedMessage(data: any) {
    this.sharedMessage = data;
  }

  getSharedMessage() {
    return this.sharedMessage;
  }

  setSharedEstado(data: any) {
    this.sharedEstado = data;
  }

  getSharedEstado() {
    return this.sharedEstado;
  }

  triggerFuncionEmitida() {
    this.EventEmitter.emit();
  }

  getFuncionEmitida() {
    return this.EventEmitter;
  }

  setSharedTipoServicio(data: any) {
    this.sharedTipoServicio = data;
  }

  getSharedTipoServicio() {
    return this.sharedTipoServicio;
  }

  /* Funciones del Spinner */
  mostrarSpinner() {
    this.spinner.next(true);
  }

  ocultarSpinner() {
    this.spinner.next(false);
  }
}
