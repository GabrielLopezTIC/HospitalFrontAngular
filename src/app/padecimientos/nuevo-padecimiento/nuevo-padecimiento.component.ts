import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Padecimiento } from 'src/app/models/padecimiento';
import { PadecimientoService } from 'src/app/services/padecimiento.service';
import { AuthService } from 'src/app/services/auth.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-nuevo-padecimiento',
  templateUrl: './nuevo-padecimiento.component.html',
  styleUrls: ['./nuevo-padecimiento.component.css']
})
export class NuevoPadecimientoComponent implements OnInit {

  nuevoPadecimiento: Padecimiento;
  catalogKey:string;
  nombreEs:string
  nombreEn:string;
  nombreBr:string;
  cie10Es:string;
  cie10En:string;
  cie10Br:string;
  @BlockUI() blockUI: NgBlockUI;


  constructor(
    private tokenService: TokenService,
    private padecimientoService: PadecimientoService,
    private router: Router,
    private toastr: ToastrService,
    private language: AuthService
  ) { }

  ngOnInit() {
  }



  onRegister(): void {
    if (confirm("¿Desea registrar el nuevo padecimiento?") === true) {
      this.blockUI.start(" ");
      this.nuevoPadecimiento = new Padecimiento(
        this.catalogKey,
        this.nombreEs,
        this.nombreEn,
        this.nombreBr,
        this.cie10Es,
        this.cie10En,
        this.cie10Br
      );
      this.padecimientoService.nuevo(this.nuevoPadecimiento).subscribe(
        data => {
          this.toastr.success('Padecimiento añadido', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.blockUI.stop()
          this.router.navigate(['/listaPadecimiento']);
        },
        err => {
          this.toastr.error(this.lang()=="es"? err.error.mensajeEs : 
          this.lang()=="en"? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
          this.blockUI.stop()
        }
      );
    }
  }


 
  public claveCatalogo(event){
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
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
