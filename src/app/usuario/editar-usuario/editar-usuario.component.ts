import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { NuevoUsuario } from 'src/app/models/nuevo-usuario';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  usuario: Usuario;
  rolesList: string[] = ["medico", "practicante", "admin"];
  usuarioAct: NuevoUsuario;
  password: string;
  passwordConf: string;
  rolSelec: string;
  sub: string[];
  sup: string[];

  constructor(
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService
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
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
        this.router.navigate(['/listaUsuario']);
      }
    );
  }

  onUpdate(): void {

    if (confirm("Desea editar el alumno")) {
      const nombreUsuario = this.activatedRoute.snapshot.params.nombreUsuario;

      this.usuarioAct = new NuevoUsuario(this.usuario.nombre,
        this.usuario.nombreUsuario, this.usuario.email, this.password, [this.rolSelec], this.usuario.sub, this.usuario.sup);

      this.usuarioService.update(nombreUsuario, this.usuarioAct).subscribe(
        data => {
          this.toastr.success('Usuario Actualizado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/listaUsuario']);
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Fail', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      );
    }
  }

  roleType() {
    return this.tokenService.getAuthorities()[0];
  }

}
