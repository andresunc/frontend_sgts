import { Injectable } from '@angular/core';
import { ContactoEmpresaService } from './DomainServices/contacto-empresa.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  
  constructor(private contacto: ContactoEmpresaService) { }

  // Método para consultar los contactos de una empresa
  getContactoEmpresa(idEmpresa: number) {
    return this.contacto.getContactoEmpresa(idEmpresa)
  }
}
