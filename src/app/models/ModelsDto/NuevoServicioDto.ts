import { HistoricoEstado } from "../DomainModels/HistoricoEstado";
import { ItemChecklist } from "../DomainModels/ItemChecklist";
import { Servicio } from "../DomainModels/Servicio";
import { ServicioEmpresa } from "../DomainModels/ServicioEmpresa";

export class NuevoServicioDto {
    
    servicio?: Servicio;
    historicoEstado?: HistoricoEstado;
    servicioEmpresa?: ServicioEmpresa;
    itemChecklist?: ItemChecklist;

    constructor() {}

}