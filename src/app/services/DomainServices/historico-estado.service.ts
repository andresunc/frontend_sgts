import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoricoEstado } from 'src/app/models/DomainModels/HistoricoEstado';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class HistoricoEstadoService {

  urlBackend = new UrlBackend().getUrlBackend();
  addNewHistoricoEstadoUrl = this.urlBackend + '/historicoestado/create';

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo servicio
  addHistoricoEstado(addHistoricoEstado: HistoricoEstado): Observable<HistoricoEstado> {
    return this.http.post<HistoricoEstado>(this.addNewHistoricoEstadoUrl, addHistoricoEstado);
  }
}
