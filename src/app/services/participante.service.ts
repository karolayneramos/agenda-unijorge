import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Evento } from '../models/evento';
import { Participante } from '../models/participante';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ParticipanteService {
  constructor(private http: HttpClient) {}

  listarPorEvento(eventoId: number): Observable<Participante[]> {
    return this.http.get<Participante[]>(`${API}/participantes`, { params: { eventoId } });
  }

  buscarPorId(_eventoId: number, id: number): Observable<Participante> {
    return this.http.get<Participante>(`${API}/participantes/${id}`);
  }

  criar(eventoId: number, p: Omit<Participante, 'id' | 'eventoId'>): Observable<Participante> {
    return this.http.get<Evento>(`${API}/eventos/${eventoId}`).pipe(
      switchMap(() => this.http.post<Participante>(`${API}/participantes`, { ...p, eventoId }))
    );
  }

  atualizar(eventoId: number, id: number, p: Omit<Participante, 'id' | 'eventoId'>): Observable<Participante> {
    return this.buscarPorId(eventoId, id).pipe(
      switchMap((participante) => {
        if (participante.eventoId !== eventoId) {
          return throwError(() => new Error('O participante não pertence a este evento.'));
        }
        return this.http.put<Participante>(`${API}/participantes/${id}`, { ...p, eventoId, id });
      })
    );
  }

  excluir(eventoId: number, id: number): Observable<void> {
    return this.buscarPorId(eventoId, id).pipe(
      switchMap((participante) => {
        if (participante.eventoId !== eventoId) {
          return throwError(() => new Error('O participante não pertence a este evento.'));
        }
        return this.http.delete<void>(`${API}/participantes/${id}`);
      })
    );
  }
}