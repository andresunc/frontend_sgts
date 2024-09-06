import ManagerService from "src/app/services/SupportServices/ManagerService";
import { ItemChecklistDto } from "../ModelsDto/IItemChecklistDto";

/**
 * Esta clase hace referencia al modelo de datos de ServiciosDTO
 */
export class Servicios {

    idServicio: number;
    idTipoServicio: number;
    fecha_alta: string;
    idRecurso: number;
    tipo: string;
    idCliente: number;
    cliente: string;
    idEstado: number;
    estado: string;
    idCategoria: number;
    categoria: string;
    recurrencia: number;
    referencia: number;
    fecha_notificacion: string;
    idRubro: number;
    rubro: string;
    idServicioEmpresa: number;
    total_presupuestado: number;
    fullname_responsable: string;
    comentario: string;
    expediente: string;
    vencido?: number;
    itemChecklistDto: ItemChecklistDto[];
    svManager!: ManagerService;

    constructor(idServicio: number, idTipoServicio: number, fecha_alta: string, idRecurso: number, tipo: string, idCliente: number,
        cliente: string, idEstado: number, estado: string, idCategoria: number, categoria: string,
        recurrencia: number, referencia: number, fecha_notificacion: string, idRubro: number, rubro: string,
        idServicioEmpresa: number, total_presupuestado: number, fullname_responsable: string, comentario: string, expediente: string, itemChecklistDto: ItemChecklistDto[]) {
        this.idServicio = idServicio;
        this.idTipoServicio = idTipoServicio;
        this.fecha_alta = fecha_alta;
        this.idRecurso = idRecurso;
        this.tipo = tipo;
        this.idCliente = idCliente;
        this.cliente = cliente;
        this.idEstado = idEstado;
        this.estado = estado;
        this.idCategoria = idCategoria;
        this.categoria = categoria;
        this.recurrencia = recurrencia;
        this.referencia = referencia;
        this.recurrencia = recurrencia;
        this.fecha_notificacion = fecha_notificacion;
        this.idRubro = idRubro;
        this.rubro = rubro;
        this.idServicioEmpresa = idServicioEmpresa;
        this.total_presupuestado = total_presupuestado;
        this.fullname_responsable = fullname_responsable;
        this.comentario = comentario;
        this.expediente = expediente;
        this.itemChecklistDto = itemChecklistDto;
    }

    checkItemsCompletos(): boolean {
        // Verificar si todos los items del checklist están completos
        return this.itemChecklistDto.every(item => item.completo === true);
    }

}