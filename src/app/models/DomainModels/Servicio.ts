/**
 * Modelo de la tabla Servicio
 */

export class Servicio {
    idServicio?: number;
    fechaVencExpediente?: Date;
    fechaHoraAlertaVenc?: Date;
    recurrencia?: number;
    referenciaIdServicio?: number;
    tipoServicioIdTipoServicio?: number;
    comentario?: string;
    expediente?: string;

    constructor(){}

}