export class Estado {
    
    idEstado!: number;
    tipoEstado: string;

    constructor(estado: string) {
        this.tipoEstado = estado;
    }
}