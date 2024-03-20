export class ServicioEnCurso {
    idServicio: number;
    empresa: string;
    rubro: string;
    tipoServicio: string;
    dependenciaInvolucrada: string;
    estado: string;
    porcentajeAvance: number;

    constructor(idServicio: number, empresa: string, rubro: string, tipoServicio: string, dependenciaInvolucrada: string, estado: string, porcentajeAvance: number) {
        this.idServicio = idServicio;
        this.empresa = empresa;
        this.rubro = rubro;
        this.tipoServicio = tipoServicio;
        this.dependenciaInvolucrada = dependenciaInvolucrada;
        this.estado = estado;
        this.porcentajeAvance = porcentajeAvance;
    }
}