import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eficiencia'
})
export class EficienciaPipe implements PipeTransform {

  // Analisis de aficiencia 
  transform(strRebote: number): string {

    if (strRebote > 0) {
      return `Aumentó ${strRebote}%`;
    }
    if (strRebote < 0) {
      return `Disminuyó ${strRebote}%`;
    }
    if (strRebote === 0) {
      return `Sin cambios`;
    }
    return 'N/A';
  }
}