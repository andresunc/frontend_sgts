import { ContactoEmpresa } from "../DomainModels/ContactoEmpresa";
import { Empresa } from "../DomainModels/Empresa";

export class EmpresaWithContacts {
    empresa?: Empresa;
    contactos?: ContactoEmpresa[];

    constructor(){}
}