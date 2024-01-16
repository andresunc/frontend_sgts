import { ItemChecklistDto } from "./IItemChecklistDto";

export class Servicios {

    id?: number;
    tipo?: string;
    cliente?: string;
    idEstado?: number;
    estado?: string;
    recurrencia?: number;
    referencia?: number;
    fecha_notificacion?: string;
    rubro?: string;
    total_presupuestado?: number;
    comentario?: string;
    ItemChecklist: ItemChecklistDto[] = [];

    constructor(id: number, tipo: string, cliente: string, idEstado: number, estado: string,
        recurrencia: number, referencia: number, fecha_notificacion?: string, rubro?: string,
        total_presupuestado?: number, comentario?: string, itemChecklist?: any) {
        this.id = id;
        this.tipo = tipo;
        this.cliente = cliente;
        this.idEstado = idEstado;
        this.estado = estado;
        this.recurrencia = recurrencia;
        this.referencia = referencia;
        this.recurrencia = recurrencia;
        this.fecha_notificacion = fecha_notificacion;
        this.rubro = rubro;
        this.total_presupuestado = total_presupuestado;
        this.comentario = comentario;
        this.ItemChecklist = itemChecklist;
    }
}