export class Padecimiento {

    catalogKey:string;
    nombreEs:string;
    nombreEn:string;
    nombreBr:string;
    cie10Es:string;
    cie10En:string;
    cie10Br:string;

    constructor(
        catalogKey:string,
        nombreEs:string,
        nombreEn:string,
        nombreBr:string,
        cie10Es:string,
        cie10En:string,
        cie10Br:string
    ){
        this.catalogKey = catalogKey;
        this.nombreEs = nombreEs;
        this.nombreEn = nombreEn;
        this.nombreBr = nombreBr;
        this.cie10Es = cie10Es;
        this.cie10En = cie10En;
        this.cie10Br = cie10Br;
    }
}
