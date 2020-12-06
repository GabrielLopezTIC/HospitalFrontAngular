import { Injectable } from '@angular/core';
import { CanDeactivate,ActivatedRouteSnapshot } from '@angular/router';
import { CuestionarioComponent } from '../cuestionario/cuestionario.component';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class ConfirmDeactivateGuardService implements CanDeactivate<CuestionarioComponent> {

  constructor(private lang:AuthService) { }

  canDeactivate(target: CuestionarioComponent){
    let texto = this.lang.lang() == "en"? 'When changing the page the changes will be lost, do you want to change the page?' : 
    this.lang.lang()== "br"? "Ao mudar a página, as mudanças serão perdidas, deseja mudar a página?" : 
    "Al cambiar de pagina se perderan los cambios, ¿deseas cambiar pagina?";

   /* if(target.hasChanges()){
      return window.confirm(texto);
  }*/
  return true;
  }
}
