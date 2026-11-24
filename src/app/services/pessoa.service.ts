import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PessoaCadastro, PessoaRascunho } from '../pessoa/pessoa.model';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class PessoaService {
  constructor(private http: HttpClient) {}

  listar(): Observable<PessoaCadastro[]> {
    return this.http.get<PessoaCadastro[]>(`${API}/pessoas`);
  }

  buscarPorId(id: number): Observable<PessoaCadastro> {
    return this.http.get<PessoaCadastro>(`${API}/pessoas/${id}`);
  }

  criar(pessoa: PessoaRascunho): Observable<PessoaCadastro> {
    return this.http.post<PessoaCadastro>(`${API}/pessoas`, pessoa);
  }

  atualizar(id: number, pessoa: PessoaRascunho): Observable<PessoaCadastro> {
    return this.http.put<PessoaCadastro>(`${API}/pessoas/${id}`, { ...pessoa, id });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/pessoas/${id}`);
  }
}
