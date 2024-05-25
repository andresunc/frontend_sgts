import { Pipe, PipeTransform } from '@angular/core';
import { Servicios } from 'src/app/models/DomainModels/Servicios';
import { Params } from 'src/app/models/Params';

@Pipe({
    name: 'hayNotificados'
})
export class HayNotificadosPipe implements PipeTransform {

    params: Params = new Params();
    transform(servicio: Servicios): boolean {
        console.log('PRUEBA de RECURSIVIDAD 6');
        const notNotify = servicio.itemChecklistDto.some(item => item.notificado);
        const isPresentado = servicio.estado === this.params.PRESENTADO;
        console.log('Hay notificados ', notNotify, isPresentado, (notNotify && isPresentado))
        return notNotify && isPresentado;
    }
}