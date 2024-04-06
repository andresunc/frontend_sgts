import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from 'src/app/models/DomainModels/Servicio';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class ServicioEntityService {

  urlBackend = new UrlBackend().getUrlBackend();
  upDateServicioUrl = this.urlBackend + '/servicio/update/';

  constructor(private http: HttpClient) { }

  // UpDate Servicio Empresa por Servicio ID
  public update(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(this.upDateServicioUrl + id, servicio);
  }
}
