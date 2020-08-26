import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MedicamentoService } from 'src/app/services/medicamento.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nuevo-medicamento',
  templateUrl: './nuevo-medicamento.component.html',
  styleUrls: ['./nuevo-medicamento.component.css']
})
export class NuevoMedicamentoComponent implements OnInit {


  productName: string;
  mrpDcp: string;
  legalBasis: string;
  rmpVersion: string;
  importantIdRisk_safetyConcernsEs:string;
  importantIdRisk_safetyConcernsEn:string;
  importantIdRisk_safetyConcernsBr:string;
  importantPotentialRisk_safetyConcernsEs:string;
  importantPotentialRisk_safetyConcernsEn:string;
  importantPotentialRisk_safetyConcernsBr:string;
  missing_info_safetyConcernsEs:string;
  missing_info_safetyConcernsEn:string;  
  missing_info_safetyConcernsBr:string;  



  constructor(
    private authService:AuthService,
    private tokenService:TokenService,
    private medicService:MedicamentoService
  ) { }



  ngOnInit(): void {
    
  }


  onRegister(){

  }

  lang(){
    return this.authService.lang();
  }

  roleType(){
    return this.tokenService.getAuthorities()[0];
  }
}
