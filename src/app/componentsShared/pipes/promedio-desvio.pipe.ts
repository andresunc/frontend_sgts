import { Pipe, PipeTransform } from '@angular/core';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import { Params } from 'src/app/models/Params';

@Pipe({
  name: 'promedioDesvio',
  pure: false
})
export class PromedioDesvioPipe implements PipeTransform {

  transform(servicio: Servicios): number {

    const items = servicio.itemChecklistDto;
    const fechaActual = new Date();
    const params = new Params();

    const itemsValidos = items.filter(item => {
      if (item.completo || !item.finEstimado || !(servicio.categoria == params.EN_CURSO)) {
        return false;
      }

      const finEstimado = new Date(item.finEstimado);

      return finEstimado < fechaActual;
    });

    if (itemsValidos.length === 0) {
      return 0;
    }

    const totalDesvio = itemsValidos.reduce((suma, item) => {
      if (item.finEstimado) {
        const finEstimado = new Date(item.finEstimado);
        const diferenciaEnMilisegundos = fechaActual.getTime() - finEstimado.getTime();
        const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);
        return suma + diferenciaEnDias;
      }
      return suma;
    }, 0);

    return Math.round(totalDesvio);
  }

}
