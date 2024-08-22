import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceEstado'
})
export class ReplaceEstadoPipe implements PipeTransform {

  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'presupuesto rechazado':
        return 'RECHAZADO';
      default:
        return value;
    }
  }

}