/**
 * Modelo de la tabla Servicio
 */

export class Servicio {
    idServicio: number;
    fechaVencExpediente: Date;
    fechaHoraAlertaVenc: Date;
    recurrencia: number;
    referenciaIdServicio: number;
    tipoServicioIdTipoServicio: number;
    comentario: string;
    expediente: string;

    constructor(idServicio: number, fechaVencExpediente: Date, fechaHoraAlertaVenc: Date, recurrencia: number, referenciaIdServicio: number, tipoServicioIdTipoServicio: number, comentario: string, expediente: string) {
        this.idServicio = idServicio;
        this.fechaVencExpediente = fechaVencExpediente;
        this.fechaHoraAlertaVenc = fechaHoraAlertaVenc;
        this.recurrencia = recurrencia;
        this.referenciaIdServicio = referenciaIdServicio;
        this.tipoServicioIdTipoServicio = tipoServicioIdTipoServicio;
        this.comentario = comentario;
        this.expediente = expediente;
    }
}