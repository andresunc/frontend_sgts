import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Servicios } from '../models/DomainModels/Servicios';

@Injectable({
  providedIn: 'root'
})
export class DataSharedService {

  private sharedObject: any;
  private sharedMessage: any;
  private sharedEstado: any[] = [];
  private sharedTipoServicio: any[] = [];
  private filterByCheckbox: EventEmitter<void> = new EventEmitter<void>();
  private ControlAccess: EventEmitter<void> = new EventEmitter<void>();
  private spinner = new BehaviorSubject<boolean>(false);
  goSpinner = this.spinner.asObservable();

  private updateChecklistSubject = new BehaviorSubject<void>(undefined);
  updateChecklist$ = this.updateChecklistSubject.asObservable();


  constructor() { }

  triggerUpdateChecklist() {
    this.updateChecklistSubject.next();
  }
    
  setSharedObject(servicio: Servicios) {
    this.sharedObject = servicio;
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

  triggerFilterByCheckbox() {
    this.filterByCheckbox.emit();
  }

  getFilterByCheckbox() {
    return this.filterByCheckbox;
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

  triggerControlAccess() {
    this.ControlAccess.emit();
  }

  getControlAccess() {
    return this.ControlAccess;
  }

}
