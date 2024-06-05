export class UsuarioDto {
    idUsuario?: number; //
    username?: string;
    password?: string;
    idPersona?: number; //
    nombre?: string;
    apellido?: string;
    dni?: string;
    telefono?: string;
    email?: string;
    rol?: string;
    isEnabled?: boolean; //

    constructor() {}
}