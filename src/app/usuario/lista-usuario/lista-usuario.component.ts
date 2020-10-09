import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})
export class ListaUsuarioComponent implements OnInit {

  paginas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  usuarios: Usuario[] = [];
  roles: string[];
  isAdmin = false;
  clavePaciente:string;
  nombreUsuario:string;
  totalPages:number;

  constructor(
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private language: AuthService
  ) { }

  ngOnInit() {
    this.cargarRegistros(this.paginas[0] - 1, 10, "nombreUsuario");
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(
      rol => {
        if(rol == 'ROLE_ADMIN')
          this.isAdmin = true;
      }
    );
  }

  retrocede() {
    for (let i = 0; i < this.paginas.length; i++)
      this.paginas[i] -= 9;
  }

  primeroButton() { this.cargarRegistros(this.paginas[0] - 1, 10, "nombreUsuario"); }
  segundoButton() { this.cargarRegistros(this.paginas[1] - 1, 10, "nombreUsuario"); }
  terceroButton() { this.cargarRegistros(this.paginas[2] - 1, 10, "nombreUsuario"); }
  cuartoButton() { this.cargarRegistros(this.paginas[3] - 1, 10, "nombreUsuario"); }
  quintoButton() { this.cargarRegistros(this.paginas[4] - 1, 10, "nombreUsuario"); }
  sextoButton() { this.cargarRegistros(this.paginas[5] - 1, 10, "nombreUsuario"); }
  septimoButton() { this.cargarRegistros(this.paginas[6] - 1, 10, "nombreUsuario"); }
  octavoButton() { this.cargarRegistros(this.paginas[7] - 1, 10, "nombreUsuario"); }
  novenoButton() { this.cargarRegistros(this.paginas[8] - 1, 10, "nombreUsuario"); }

  avanza() {
    for (let i = 0; i < this.paginas.length; i++)
      this.paginas[i] += 9;
  }


  cargarRegistros(page: number, size: number, orderBy: string): void {
      this.usuarioService.findAllPagination(page, size, orderBy).subscribe(
        data => {
          this.usuarios = data['content'];
          this.totalPages = data['totalPages'];
        },
        error =>{
          this.toastr.error("Tu sesión expiró o no tienes los permisos para ver esto", 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
  }

  buscar(){
    this.usuarioService.details(this.nombreUsuario).subscribe(
      data => {
        this.usuarios = [];
        this.usuarios.push(data);
      },
      error => {
        this.toastr.error("Usuario no encontrado", '', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }









  borrar(nombreUsuario:String): void{

    if(confirm("Borrar registro de "+nombreUsuario) === true){
    this.usuarioService.elimina(nombreUsuario).subscribe(
      data => {
        this.toastr.success('Usuario Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarRegistros(this.paginas[0] - 1, 10, "nombreUsuario");
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

  public lang():string{
    return this.language.lang();
  }

}
