import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProdGuardService as guard } from './guards/prod-guard.service';
import { ListaUsuarioComponent } from './usuario/lista-usuario/lista-usuario.component';
import { ListaCuestionarioComponent } from './cuestionario/lista-cuestionario/lista-cuestionario.component';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { NuevoUsuarioComponent } from './usuario/nuevo-usuario/nuevo-usuario.component';
import { AdmComponent } from './adm/adm.component';
import { CuestionarioComponent } from './cuestionario/cuestionario.component';
import { EditarCuestionarioComponent } from './cuestionario/editar-cuestionario/editar-cuestionario.component';
import { ListaMedicamentoComponent } from './medicamentos/lista-medicamento/lista-medicamento.component';
import { PadecimientoListaComponent } from './padecimientos/padecimiento-lista/padecimiento-lista.component';
import { NuevoMedicamentoComponent } from './medicamentos/nuevo-medicamento/nuevo-medicamento.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'listaUsuario', component: ListaUsuarioComponent, canActivate: [guard], data: { expectedRol: ['admin', 'medico'] } }, 
  { path: 'listaMedicamento', component: ListaMedicamentoComponent, canActivate: [guard], data: { expectedRol: ['admin'] } },
  { path: 'listaPadecimiento', component: PadecimientoListaComponent, canActivate: [guard], data: { expectedRol: ['admin'] } },
  { path: 'listaCuestionario', component: ListaCuestionarioComponent, canActivate: [guard], data: { expectedRol: ['admin', 'medico'] } },
  { path: 'editarUsuario/:nombreUsuario', component: EditarUsuarioComponent, canActivate: [guard], data: { expectedRol: ['admin','medico'] } },
  { path: 'editarCuestionario/:claveCuestionario', component: EditarCuestionarioComponent, canActivate: [guard], data: { expectedRol: ['admin', 'medico'] } },
  { path: 'nuevoUsuario', component: NuevoUsuarioComponent, canActivate: [guard], data: { expectedRol: ['admin','medico'] } },
  { path: 'nuevoMedicamento', component: NuevoMedicamentoComponent, canActivate: [guard], data: { expectedRol: ['admin'] } },
  { path: 'administracion', component: AdmComponent, canActivate: [guard], data: { expectedRol: ['admin', 'medico'] } },
  { path: 'cuestionario', component: CuestionarioComponent, canActivate: [guard], data: { expectedRol: ['admin', 'medico', 'farmaceutico'] } },
  { path: 'estadisticas', component: EstadisticasComponent, canActivate: [guard], data: { expectedRol: ['admin','medico'] } },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
