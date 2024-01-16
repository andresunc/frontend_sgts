export class ItemChecklistDto {
    nombre_item?: string;
    inicio_estimado?: string;
    fin_estimado?: string;
    ejecucion_real?: string;
    fin_real?: string;
    notificado?: boolean;
    valor_tasa?: number;
    hojas?: number;
    responsable?: string;
    url_comprobante?: string;

    constructor(nombre_item?: string, inicio_estimado?: string, fin_estimado?: string,
        ejecucion_real?: string, fin_real?: string, notificado?: boolean, valor_tasa?: number,
        hojas?: number, responsable?: string, url_comprobante?: string) {
        this.nombre_item = nombre_item;
        this.inicio_estimado = inicio_estimado;
        this.fin_estimado = fin_estimado;
        this.ejecucion_real = ejecucion_real;
        this.fin_real = fin_real;
        this.notificado = notificado;
        this.valor_tasa = valor_tasa;
        this.hojas = hojas;
        this.responsable = responsable;
        this.url_comprobante = url_comprobante;
    }
}