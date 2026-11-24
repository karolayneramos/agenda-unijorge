import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento';
import { ParticipantesEvento } from '../participantes-evento/participantes-evento';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [FormsModule, CommonModule, ParticipantesEvento],
  templateUrl: './cadastro-evento.html',
  styleUrl: './cadastro-evento.css'
})
export class CadastroEvento implements OnInit {
  eventos: Evento[] = [];
  eventoSelecionado: number | null = null;
  evento: Omit<Evento, 'id'> = { titulo: '', data: '', local: '', emailResponsavel: '', vagas: 0 };
  loading = false;
  erro = '';

  constructor(private svc: EventoService) {}
  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true;
    this.erro = '';
    this.svc.listar().subscribe({
      next: (l) => { this.eventos = l; this.loading = false; },
      error: () => { this.erro = 'Não foi possível carregar os eventos.'; this.loading = false; }
    });
  }

  salvar() {
    this.erro = '';
    this.svc.criar(this.evento).subscribe({
      next: () => { this.evento = { titulo: '', data: '', local: '', emailResponsavel: '', vagas: 0 }; this.carregar(); },
      error: () => { this.erro = 'Não foi possível cadastrar o evento.'; }
    });
  }
}