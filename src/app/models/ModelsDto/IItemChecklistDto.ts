export class ItemChecklistDto {
    
    idItemChecklist?: number;
    nombreItem?: string;
    inicioEstimado?: string;
    finEstimado?: string;
    ejecucion_real?: string;
    finReal?: string;
    notificado?: boolean;
    valorTasa?: number;
    hojas?: number;
    idRecurso?: number;
    responsable?: string;
    urlComprobante?: string;
    completo?: boolean;

    constructor(){}
}