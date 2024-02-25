export class RecursoDto {
    idRecurso: number;
    idPersona: number;
    nombre: string;
    apellido: string;
    dni: string;
    idRol: number;
    rol: string;

    constructor(idRecurso: number, idPersona: number, nombre: string, apellido: string, dni: string, idRol: number, rol: string) {
        this.idRecurso = idRecurso;
        this.idPersona = idPersona;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.idRol = idRol;
        this.rol = rol;
    }
}