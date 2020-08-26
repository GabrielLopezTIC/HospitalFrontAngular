import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})
export class ListaUsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  roles: string[];
  isAdmin = false;
  clavePaciente:string;

  constructor(
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(
      rol => {
        if(rol == 'ROLE_ADMIN')
          this.isAdmin = true;
      }
    );
  }

  cargarUsuarios(): void {
    if(this.roleType() == "ROLE_ADMIN"){
      this.usuarioService.findAll().subscribe(
        data => {
          this.usuarios = data;
        },
        error =>{
          this.toastr.error("Tu sesión expiró o no tienes los permisos para ver esto", 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }else if(this.roleType() == "ROLE_MEDICO"){
      this.usuarioService.findAllBySup(this.tokenService.getUserName()).subscribe(
        data => {
          this.usuarios = data;
        },
        error =>{
          this.toastr.error("Tu sesión expiró o no tienes los permisos para ver esto", 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }




    
  }

  borrar(nombreUsuario:String): void{

    if(confirm("Borrar registro de "+nombreUsuario) === true){
    this.usuarioService.elimina(nombreUsuario).subscribe(
      data => {
        this.toastr.success('Usuario Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarUsuarios();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
    }
  }

  roleType(){
    return this.tokenService.getAuthorities()[0];
  }

  username(){
    return this.tokenService.getUserName();
  }

}
