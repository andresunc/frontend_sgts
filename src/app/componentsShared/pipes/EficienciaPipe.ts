import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eficiencia'
})
export class EficienciaPipe implements PipeTransform {

  // Analisis de aficiencia 
  transform(strEficiencia: number): string {

    if (strEficiencia === Infinity || strEficiencia === -Infinity) {
      return 'N/A';
    }
    if (strEficiencia > 0) {
      return `Aumentó ${strEficiencia}%`;
    }
    if (strEficiencia < 0) {
      return `Disminuyó ${strEficiencia}%`;
    }
    return 'N/A';
  }
}