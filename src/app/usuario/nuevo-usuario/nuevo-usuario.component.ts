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

  rolesListAdmin:string[]=["medico","admin"];
  rolesListMedico:string[]=["farmaceutico"];
  rolesList:string[] = this.roleType()=="ROLE_ADMIN"? this.rolesListAdmin : this.rolesListMedico;


  nuevoUsuario: NuevoUsuario;
  nombre: string;
  nombreUsuario: string;
  email: string;
  password: string;
  passwordConf:string;
  rolSelec: String;
  sub:string[] = [];
  sup:string[] = [];




  errMsj: string;
  isLogged = false;
  passConfirm='#f00';

  constructor(
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService,
    private language: AuthService
  ) { }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    }

    if(this.roleType() == "ROLE_MEDICO"){
      this.rolSelec = "farmaceutico";
    }

    if(this.roleType() == "ROLE_MEDICO"){
      this.sup.push(this.tokenService.getUserName());
    }
  }

  verifPass(){
    if(this.password != '' && (this.password == this.passConfirm)){
      this.passConfirm = 'white';
    }else{
      this.passConfirm='#f00';
    }
  }

  onRegister(): void {
    if(confirm("Desea registrar al usuario") === true ){
      this.nuevoUsuario = new NuevoUsuario(this.nombre,
        this.nombreUsuario,
        this.email,
        this.password,
        [this.rolSelec],
        this.sub,
        this.sup
        );
      this.usuarioService.nuevo(this.nuevoUsuario).subscribe(
        data => {
          this.updateSubs(this.tokenService.getUserName());
          this.toastr.success('Cuenta Creada', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/listaUsuario']);
        },
        err => {
          this.errMsj = err.error.mensaje;
          this.toastr.error(this.errMsj, 'Fail', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

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
  }


  roleType(){
    return this.tokenService.getAuthorities()[0];
  }

  public lang():string{
    return this.language.lang();
  }
}
