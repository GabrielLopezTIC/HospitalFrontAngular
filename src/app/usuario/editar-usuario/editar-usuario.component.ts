import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { NuevoUsuario } from 'src/app/models/nuevo-usuario';
import { TokenService } from 'src/app/services/token.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  public usuario: Usuario;
  public rolesList:string[] = this.roleType()=="ROLE_ADMIN"? ["medico","admin"] : ["farmaceutico"];
  public rolSelec: string;
  public statusList = [{ clave: true, valor: 'Enable' }, { clave: false, valor: "Disable" }];
  public statusSelect: boolean;

  public usuarioAct: NuevoUsuario;
  public password: string = "";
  public passwordConf: string = "";
  public sub: string[];
  public sup: string[];
  public passConfirm:string='#f00';

  public creandoUsuario:boolean = false;
  constructor(
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private language: AuthService
  ) { }

  ngOnInit() {
    const nombreUsuario = this.activatedRoute.snapshot.params.nombreUsuario;
    this.usuarioService.details(nombreUsuario).subscribe(
      data => {
        this.usuario = data;
        if (this.usuario.roles[0]['rolNombre'] === 'ROLE_ADMIN') {
          this.rolSelec = 'admin';
        } else if (this.usuario.roles[0]['rolNombre'] === 'ROLE_MEDICO') {
          this.rolSelec = 'medico';
        } else if (this.usuario.roles[0]['rolNombre'] === 'ROLE_FARMACEUTICO') {
          this.rolSelec = 'farmaceutico';
        }
        this.statusSelect = this.usuario.enabled;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
        this.router.navigate(['/listaUsuario']);
      }
    );
  }

  public onUpdate(): void {
    if (confirm("Desea editar el usuario")) {
      const nombreUsuario = this.activatedRoute.snapshot.params.nombreUsuario;
      this.usuarioAct = new NuevoUsuario(this.usuario.nombre,
        this.usuario.nombreUsuario, this.usuario.email, this.password,this.statusSelect, [this.rolSelec], this.usuario.sub, this.usuario.sup);

        this.creandoUsuario= true;
        let textoCargando = this.lang()=="en"? "Updating user..." : this.lang()=="br"? "Atualizando usuário..." : "Actualizando usuario..." ;
        this.blockUI.start(textoCargando);
      this.usuarioService.update(nombreUsuario, this.usuarioAct).subscribe(
        data => {
          this.toastr.success('Usuario Actualizado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.creandoUsuario= false;
          this.blockUI.stop();
          this.router.navigate(['/listaUsuario']);
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
          this.creandoUsuario= false;
          this.blockUI.stop();
        }
      );
    }
  }

  public verifPass(): void{
    if(this.password != '' && (this.password == this.passwordConf)){
      this.passConfirm = 'white';
    }else{
      this.passConfirm='#f00';
    }
  }

  public roleType(): string {
    return this.tokenService.getAuthorities()[0];
  }

  public lang():string{
    return this.language.lang();
  }

}
