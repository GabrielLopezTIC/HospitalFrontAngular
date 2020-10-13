export class Usuario {

    nombre:string;
    nombreUsuario:string;
    email:string;
    password:string;
    enabled:boolean;
    roles: string[];
    sub:string[];
    sup:string[];

    constructor(
        nombre:string,
        nombreUsuario:string,
        email:string,
        enabled:boolean,
        password:string,
        roles:string[],
        sub:string[],
        sup:string[]
        ){
        this.nombre = nombre;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.enabled= enabled;
        this.password = password;
        this.roles = roles;
        this.sub = sub;
        this.sup = sup;
    }

}
