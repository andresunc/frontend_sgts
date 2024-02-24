import { HistoricoEstado } from "../models/HistoricoEstado";
import { ItemChecklist } from "../models/ItemChecklist";
import { Servicio } from "../models/Servicio";
import { ServicioEmpresa } from "../models/ServicioEmpresa";

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