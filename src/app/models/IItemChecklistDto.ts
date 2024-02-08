export class ItemChecklistDto {
    idItemChecklist: number;
    nombreItem: string;
    inicioEstimado: string;
    finEstimado: string;
    ejecucion_real: string;
    finReal: string;
    notificado: boolean;
    valorTasa: number;
    hojas: number;
    responsable: string;
    urlComprobante: string;
    completo: boolean;

    constructor(idItemChecklist: number,nombreItem: string, inicioEstimado: string, finEstimado: string,
        ejecucion_real: string, finReal: string, notificado: boolean, valorTasa: number,
        hojas: number, responsable: string, urlComprobante: string, completo: boolean) {
        this.idItemChecklist = idItemChecklist;
        this.nombreItem = nombreItem;
        this.inicioEstimado = inicioEstimado;
        this.finEstimado = finEstimado;
        this.ejecucion_real = ejecucion_real;
        this.finReal = finReal;
        this.notificado = notificado;
        this.valorTasa = valorTasa;
        this.hojas = hojas;
        this.responsable = responsable;
        this.urlComprobante = urlComprobante;
        this.completo = completo;
    }
}