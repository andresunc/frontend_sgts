export class ServicioEmpresa {
    idServicioEmpresa?: number;
    costoServicio?: number;
    alta?: Date;
    servicioIdServicio?: number;
    empresaIdEmpresa?: number;
    recursoGgIdRecursoGg?: number;
    eliminado?: boolean;

    constructor() {}

    /**
    constructor(idServicioEmpresa: number, costoServicio: number, servicioIdServicio: number, empresaIdEmpresa: number, recursoGgIdRecursoGg: number) {
        this.idServicioEmpresa = idServicioEmpresa;
        this.costoServicio = costoServicio;
        this.alta = new Date(); // Fecha actual automatica
        this.servicioIdServicio = servicioIdServicio;
        this.empresaIdEmpresa = empresaIdEmpresa;
        this.recursoGgIdRecursoGg = recursoGgIdRecursoGg;
        this.eliminado = false;
    }
    */
}