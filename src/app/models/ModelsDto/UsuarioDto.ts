export class UsuarioDto {
    idUsuario?: number | null; //
    username?: string | null;
    password?: string | null;
    idRol?: number | null;
    rol?: string | null;
    idPersona?: number | null; //
    nombre?: string | null;
    apellido?: string | null;
    dni?: string | null;
    telefono?: string | null;
    email?: string | null;
    isEnabled?: boolean | null; //

    constructor() {}
}