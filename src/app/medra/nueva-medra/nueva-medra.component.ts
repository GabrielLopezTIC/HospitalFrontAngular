import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Medra } from 'src/app/models/medra';
import { AuthService } from 'src/app/services/auth.service';
import { MedraService } from 'src/app/services/medra.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-nueva-medra',
  templateUrl: './nueva-medra.component.html',
  styleUrls: ['./nueva-medra.component.css']
})
export class NuevaMedraComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  nuevoPadecimiento: Medra;
  medraEs:string
  medraEn:string;
  medraBr:string;
  socEs:string;
  socEn:string;
  socBr:string;


  constructor(
    private tokenService: TokenService,
    private medraService: MedraService,
    private router: Router,
    private toastr: ToastrService,
    private language: AuthService
  ) { }

  ngOnInit() {
  }



  onRegister(): void {
    if (confirm("¿Desea registrar el nuevo MedDRA?") === true) {
      this.blockUI.start(" ");
      this.nuevoPadecimiento = new Medra(
        this.socEs,
        this.socEn,
        this.socBr,
        this.medraEs,
        this.medraEn,
        this.medraBr
      );
      this.medraService.nuevo(this.nuevoPadecimiento).subscribe(
        data => {
          this.toastr.success('MedDRA añadido', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.blockUI.stop();
          this.router.navigate(['/listaMedra']);
        },
        err => {
          this.toastr.error(this.lang()=="es"? err.error.mensajeEs : 
          this.lang()=="en"? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
          this.blockUI.stop();
        }
      );
    }
  }


  public nombres(event){
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }



  roleType() {
    return this.tokenService.getAuthorities()[0];
  }

  public lang():string{
    return this.language.lang();
  }

}
