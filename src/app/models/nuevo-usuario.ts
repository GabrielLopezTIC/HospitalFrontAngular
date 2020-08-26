export class NuevoUsuario {
    nombre: string;
    nombreUsuario: string;
    email: string;
    password: string;
    roles: String[];
    sub:string[];
    sup:string[];



    constructor(
        nombre: string,
        nombreUsuario: string,
        email: string,
        password: string,
        roles: String[],
        sub: string[],
        sup: string[]
        ) {
        this.nombre = nombre;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.sub = sub;
        this.sup = sup;
    }
}
