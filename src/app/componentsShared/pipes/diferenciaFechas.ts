import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diferenciaFechas'
})
export class DiferenciaFechasPipe implements PipeTransform {

  transform(fecha_alta: string): string {
    const fechaActual = new Date();
    const fechaAlta = new Date(fecha_alta);
    const diffTiempo = Math.abs(fechaActual.getTime() - fechaAlta.getTime());
    const diffSegundos = Math.floor(diffTiempo / 1000);
    const diffMinutos = Math.floor(diffSegundos / 60);
    const diffHoras = Math.floor(diffMinutos / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffDias === 0 && diffHoras === 0 && diffMinutos < 1) {
      return 'unos segundos';
    } else if (diffDias === 0 && diffHoras === 0) {
      return `${diffMinutos} min`;
    } else if (diffDias === 0) {
      return `${diffHoras} hora${diffHoras !== 1 ? 's' : ''}`;
    } else if (diffDias === 1) {
      return '1 día';
    } else {
      return `${diffDias} día${diffDias !== 1 ? 's' : ''}`;
    }
    /* Comente esto porque mostrar los meses y dias modifica mucho el ancho de los renglones de la tabla 
    pero sino te gusta los volvemos.
    
    } else if (diffDias < 30) {
      return `${diffDias} día${diffDias !== 1 ? 's' : ''}`;
    } else {
      const diffMeses = Math.floor(diffDias / 30);
      const diasAdicionales = diffDias % 30;
      if (diasAdicionales === 0) {
        return `${diffMeses} mes${diffMeses !== 1 ? 'es' : ''}`;
      } else {
        return `${diffMeses} mes${diffMeses !== 1 ? 'es' : ''} y ${diasAdicionales} día${diasAdicionales !== 1 ? 's' : ''}`;
      }*/
    }
  }

