import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MedicamentoService } from 'src/app/services/medicamento.service';
import { Medicamento } from 'src/app/models/medicamento';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-lista-medicamento',
  templateUrl: './lista-medicamento.component.html',
  styleUrls: ['./lista-medicamento.component.css']
})
export class ListaMedicamentoComponent implements OnInit {

  medicamentos:Medicamento[] = [];

  constructor(
    private authService:AuthService,
    private tokenService:TokenService,
    private medicamentoService:MedicamentoService
  ) { }

  ngOnInit(): void {
    this.medicamentoService.findAll().subscribe(
      data =>{
        this.medicamentos = data;
        console.log(data);
      },
      err =>{
      }
    );
  }

  eliminar(nombre:string){

  }


  roleType(){
    return this.tokenService.getAuthorities()[0];
  }

  lang():string{
    return this.authService.lang();
  }





}
