export class Item {
    idItem?: number;
    tipoItemIdTipoItem?: number;//
    rubroIdRubro?: number | null;//
    dependenciaIdDependencia?: number | null;
    tipoServicioIdTipoServicio?: number;//
    requisitoIdRequisito?: number;
    duracionEstandar?: number;
    desvioAcumulado?: number;
    contCambios?: number | null;
    eliminado?: boolean | null;
    descripcion?: string | null;

    constructor() {}
}