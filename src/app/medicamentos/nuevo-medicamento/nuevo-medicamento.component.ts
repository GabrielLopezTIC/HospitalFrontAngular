import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MedicamentoService } from 'src/app/services/medicamento.service';
import { AuthService } from 'src/app/services/auth.service';
import { Medicamento } from 'src/app/models/medicamento';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nuevo-medicamento',
  templateUrl: './nuevo-medicamento.component.html',
  styleUrls: ['./nuevo-medicamento.component.css']
})
export class NuevoMedicamentoComponent implements OnInit {


  nuevoMedicmento: Medicamento;
  productName: string;
  mrpDcp: string;
  legalBasis: string;
  rmpVersion: string;
  importantIdRisk_safetyConcernsEs: string;
  importantIdRisk_safetyConcernsEn: string;
  importantIdRisk_safetyConcernsBr: string;
  importantPotentialRisk_safetyConcernsEs: string;
  importantPotentialRisk_safetyConcernsEn: string;
  importantPotentialRisk_safetyConcernsBr: string;
  missing_info_safetyConcernsEs: string;
  missing_info_safetyConcernsEn: string;
  missing_info_safetyConcernsBr: string;



  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private medicService: MedicamentoService,
    private router: Router,
    private toastr: ToastrService
  ) { }



  ngOnInit(): void {

  }


  onRegister() {
    if (confirm("¿Desea registrar el nuevo medicamento?") === true) {
      console.log(this.missing_info_safetyConcernsEs);
      this.nuevoMedicmento = new Medicamento(
        this.productName,
        this.mrpDcp,
        this.legalBasis,
        this.rmpVersion,
        this.importantIdRisk_safetyConcernsEs,
        this.importantIdRisk_safetyConcernsEn,
        this.importantIdRisk_safetyConcernsBr,
        this.importantPotentialRisk_safetyConcernsEs,
        this.importantPotentialRisk_safetyConcernsEn,
        this.importantPotentialRisk_safetyConcernsBr,
        this.missing_info_safetyConcernsEs,
        this.missing_info_safetyConcernsEn,
        this.missing_info_safetyConcernsBr,
        null
      );

      
        console.log(this.nuevoMedicmento);
      this.medicService.nuevo(this.nuevoMedicmento).subscribe(
        data => {
          this.toastr.success('Medicamento añadido', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/listaMedicamento']);
        },
        err => {
          this.toastr.error("Error al registrar medicamento", 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

  lang() {
    return this.authService.lang();
  }

  roleType() {
    return this.tokenService.getAuthorities()[0];
  }
}
