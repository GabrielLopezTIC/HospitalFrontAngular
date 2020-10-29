import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NuevoUsuario } from 'src/app/models/nuevo-usuario';
import { AuthService } from 'src/app/services/auth.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {


  public rolesList:string[] = this.roleType()=="ROLE_ADMIN"? ["medico","admin"] : ["farmaceutico"];
  public rolSelec: string;
  public statusList = [{ clave: true, valor: 'Enable' }, { clave: false, valor: "Disable" }];
  public statusSelect: boolean;

  public nuevoUsuario: NuevoUsuario;
  public nombre: string;
  public nombreUsuario: string;
  public email: string;
  public password: string;
  public passwordConf:string;
  
  sub:string[] = [];
  sup:string[] = [];

  public passConfirm:string='#f00';
  public creandoUsuario:boolean = false;
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService,
    private language: AuthService
  ) { }

  ngOnInit() {
    if(this.roleType() == "ROLE_MEDICO"){
      this.rolSelec = "farmaceutico";
      this.sup.push(this.tokenService.getUserName());
    }
  }

  /**
   * Verifica que las contraseñas introduccidas sean iguales y su no marca de rojo el campo
   */
  public verifPass(): void{
    if(this.password != '' && (this.password == this.passwordConf)){
      this.passConfirm = 'white';
    }else{
      this.passConfirm='#f00';
    }
  }

  public onRegister(): void {
    
    if(confirm("Desea registrar al usuario") === true ){
      this.nuevoUsuario = new NuevoUsuario(
        this.nombre, // nombre
        this.nombreUsuario, //nombre usuario
        this.email, // email
        this.password, //password
        this.statusSelect, // enabled
        [this.rolSelec], //roles
        this.sub, // sub
        this.sup // sup
        );
        this.creandoUsuario = true;
        let textoCargando = this.lang()=="en"? "Registering user..." : this.lang()=="br"? "Registrando usuário..." : "Registrando usuario..." ;
        this.blockUI.start(textoCargando);
      this.usuarioService.nuevo(this.nuevoUsuario).subscribe(
        data => {
        
          this.toastr.success('Cuenta Creada', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.creandoUsuario = false;
          this.blockUI.stop();
          this.router.navigate(['/listaUsuario']);
        },
        err => {
          this.toastr.error(this.lang()=="es"? err.error.mensajeEs : 
          this.lang()=="en"? err.error.mensajeEn : err.error.mensajeBr, 'Fail', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          this.creandoUsuario = false;
          this.blockUI.stop();
        }
      );
    }
  }

  public roleType(): string{
    return this.tokenService.getAuthorities()[0];
  }

  public lang():string{
    return this.language.lang();
  }
}
