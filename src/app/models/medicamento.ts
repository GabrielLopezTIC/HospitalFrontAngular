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
        missingInfoBr: string
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
        }
}
