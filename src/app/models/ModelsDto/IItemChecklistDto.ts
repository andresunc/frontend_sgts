export class ItemChecklistDto {
    
    idItemChecklist?: number;
    nombreItem?: string;
    inicioEstimado?: string;
    finEstimado?: string;
    ejecucion_real?: string;
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