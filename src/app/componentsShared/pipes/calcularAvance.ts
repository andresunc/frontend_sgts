import { Pipe, PipeTransform } from '@angular/core';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';

@Pipe({
  name: 'calcularAvance'
})
export class CalcularAvancePipe implements PipeTransform {

  transform(itemsChecklist: ItemChecklistDto[]): number {
    const totalItems = itemsChecklist.length;
    if (totalItems === 0) {
      return 0;
    }
    const completos = itemsChecklist.filter(item => item.completo).length;
    return (completos / totalItems * 100) | 0;
  }
}