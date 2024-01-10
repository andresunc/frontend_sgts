export class Servicios {
    id: number;
    tipo: string;
    cliente: string;
    rubro: string;
    estado: string;
    presentado?: boolean;
    avance?: number;
    recurrencia?: number;
    fecha_notificacion?: string;
    total_presupuestado?: number;
    comentario?: string;
    item_checklist: any;

    constructor(id: number, tipo: string, cliente: string, rubro: string, estado: string,
        presentado?: boolean, avance?: number, recurrencia?: number, fecha_notificacion?: string,
        total_presupuestado?: number, comentario?: string, item_checklist?: any) {
        this.id = id;
        this.tipo = tipo;
        this.cliente = cliente;
        this.rubro = rubro;
        this.estado = estado;
        this.presentado = presentado;
        this.avance = avance;
        this.recurrencia = recurrencia;
        this.fecha_notificacion = fecha_notificacion;
        this.total_presupuestado = total_presupuestado;
        this.comentario = comentario;
        this.item_checklist = item_checklist;
    }
}