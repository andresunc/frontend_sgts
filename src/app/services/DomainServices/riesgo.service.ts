import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBackend } from 'src/app/models/Url';
import { Riesgo } from 'src/app/models/DomainModels/Riesgo';

@Injectable({
  providedIn: 'root'
})
export class RiesgoService {

  urlBackend = new UrlBackend().getUrlBackend();
  getRiesgoNotDeletedUrl = this.urlBackend + '/riesgo/getAllNotDeleted';

  constructor(private http: HttpClient) { }

  // Método GET para obtener los estados de servicios no eliminados
  getRiesgoNotDeleted(): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(this.getRiesgoNotDeletedUrl)
  }

}
