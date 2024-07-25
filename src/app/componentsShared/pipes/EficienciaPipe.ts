import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eficiencia'
})
export class EficienciaPipe implements PipeTransform {

  // Analisis de aficiencia 
  transform(value: string): string {
    const strRebote = parseFloat(value);

    if (strRebote > 0) {
      return `Disminuyó ${value}%`;
    }
    if (strRebote < 0) {
      return `Aumentó ${value}%`;
    }
    if (strRebote === 0) {
      return `Sin cambios`;
    }
    return 'N/A';
  }
}