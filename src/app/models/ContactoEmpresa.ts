export class ContactoEmpesa {
    idContactoEmpresa: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    empresaIdEmpresa: number;

    constructor(idContactoEmpresa: number, nombre: string, apellido: string, telefono: string, email: string, empresaIdEmpresa: number) {
        this.idContactoEmpresa = idContactoEmpresa;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.empresaIdEmpresa = empresaIdEmpresa;
    }

}