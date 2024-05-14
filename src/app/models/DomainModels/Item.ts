export class Item {
    idItem?: number;
    tipoItemIdTipoItem?: number;
    rubroIdRubro?: number | null;
    dependenciaIdDependencia?: number | null;
    tipoServicioIdTipoServicio?: number | null;
    requisitoIdRequisito?: number | null;
    duracionEstandar?: number;
    desvioAcumulado?: number;
    contCambios?: number | null;
    eliminado?: boolean | null;
    descripcion?: string | null;

    constructor() {}
}