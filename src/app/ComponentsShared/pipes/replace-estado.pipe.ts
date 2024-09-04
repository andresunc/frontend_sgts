import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceEstado'
})
export class ReplaceEstadoPipe implements PipeTransform {

  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'presupuesto rechazado':
        return 'P. RECHAZADO';
      case 'presupuesto emitido':
        return 'P. EMITIDO';
      case 'presupuesto aprobado':
        return 'P. APROBADO';
      default:
        return value;
    }
  }

}