/**
 * Clase HistoricoEstado que representa la tabla Historico de Estados
 */

export class HistoricoEstado {
    idHistoricoEstado?: number;
    fecha?: Date;
    servicioIdServicio?: number;
    estadoIdEstado?: number;

    constructor() {}

    /**
    constructor(idHistoricoEstado: number, servicioIdServicio: number, estadoIdEstado: number) {
        this.idHistoricoEstado = idHistoricoEstado;
        this.fecha = new Date(); // Fecha y hora actual automatica
        this.servicioIdServicio = servicioIdServicio;
        this.estadoIdEstado = estadoIdEstado;
    }
     */
}