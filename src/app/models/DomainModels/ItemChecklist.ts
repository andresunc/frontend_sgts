export class ItemChecklist {
    inicioEstandar: Date;
    finEstandar: Date;
    inicioConDesvio: Date;
    finConDesvio: Date;
    notificado: boolean;
    tasaValor: number;
    tasaCantidadHojas: number;
    urlComprobanteTasa: string;
    servicioIdServicio: number;
    recursoGgIdRecursoGg: number;
    itemIdItem: number;
    completo: boolean;

    constructor(inicioEstandar: Date, finEstandar: Date, inicioConDesvio: Date, finConDesvio: Date, notificado: boolean, tasaValor: number, tasaCantidadHojas: number, urlComprobanteTasa: string, servicioIdServicio: number, recursoGgIdRecursoGg: number, itemIdItem: number, completo: boolean) {
        this.inicioEstandar = inicioEstandar;
        this.finEstandar = finEstandar;
        this.inicioConDesvio = inicioConDesvio;
        this.finConDesvio = finConDesvio;
        this.notificado = notificado;
        this.tasaValor = tasaValor;
        this.tasaCantidadHojas = tasaCantidadHojas;
        this.urlComprobanteTasa = urlComprobanteTasa;
        this.servicioIdServicio = servicioIdServicio;
        this.recursoGgIdRecursoGg = recursoGgIdRecursoGg;
        this.itemIdItem = itemIdItem;
        this.completo = completo;
    }
}