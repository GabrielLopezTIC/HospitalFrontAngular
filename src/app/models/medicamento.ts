export class Medicamento {
    productName: string;
    mrpDcp: string;
    legalBasis: string;
    rmpVersion: string;
    importantRiskEs: string;
    importantRiskEn: string;
    importantRiskBr: string;

    importantPotentialRiskEs: string;
    importantPotentialRiskEn: string;
    importantPotentialRiskBr: string;

    missingInfoEs: string;
    missingInfoEn: string;
    missingInfoBr: string;

    contraindicaciones:Contraindicacion[];



    constructor( productName: string,
        mrpDcp: string,
        legalBasis: string,
        rmpVersion: string,
        importantRiskEs: string,
        importantRiskEn: string,
        importantRiskBr: string,
        importantPotentialRiskEs: string,
        importantPotentialRiskEn: string,
        importantPotentialRiskBr: string,
        missingInfoEs: string,
        missingInfoEn: string,
        missingInfoBr: string,
        contraindicaciones:Contraindicacion[]
        ){
            this.productName= productName;
            this.mrpDcp= mrpDcp;
            this.legalBasis= legalBasis;
            this.rmpVersion= rmpVersion;
            this.importantRiskEs= importantRiskEs;
            this.importantRiskEn= importantRiskEn;
            this.importantRiskBr= importantRiskBr;
            this.importantPotentialRiskEs= importantPotentialRiskEs;
            this.importantPotentialRiskEn= importantPotentialRiskEn;
            this.importantPotentialRiskBr= importantPotentialRiskBr;
            this.missingInfoEs= missingInfoEs;
            this.missingInfoEn= missingInfoEn;
            this.missingInfoBr= missingInfoBr;
            this.contraindicaciones=contraindicaciones;
        }
}

export class Contraindicacion{
    nombreProducto:string;
    alta:string;
    media:string;
    baja:string;
}
