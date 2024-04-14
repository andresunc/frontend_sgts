import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoItem } from 'src/app/models/DomainModels/TipoItem';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class TipoItemService {

  urlBackend = new UrlBackend().getUrlBackend();
  getTipoItemsUrl = this.urlBackend + '/tipoItem/getAll';

  constructor(private http: HttpClient) { }

  getTipoItems(): Observable<TipoItem[]> {
    return this.http.get<TipoItem[]>(this.getTipoItemsUrl);
  }
  
}
