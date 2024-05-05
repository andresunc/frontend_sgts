export class ItemChecklistDto {
    
    idItemChecklist?: number;
    nombreItem?: string;
    inicioEstimado?: string;
    finEstimado?: string;
    horasDesvio?: number;
    finReal?: string;
    notificado?: boolean;
    tasaValor?: number;
    tasaCantidadHojas?: number;
    idRecurso?: number;
    responsable?: string;
    urlComprobanteTasa?: string;
    completo?: boolean;

    constructor(){}
}