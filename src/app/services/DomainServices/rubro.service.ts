import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBackend } from 'src/app/models/Url';
import { Rubro } from 'src/app/models/DomainModels/Rubro';

@Injectable({
  providedIn: 'root'
})
export class RubroService {

  urlBackend = new UrlBackend().getUrlBackend();
  getAllRubroUrl = this.urlBackend + '/rubro/getAll';

  constructor(private http: HttpClient) { }

  getAllRubro(): Observable<Rubro[]> {
    return this.http.get<Rubro[]>(this.getAllRubroUrl)
  }
}
