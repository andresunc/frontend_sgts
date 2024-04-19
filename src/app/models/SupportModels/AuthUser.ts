import { RolDto } from "../ModelsDto/RolDto";

export class AuthUser {

    username?: string;
    id_usuario?: number;
    id_recurso?: number;
    message?: string;
    roles?: RolDto[];
    status?: boolean;
    jwt?: string;

    constructor () {
        
    }
}