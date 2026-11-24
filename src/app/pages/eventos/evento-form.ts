import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evento-form.html',
  styleUrl: './evento-form.css'
})
export class EventoForm implements OnInit {
  modo: 'criar' | 'editar' = 'criar';
  id: number | null = null;
  evento: Omit<Evento, 'id'> = { titulo: '', data: '', local: '', emailResponsavel: '', vagas: 0 };
  loading = false;
  saving = false;
  erro = '';

  constructor(private svc: EventoService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.modo = 'editar';
    this.id = Number(idParam);
    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.erro = 'O evento informado é inválido.';
      return;
    }

    this.loading = true;
    this.svc.buscarPorId(this.id).subscribe({
      next: (evento) => {
        this.evento = {
          titulo: evento.titulo,
          data: evento.data,
          local: evento.local,
          emailResponsavel: evento.emailResponsavel,
          vagas: evento.vagas
        };
        this.loading = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar o evento.';
        this.loading = false;
      }
    });
  }

  salvar() {
    if (this.saving || this.loading || (this.modo === 'editar' && this.id === null)) return;

    this.saving = true;
    this.erro = '';
    const request = this.modo === 'criar'
      ? this.svc.criar(this.evento)
      : this.svc.atualizar(this.id!, this.evento);

    request.subscribe({
      next: () => this.router.navigate(['/eventos']),
      error: () => {
        this.erro = 'Não foi possível salvar o evento.';
        this.saving = false;
      }
    });
  }

  voltar() { this.router.navigate(['/eventos']); }
}