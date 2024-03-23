export class EmpresaDto {

    idEmpresa?: number;
    idRubro?: number;
    rubro?: string;
    idRiesgo?: number;
    riesgo?: string;
    cliente?: string;
    cuit?: string;
    direccion?: string;

    /**
    constructor(idRubro: number, rubro: string, idRiesgo: number, riesgo: string, cliente: string, cuit: string, direccion: string) {
        this.idRubro = idRubro;
        this.rubro = rubro;
        this.idRiesgo = idRiesgo;
        this.riesgo = riesgo;
        this.cliente = cliente;
        this.cuit = cuit;
        this.direccion = direccion;
    }
    */
}