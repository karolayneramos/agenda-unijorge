import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Participante, FORMAS_PAGAMENTO } from '../../models/participante';
import { ParticipanteService } from '../../services/participante.service';

@Component({
  selector: 'app-participantes-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participantes-evento.html',
  styleUrl: './participantes-evento.css'
})
export class ParticipantesEvento implements OnInit {
  @Input() eventoId!: number;
  participantes: Participante[] = [];
  loading = false;
  erro = '';
  editando: Participante | null = null;
  novo = { descricao: '', email: '', telefone: '', formaPagamento: 'PIX' };
  formas = FORMAS_PAGAMENTO;

  constructor(private svc: ParticipanteService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.loading = true; this.erro = '';
    this.svc.listarPorEvento(this.eventoId).subscribe({
      next: (list) => { this.participantes = list; this.loading = false; },
      error: () => { this.erro = 'Erro ao carregar participantes'; this.loading = false; }
    });
  }

  adicionar() {
    this.svc.criar(this.eventoId, this.novo).subscribe({
      next: () => { this.novo = { descricao: '', email: '', telefone: '', formaPagamento: 'PIX' }; this.carregar(); },
      error: (e) => { this.erro = e?.error?.erro || 'Erro ao adicionar'; }
    });
  }

  iniciarEdicao(p: Participante) { this.editando = { ...p }; }

  salvarEdicao() {
    if (!this.editando) return;
    const { id, eventoId, ...dados } = this.editando;
    this.svc.atualizar(this.eventoId, id, dados).subscribe({
      next: () => { this.editando = null; this.carregar(); },
      error: (e) => { this.erro = e?.error?.erro || 'Erro ao editar'; }
    });
  }

  excluir(id: number) {
    if (!confirm('Excluir participante?')) return;
    this.svc.excluir(this.eventoId, id).subscribe({
      next: () => this.carregar(),
      error: () => { this.erro = 'Erro ao excluir'; }
    });
  }
}