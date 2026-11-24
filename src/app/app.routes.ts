import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Pessoa } from './pessoa/pessoa';
import { Padrao } from './padrao/padrao';
import { Empresa } from './empresa/empresa';
import { NaoEncontrada } from './nao-encontrada/nao-encontrada';
import { EventoLista } from './pages/eventos/evento-lista';
import { EventoForm } from './pages/eventos/evento-form';
import { ParticipanteLista } from './pages/participantes/participante-lista';
import { ParticipanteForm } from './pages/participantes/participante-form';
import { PessoaLista } from './pages/pessoas/pessoa-lista';
import { EmpresaLista } from './pages/empresas/empresa-lista';
import { PadraoLista } from './pages/padrao/padrao-lista';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'pessoa', redirectTo: 'pessoas', pathMatch: 'full' },
  { path: 'pessoas', component: PessoaLista },
  { path: 'pessoas/novo', component: Pessoa },
  { path: 'pessoas/:id/editar', component: Pessoa },
  { path: 'padrao', component: PadraoLista },
  { path: 'padrao/novo', component: Padrao },
  { path: 'padrao/:id/editar', component: Padrao },
  { path: 'empresa', redirectTo: 'empresas', pathMatch: 'full' },
  { path: 'empresas', component: EmpresaLista },
  { path: 'empresas/novo', component: Empresa },
  { path: 'empresas/:id/editar', component: Empresa },
  { path: 'cadastro-evento', redirectTo: 'eventos', pathMatch: 'full' },
  { path: 'eventos', component: EventoLista },
  { path: 'eventos/novo', component: EventoForm },
  { path: 'eventos/:id/editar', component: EventoForm },
  { path: 'eventos/:eventoId/participantes', component: ParticipanteLista },
  { path: 'eventos/:eventoId/participantes/novo', component: ParticipanteForm },
  { path: 'eventos/:eventoId/participantes/:participanteId/editar', component: ParticipanteForm },
  { path: '**', component: NaoEncontrada }
];