export class TrackingStorage {

    idServicio?: number;
    eventLog?: string;
    data?: string;
    idRecurso?: number;
    dataResponsable?: string; // Se autocompleta en la base de datos mediante un trigger
    rol?: string;
    timestamp?: string; // Se autocompleta en la base de datos
    action?: string;

    constructor() {}

}