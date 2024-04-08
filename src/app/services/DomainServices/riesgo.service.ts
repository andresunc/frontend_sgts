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
  getAllRiesgoUrl = this.urlBackend + '/riesgo/getAll';

  constructor(private http: HttpClient) { }

  getAllRiesgo(): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(this.getAllRiesgoUrl)
  }

}
