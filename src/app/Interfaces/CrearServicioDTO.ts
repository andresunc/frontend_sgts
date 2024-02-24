import { HistoricoEstado } from "../models/DomainModels/HistoricoEstado";
import { ItemChecklist } from "../models/DomainModels/ItemChecklist";
import { Servicio } from "../models/DomainModels/Servicio";
import { ServicioEmpresa } from "../models/DomainModels/ServicioEmpresa";

/**
 * Clase CrearServicioDTO que representa el objeto de transferencia 
 * de datos para la creacion de un servicio
 */

export interface CrearServicioDTO {
  servicio: Servicio;
  historicoEstado: HistoricoEstado;
  servicioEmpresa: ServicioEmpresa;
  itemChecklist: ItemChecklist[] | null;
}