import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eficiencia'
})
export class EficienciaPipe implements PipeTransform {

  transform(value: string): string {
    const numericValue = parseFloat(value);

    if (numericValue > 0) {
      return `Aumentó ${value}%`;
    }
    if (numericValue < 0) {
      return `Disminuyó ${value}%`;
    }
    if (numericValue === 0) {
      return `Sin cambios`;
    }
    return 'N/A';
  }
}