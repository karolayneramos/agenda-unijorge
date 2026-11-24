import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { ParticipanteService } from '../../services/participante.service';
import { FORMAS_PAGAMENTO, Participante } from '../../models/participante';

@Component({
  selector: 'app-participante-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participante-form.html',
  styleUrl: './participante-form.css'
})
export class ParticipanteForm implements OnInit {
  modo: 'criar' | 'editar' = 'criar';
  eventoId = 0;
  participanteId: number | null = null;
  participante: Omit<Participante, 'id' | 'eventoId'> = {
    descricao: '',
    email: '',
    telefone: '',
    formaPagamento: 'PIX'
  };
  formas = FORMAS_PAGAMENTO;
  loading = false;
  saving = false;
  erro = '';
  vinculoValidado = false;

  constructor(
    private svc: ParticipanteService,
    private eventos: EventoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventoId = Number(this.route.snapshot.paramMap.get('eventoId'));
    if (!Number.isInteger(this.eventoId) || this.eventoId <= 0) {
      this.erro = 'O evento informado é inválido.';
      return;
    }

    const pid = this.route.snapshot.paramMap.get('participanteId');
    if (pid) {
      this.modo = 'editar';
      this.participanteId = Number(pid);
      if (!Number.isInteger(this.participanteId) || this.participanteId <= 0) {
        this.erro = 'O participante informado é inválido.';
        return;
      }
    }

    this.loading = true;
    this.eventos.buscarPorId(this.eventoId).subscribe({
      next: () => {
        if (this.modo === 'criar') {
          this.vinculoValidado = true;
          this.loading = false;
          return;
        }
        this.carregarParticipante();
      },
      error: () => {
        this.erro = 'O evento não existe ou não foi possível carregá-lo.';
        this.loading = false;
      }
    });
  }

  private carregarParticipante() {
    this.svc.buscarPorId(this.eventoId, this.participanteId!).subscribe({
      next: (participante) => {
        if (participante.eventoId !== this.eventoId) {
          this.erro = 'O participante não pertence a este evento.';
          this.loading = false;
          return;
        }
        this.participante = {
          descricao: participante.descricao,
          email: participante.email,
          telefone: participante.telefone,
          formaPagamento: participante.formaPagamento
        };
        this.vinculoValidado = true;
        this.loading = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar o participante.';
        this.loading = false;
      }
    });
  }

  salvar() {
    if (!this.vinculoValidado || this.saving || this.loading) return;

    this.saving = true;
    this.erro = '';
    const request = this.modo === 'criar'
      ? this.svc.criar(this.eventoId, this.participante)
      : this.svc.atualizar(this.eventoId, this.participanteId!, this.participante);

    request.subscribe({
      next: () => this.router.navigate(['/eventos', this.eventoId, 'participantes']),
      error: () => {
        this.erro = 'Não foi possível salvar o participante.';
        this.saving = false;
      }
    });
  }

  voltar() { this.router.navigate(['/eventos', this.eventoId, 'participantes']); }
}