import { ItemChecklistDto } from "./IItemChecklistDto";

/**
 * Esta clase hace referencia al modelo de datos de ServiciosDTO
 */
export class Servicios {

    idServicio: number;
    idTipoServicio: number;
    tipo: string;
    idCliente: number;
    cliente: string;
    idEstado: number;
    estado: string;
    recurrencia: number;
    referencia: number;
    fecha_notificacion: string;
    idRubro: number;
    rubro: string;
    idServicioEmpresa: number;
    total_presupuestado: number;
    comentario: string;
    itemChecklistDto: ItemChecklistDto[];

    constructor(idServicio: number, idTipoServicio: number,tipo: string, idCliente: number,cliente: string, idEstado: number, estado: string,
        recurrencia: number, referencia: number, fecha_notificacion: string, idRubro: number,rubro: string,
        idServicioEmpresa: number,total_presupuestado: number, comentario: string, itemChecklistDto: ItemChecklistDto[]) {
        this.idServicio = idServicio;
        this.idTipoServicio = idTipoServicio;
        this.tipo = tipo;
        this.idCliente = idCliente;
        this.cliente = cliente;
        this.idEstado = idEstado;
        this.estado = estado;
        this.recurrencia = recurrencia;
        this.referencia = referencia;
        this.recurrencia = recurrencia;
        this.fecha_notificacion = fecha_notificacion;
        this.idRubro = idRubro;
        this.rubro = rubro;
        this.idServicioEmpresa = idServicioEmpresa;
        this.total_presupuestado = total_presupuestado;
        this.comentario = comentario;
        this.itemChecklistDto = itemChecklistDto;
    }
}