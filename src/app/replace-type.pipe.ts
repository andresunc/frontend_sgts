import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceType'
})
export class ReplaceTypePipe implements PipeTransform {

  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'ambiente':
        return 'AMBI';
      case 'habilitaciones':
        return 'HOL';
      case 'higiene y seguridad':
        return 'HYS';
      default:
        return value;
    }
  }

}