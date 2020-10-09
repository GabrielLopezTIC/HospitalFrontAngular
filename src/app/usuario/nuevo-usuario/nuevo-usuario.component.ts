import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NuevoUsuario } from 'src/app/models/nuevo-usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {

  public rolesList:string[] = this.roleType()=="ROLE_ADMIN"? ["medico","admin"] : ["farmaceutico"];

  public nuevoUsuario: NuevoUsuario;
  public nombre: string;
  public nombreUsuario: string;
  public email: string;
  public password: string;
  public passwordConf:string;
  public rolSelec: String;
  sub:string[] = [];
  sup:string[] = [];

  public passConfirm='#f00';

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
    if(this.password != '' && (this.password == this.passConfirm)){
      this.passConfirm = 'white';
    }else{
      this.passConfirm='#f00';
    }
  }

  public onRegister(): void {
    if(confirm("Desea registrar al usuario") === true ){
      this.nuevoUsuario = new NuevoUsuario(
        this.nombre,
        this.nombreUsuario,
        this.email,
        this.password,
        [this.rolSelec],
        this.sub,
        this.sup
        );
      this.usuarioService.nuevo(this.nuevoUsuario).subscribe(
        data => {
          //this.updateSubs(this.tokenService.getUserName());

          this.toastr.success('Cuenta Creada', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/listaUsuario']);
        },
        err => {
          this.toastr.error("Error al registrar el usuario", 'Fail', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

  /*
  updateSubsUser:NuevoUsuario;
  updateSubs(username:string){
    this.usuarioService.details(username).subscribe(
      data =>{
        this.updateSubsUser = data;
        this.updateSubsUser.sub.push(this.nombreUsuario);
        console.log("Subs locales actalizados");
      },
      err =>{
        console.log("Error al buscar el medico")
      }
    );
    this.usuarioService.update(username,this.updateSubsUser).subscribe(
      data =>{
        console.log("Subs server Actualizados")
      },
      err =>{
        console.log("Error al actualizar subs");
      }
    );
  }*/

  public roleType(): string{
    return this.tokenService.getAuthorities()[0];
  }

  public lang():string{
    return this.language.lang();
  }
}
